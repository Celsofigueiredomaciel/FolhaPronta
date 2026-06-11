# FASE 0 + 1 — Execução (edições exatas)

Decisões aplicadas: tudo FREE · cadeados viram EM BREVE · seção/menu de planos sai · `.com.br` morre (domínio é de terceiros) · números passam a vir do registry.

Ordem de aplicação: D (registry) → C (gerador) → B (catálogo) → A (index) → E (CSS).
Teste após cada bloco. Commit por bloco.

---

## BLOCO D — registry.js (fazer PRIMEIRO)

**D1.** Todos os papéis com `plano: 'premium'` ou `plano: 'max'` mudam para `plano: 'free'`.
O campo que manda agora é só `ativo` (true = pronto, false = em breve).
*(Manter o campo `plano` no esquema para o futuro; só os valores mudam.)*

**D2.** Adicionar helper no final do arquivo:

```js
/**
 * Contagens derivadas — únicas fontes para qualquer número exibido no site.
 */
window.FolhaPronta.contagens = function() {
  const r = window.FolhaPronta.registry;
  return {
    total:      r.length,
    prontos:    r.filter(p => p.ativo).length,
    emBreve:    r.filter(p => !p.ativo).length,
    categorias: [...new Set(r.map(p => p.cat))].length,
    porCat:     Object.fromEntries(
                  [...new Set(r.map(p => p.cat))].map(c =>
                    [c, r.filter(p => p.cat === c).length])
                ),
  };
};
```

**D3 (correção de dado).** Conferir com a árvore real de `assets/js/papeis/`:
se `engenharia.js` e/ou `planner-semanal.js` NÃO existem como módulo funcional,
mudar `ativo: true → false` nessas duas entradas. Se existem, ver C4.

---

## BLOCO C — pages/gerador.html

**C1. Marca d'água do preview** (div `folha-marca-dagua`):
```
ANTES:  folhapronta.com.br
DEPOIS: folhapronta.app.br
```

**C2. Matar o PDF placeholder.** Em `carregarInterface`, o botão Gerar só ativa
se o módulo real existir. Substituir o bloco final da função:

```js
ANTES:
      if (bloqueado) {
        btnGerar.disabled = true;
        ...
      } else {
        btnGerar.disabled = false;
        btnGerar.addEventListener('click', () => executarGeracao(slug, info, modulo));
      }

DEPOIS:
      if (!modulo || typeof modulo.gerarPDF !== 'function') {
        // Papel EM BREVE — não gera PDF nem consome cota
        btnGerar.disabled = true;
        document.getElementById('btn-gerar-label').textContent = '🚧 Em breve';
        document.getElementById('footer-info').innerHTML =
          `<a href="../catalogo.html" style="color:var(--color-primary);font-weight:700;font-size:var(--text-xs);">Ver papéis disponíveis →</a>`;
      } else {
        btnGerar.disabled = false;
        btnGerar.addEventListener('click', () => executarGeracao(slug, info, modulo));
      }
```

**C3. Deletar funções mortas:** `gerarPDFPlaceholder` inteira e `hexToRgb`
(só era usada por ela). Em `executarGeracao`, remover o ramo
`else { await gerarPDFPlaceholder(info, config); }` — com C2 ele nunca executa,
mas código morto confunde.

**C4. Módulos fantasmas.** Se `engenharia.js` e `planner-semanal.js` existem,
adicionar ao `mapa` em `registrarModulos()`:
```js
'engenharia':      window.PapelEngenharia,      // conferir nome do global no arquivo
'planner-semanal': window.PapelPlannerSemanal,  // conferir nome do global no arquivo
```
E adicionar os `<script src>` deles junto dos outros módulos estáticos.
*(Abrir cada arquivo e conferir o nome exato do objeto global antes.)*

**C5. Estado vazio teimoso (defensivo).** Em `inicializar`, logo após
`document.getElementById('gerador-layout').classList.remove('hidden');` adicionar:
```js
document.getElementById('gerador-vazio').classList.add('hidden');
```
E investigar depois por que ele aparece (provável regra de display no gerador.css
sobrepondo `.hidden` — procurar `gerador-vazio` no CSS).

**C6. Modal limite diário** — remover o apelo de upgrade:
```
ANTES:  Você gerou os 10 PDFs gratuitos de hoje. O limite reinicia à meia-noite.
        Faça upgrade para o Premium e gere PDFs ilimitados.
        [Assinar Premium] [Aguardar amanhã]
DEPOIS: Você gerou os 10 PDFs gratuitos de hoje. O limite reinicia à meia-noite.
        [Entendi]  (botão único, fecha o modal)
```

**C7. Fallback form** — trocar placeholder genérico:
```
ANTES:  placeholder="Ex: Escola Municipal XYZ"
DEPOIS: placeholder="Ex: digite um título para a folha"
```
*(Exemplo por categoria fica pra Fase 3 — não travar agora.)*

**C8. Nav e footer:** remover item "Planos" do menu, botão "Ver planos",
e a coluna "Planos" do footer (ver A6/A7 — mesmo padrão).

**C9. Modal upgrade:** o bloco `modal-upgrade`, `UPGRADE_INFO` e
`abrirModalUpgrade` ficam sem uso (nenhum papel é mais bloqueado por plano).
Remover o HTML do modal e as funções. Em `inicializar`, remover
`const bloqueado = ...`, `if (bloqueado) abrirModalUpgrade(...)` e o
parâmetro `bloqueado` de `carregarInterface`.

---

## BLOCO B — catalogo.html

**B1. Stats do hero** — trocar os três números hardcoded por IDs e preencher via registry
(o registry.js já é carregado nesta página). HTML:
```html
<span class="catalogo-stat-num" id="stat-total">–</span>   (era 27)
<span class="catalogo-stat-num" id="stat-prontos">–</span> (era 12, label vira "disponíveis")
<span class="catalogo-stat-num" id="stat-cats">–</span>    (era 6)
```
No script da página:
```js
const c = window.FolhaPronta.contagens();
document.getElementById('stat-total').textContent   = c.total;
document.getElementById('stat-prontos').textContent = c.prontos;
document.getElementById('stat-cats').textContent    = c.categorias;
```

**B2. Contadores das pílulas de filtro** — dar um id ou data-attr e preencher do
`c.porCat` + `c.total`. (Os hardcoded hoje: Todos 23→26 e Agro 4→5 estão errados.)

**B3. Badges dos 12 cards trancados** (`Premium`/`Max` + 🔒 Desbloquear) e dos
**4 Agro sem módulo** (caderneta-campo, controle-insumos, diario-safra, recibo-rural):
```
ANTES:  <span class="badge-plano badge-premium">Premium</span>
        <span class="card-papel-acao">🔒 Desbloquear</span>
DEPOIS: <span class="badge-plano badge-embreve">Em breve</span>
        <span class="card-papel-acao">🔔 Me avise</span>
```
E em todos eles: `data-plano="premium|max"` → `data-status="em-breve"`,
classe `locked` → `embreve`. Cards prontos ganham `data-status="pronto"`.

**B4. Clique nos cards** — substituir o handler:
```js
ANTES:  abre modal de upgrade para premium/max
DEPOIS:
document.querySelectorAll('.card-papel').forEach(card => {
  card.addEventListener('click', () => {
    if (card.dataset.status === 'pronto' && card.dataset.href) {
      window.location.href = card.dataset.href;
      return;
    }
    // Em breve → abre WhatsApp pedindo aviso (vira pesquisa de demanda)
    const nome = card.querySelector('.card-papel-titulo')?.textContent || 'um papel';
    window.open('https://wa.me/5591988799352?text=' + encodeURIComponent(
      'Olá! Quero ser avisado quando o papel "' + nome + '" ficar pronto no FolhaPronta.'), '_blank');
  });
});
```
Remover `UPGRADE_INFO` e o HTML do `modal-upgrade`.

**B5. Banner CTA final** ("Desbloqueie todos os modelos... R$ 9,90/mês"):
```
DEPOIS:
<h3>💬 Sentiu falta de algum papel?</h3>
<p>Me conta qual modelo você precisa — os mais pedidos são os próximos a sair.</p>
[botão: Sugerir um papel → link WhatsApp]
```

**B6. Estilo do badge** — adicionar em components.css:
```css
.badge-embreve {
  background: var(--color-gray-100);
  color: var(--color-gray-500);
  border: 1px dashed var(--color-gray-300);
}
.card-papel.embreve { opacity: 0.85; }
```

**B7. Nav e footer:** mesmo padrão de A6/A7.

---

## BLOCO A — index.html

**A1. Badge do hero:** `100% gratuito para começar` → `100% gratuito. Sem cadastro.`

**A2. Stats do hero** — mesmo padrão de B1 (registry.js já é carregado aqui):
```
+30 modelos  → id="stat-total" (dinâmico → 26)
100% gratuito → mantém
0 cadastros  → REMOVER o terceiro stat e no lugar:
               <span class="stat-num" id="stat-cats">6</span>
               <span class="stat-label">categorias</span>
```

**A3. Categorias rápidas:** corrigir Escolar `6 modelos → 4 modelos` e
ADICIONAR o card Agro que falta:
```html
<a href="catalogo.html?cat=agro" class="categoria-card" style="--cat-cor:#16A34A; --cat-bg:#DCFCE7">
  <span class="cat-icone">🌾</span>
  <span class="cat-nome">Agro</span>
  <span class="cat-qtd">5 modelos</span>
</a>
```
*(Quantidades podem virar dinâmicas com `c.porCat` — opcional hoje.)*

**A4. Hero visual:** no card Partitura, `badge-premium">Premium` →
`badge-embreve">Em breve`.

**A5. Seção de planos** — substituir o card Free inteiro + manter o teaser:
```
Título da seção: "100% Gratuito para sempre" → MANTÉM (agora é verdade)
Card:
  ✓ Todos os modelos publicados
  ✓ 10 PDFs por dia
  ✓ Sem cadastro, sem cartão
  ✓ Marca d'água discreta no rodapé        ← vira ✓ informativo, sem dupla negação
  [Começar agora — é grátis]
Teaser (mantém, ajustando texto):
  "🚀 Pensando em planos Pro no futuro — sem marca d'água e PDFs ilimitados.
   Quer ser avisado se sair?" + botão WhatsApp existente
```

**A6. Nav:** remover `<li>...Planos...</li>` e o botão `Ver planos`.
No lugar do botão, pode subir o `Imprimir agora` sozinho.

**A7. Footer:** remover a coluna "Planos" inteira; na coluna Papéis,
adicionar `<li><a href="catalogo.html?cat=criativo">Criativos</a></li>` e
`<li><a href="catalogo.html?cat=agro">Agro</a></li>`.

**A8. Modal upgrade:** remover o HTML `modal-upgrade` (sem uso no index).

---

## BLOCO E — CSS (header/footer quebrados nas internas)

**E1. Diagnóstico:** procurar em `landing.css` as regras de
`.header`, `.nav`, `.nav-links`, `.nav-link`, `.nav-acoes`, `.btn-menu-mobile`,
`.footer`, `.footer-grid`, `.footer-col`, `.footer-titulo`, `.footer-links`,
`.footer-bottom`, `.lgpd-banner`, `.btn-whatsapp`.

**E2. Correção:** MOVER (não copiar) essas regras para `components.css`,
que todas as páginas já importam. Resultado: header e footer idênticos em
index, catálogo e gerador, desktop e mobile.

**E3. Validação:** abrir as 3 páginas em janela anônima + no Galaxy A01.
Header com menu horizontal e footer em grid nas três.

---

## GREP FINAL (obrigatório)

```bash
grep -rn "folhapronta.com.br" .   # deve retornar ZERO ocorrências
grep -rn "9,90\|24,90" .          # deve retornar ZERO fora de docs/
grep -rn "Desbloquear" .          # deve retornar ZERO
```

## Critério de aceite da Fase 0+1

Janela anônima, desktop e A01:
1. Nenhuma menção a preço, Premium, Max ou cadeado em página nenhuma.
2. Index, catálogo e pílulas mostram os MESMOS números (vindos do registry).
3. Card EM BREVE clicado → abre WhatsApp, não gera nada, não consome cota.
4. Papel pronto → gera PDF normal (testar pautado e diario-campo).
5. Papel em-breve por URL direta (?papel=controle-insumos) → botão "🚧 Em breve"
   desabilitado, cota intacta.
6. `grep` final limpo. Console limpo. Prints de tudo.

---
