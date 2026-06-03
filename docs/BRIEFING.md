# FolhaPronta — Briefing Técnico Completo

> **Gerado em:** 2026-06-02  
> **Finalidade:** Onboarding de modelo de IA avançado. Contém arquitetura, estado atual, roadmap e estratégia de negócio.

---

## 1. DESCRIÇÃO DO PROJETO

### O que é

**FolhaPronta** é uma plataforma web para geração de PDFs formatados e prontos para impressão, voltada ao mercado brasileiro. O usuário escolhe um modelo de papel (pautado, protocolo, recibo, etc.), configura as opções via formulário e baixa o PDF gerado inteiramente no navegador — sem necessidade de cadastro, servidor ou instalação.

### Proposta de Valor

- **Zero fricção:** nenhum cadastro exigido para o plano gratuito
- **100% no navegador:** geração de PDF client-side com jsPDF (sem backend na Fase 1)
- **Papéis prontos para uso real:** foco em documentos que pequenas empresas, freelancers, escolas e profissionais precisam imprimir no dia a dia
- **LGPD-first:** sem coleta de dados pessoais no plano gratuito; consentimento explícito implementado desde o início
- **Freemium claro:** limite de 10 gerações/dia no free, upgrade visível e contextual para remover restrições

### Público-Alvo

| Segmento | Uso Típico |
|----------|------------|
| Pequenas empresas | Recibos, protocolo, folha de ponto |
| Professores e escolas | Papel pautado, quadriculado, listas |
| Freelancers / autônomos | Recibo simples, recibo de aluguel |
| Escritórios e administradores | Ata de reunião, requisição de material |
| Agrícolas *(roadmap)* | Caderneta de campo, controle de safra |

---

## 2. STACK TECNOLÓGICA

### Fase 1 — MVP (atual)

| Camada | Tecnologia | Observação |
|--------|-----------|------------|
| Frontend | HTML5 + CSS3 + JavaScript (Vanilla) | Zero frameworks intencionalmente |
| Geração de PDF | jsPDF v2.5.1 (CDN) | Executa 100% no cliente |
| Captura de canvas | html2canvas (referenciado) | Uso esparso |
| Persistência | `localStorage` | Preferências, limite diário, consentimento LGPD |
| Hospedagem | GitHub Pages / Netlify | Site estático |
| Domínio | `folhapronta.app.br` | Configurado via arquivo `CNAME` |
| Fontes | Nunito (display) + Poppins (corpo) | Google Fonts |
| Ícones | SVG próprio (logo) | Sem biblioteca de ícones |
| Analytics | Google Sheets via Apps Script (stub) | URL ainda não configurada |

### Fase 2 — Premium (planejado)

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + TypeScript |
| Banco de dados | MySQL |
| Autenticação | JWT |
| Pagamentos | Mercado Pago (API brasileira) |
| Upload de arquivos | S3 ou similar (logos de empresa) |
| Deploy | Heroku / Railway / PaaS |

### Fase 3 — Max (planejado)

- Multi-tenant (contas de equipe)
- Templates salvos por usuário
- Histórico completo de gerações
- API de integração

---

## 3. ÁRVORE DE ARQUIVOS

```
FolhaPronta/
│
├── index.html                    # Landing page — hero, 3 passos, teaser de planos
├── catalogo.html                 # Catálogo completo (27 modelos, 6 categorias)
├── README.md                     # Documentação de arquitetura e roadmap
├── CNAME                         # Domínio customizado (folhapronta.app.br)
│
├── docs/
│   └── BRIEFING.md               # ← Este documento
│
├── pages/
│   ├── gerador.html              # Página mestre do gerador (carrega módulo por ?papel=ID)
│   ├── planos.html               # Página de preços (Free / Premium / Max)
│   ├── privacidade.html          # Política de privacidade LGPD (~1030 linhas)
│   ├── termos.html               # Termos de uso (~1012 linhas)
│   ├── pautado.html              # Redirect → gerador.html?papel=pautado
│   ├── quadriculado.html         # Redirect → gerador.html?papel=quadriculado
│   └── [outros papéis].html      # Idem — redirects individuais para SEO
│
├── components/
│   ├── header.html               # Navegação global com hambúrguer mobile
│   ├── footer.html               # Rodapé com links legais
│   ├── cookie-banner.html        # Banner LGPD reutilizável
│   └── modal-plano.html          # Modal de upgrade (contextual)
│
└── assets/
    │
    ├── css/
    │   ├── global.css            # Design tokens, tipografia, reset, dark mode
    │   ├── components.css        # Botões, cards, modais, badges, toasts (~15KB)
    │   ├── landing.css           # Seções hero, categorias, passos
    │   ├── planos.css            # Cards de planos e layout de preços
    │   ├── catalogo.css          # Grid do catálogo e filtros
    │   └── gerador.css           # Layout 2 colunas do gerador
    │
    ├── icons/
    │   └── logo.svg              # Logo do projeto
    │
    └── js/
        │
        ├── core/
        │   ├── pdf-engine.js     # Engine central de PDF (wrapper jsPDF)
        │   ├── lgpd.js           # Consentimento de cookies + localStorage
        │   ├── theme-toggle.js   # Alternância dark/light mode
        │   └── stats-tracker.js  # Stub: envio de stats ao Google Sheets
        │
        ├── planos/
        │   └── planos.js         # Definições de planos + PlanoGuard (controle de acesso)
        │
        └── papeis/
            ├── escolar/
            │   ├── pautado.js           ✅ Implementado — Papel pautado
            │   └── quadriculado.js      ✅ Implementado — Papel quadriculado
            │
            ├── empresarial/
            │   ├── protocolo.js         ✅ Implementado — Livro de protocolo
            │   └── ponto.js             ✅ Implementado — Folha de ponto mensal
            │
            ├── recibos/
            │   ├── recibo-simples.js    ✅ Implementado — Recibo simples (2 vias)
            │   └── recibo-aluguel.js    🚧 Stub / não finalizado
            │
            └── criativo/
                └── lista-tarefas.js     ✅ Implementado — Lista de tarefas
```

---

## 4. ARQUITETURA

### Visão Geral

```
Usuário
  │
  ▼
index.html / catalogo.html
  │  (link com ?papel=ID)
  ▼
pages/gerador.html
  │
  ├── Carrega dinamicamente: assets/js/papeis/[categoria]/[papel].js
  │     └── Módulo expõe: { id, nome, plano, gerar(), renderizarFormulario() }
  │
  ├── Chama: PapelXXX.renderizarFormulario(containerId)
  │     └── Injeta HTML do formulário no painel esquerdo
  │
  └── Botão "Gerar PDF" dispara: PDFEngine.gerarComPlano(papelId, funcaoGeracao, opcoes)
        │
        ├── PlanoGuard.podeGerar()          → verifica limite diário (localStorage)
        ├── PlanoGuard.podeAcessar(papelId) → verifica se plano autoriza o papel
        ├── PapelXXX.gerar(engine, config)  → gera o jsPDF doc
        ├── PDFEngine.adicionarMarcaDAgua() → watermark se plano free
        ├── PlanoGuard.registrarGeracao()   → incrementa contador diário
        └── PDFEngine.salvar(doc, nome)     → dispara download do PDF
```

### Fluxo de Roteamento

- Cada papel tem uma página própria (`pages/pautado.html`) para SEO
- Essas páginas usam `<meta http-equiv="refresh">` para redirecionar a `gerador.html?papel=pautado`
- O gerador resolve o parâmetro `papel` e carrega o módulo JS correspondente dinamicamente

### Padrão de Módulo de Papel

Cada arquivo em `papeis/` implementa a seguinte interface:

```javascript
const PapelXXX = {
  id:        'identificador-unico',    // Deve bater com ?papel= na URL
  nome:      'Nome Exibido',
  plano:     'free' | 'premium' | 'max',
  categoria: 'escolar' | 'empresarial' | 'recibos' | 'criativo' | 'tecnico' | 'agro',
  icone:     '📄',                     // Emoji usado no catálogo
  descricao: 'Descrição curta',

  opcoes: {                            // Opções configuráveis do papel
    campo1: { label, tipo, valores },
    // ...
  },

  async gerar(engine, config) {        // Recebe PDFEngine e config do formulário
    const doc = engine.novoDoc();      // jsPDF document
    // ... lógica de geração
    return doc;
  },

  renderizarFormulario(containerId) {  // Injeta HTML no container do gerador
    // ...
  }
};
```

### PDFEngine — API Interna

```javascript
PDFEngine.A4 = { largura: 210, altura: 297, margem: 15 };  // mm

PDFEngine.novoDoc(orientacao)             // Cria doc jsPDF (A4 portrait padrão)
PDFEngine.adicionarMarcaDAgua(doc)        // Insere rodapé "Gerado gratuitamente em..."
PDFEngine.adicionarCabecalho(doc, opcoes) // Cabeçalho com nome/logo da empresa
PDFEngine.salvar(doc, nomeArquivo)        // Download com nome sanitizado
PDFEngine.gerarComPlano(id, fn, opcoes)   // Orquestra todo o fluxo (ver diagrama acima)
```

### PlanoGuard — Controle de Acesso

```javascript
PlanoGuard.getPlanoAtual()           // 'free' (hardcoded Fase 1; futuro: JWT)
PlanoGuard.podeAcessar(papelId)      // boolean — papel no plano atual?
PlanoGuard.podeGerar()               // boolean — dentro do limite diário?
PlanoGuard.geracoesRestantes()       // number — contador restante do dia
PlanoGuard.registrarGeracao()        // incrementa fp_geracoes_[DATA] no localStorage
PlanoGuard.solicitarUpgrade(motivo)  // exibe modal de upgrade com mensagem contextual
```

---

## 5. MÓDULOS DE PAPEL

### Implementados ✅ (7 módulos — todos Free)

| ID | Nome | Categoria | Destaques |
|----|------|-----------|-----------|
| `pautado` | Papel Pautado | Escolar | Espaçamento 6/8/10/12mm, margens, título, data, paginação |
| `quadriculado` | Papel Quadriculado | Escolar | Grid 5/7/10mm, 4 cores (cinza/azul/rosa/verde), título |
| `protocolo` | Livro de Protocolo | Empresarial | Colunas pré-formatadas, 20/25/30 linhas/página, numeração |
| `ponto` | Folha de Ponto | Empresarial | Vista mensal 31 dias, entrada/saída manhã e tarde, horas extras, sábados/domingos coloridos |
| `recibo-simples` | Recibo Simples | Recibos | Duas vias em A4, campos: pagador, recebedor, valor, descrição, assinatura |
| `lista-tarefas` | Lista de Tarefas | Criativo | Checkboxes, 10/15/20/25 itens, prioridade A/M/B, numeração, tema roxo |
| `engenharia` | Folha de Engenharia | Técnico | Template para desenho técnico com bordas |

### Stubs — Premium (exibidos no catálogo, não geráveis)

| ID | Nome | Categoria |
|----|------|-----------|
| `caligrafia` | Caligrafia | Escolar |
| `milimetrado` | Papel Milimetrado | Técnico |
| `partitura` | Partitura Musical | Criativo |
| `isometrico` | Grid Isométrico | Técnico |
| `requisicao` | Requisição de Material | Empresarial |
| `hora-extra` | Folha de Hora Extra | Empresarial |
| `ata-reuniao` | Ata de Reunião | Empresarial |
| `recibo-comercial` | Recibo Comercial | Recibos |
| `recibo-aluguel` | Recibo de Aluguel | Recibos |
| `recibo-2vias` | Recibo 2 Vias | Recibos |
| `planner-semanal` | Planner Semanal | Criativo |
| `bullet-journal` | Bullet Journal | Criativo |
| `storyboard` | Storyboard | Criativo |

### Stubs — Max (exibidos no catálogo, não geráveis)

| ID | Nome | Categoria |
|----|------|-----------|
| `ordem-servico` | Ordem de Serviço | Empresarial |

### Categoria Agro (roadmap estratégico)

Nenhum módulo implementado ainda. Ver seção 8 — Estratégia Agro.

---

## 6. O QUE ESTÁ FUNCIONANDO

### Features Completas e Operacionais

| Feature | Implementação | Observação |
|---------|--------------|------------|
| Catálogo de papéis | `catalogo.html` | 27 cards com filtro por categoria, badges free/premium/max/em-breve |
| Gerador dinâmico | `pages/gerador.html` | Carrega módulo via URL param `?papel=ID` |
| Geração de PDF (7 papéis) | `assets/js/papeis/` | jsPDF client-side, sem servidor |
| Watermark no free | `pdf-engine.js` | Rodapé "Gerado gratuitamente em FolhaPronta.com.br" |
| Limite diário (10/dia) | `PlanoGuard` + `localStorage` | Contador por data `fp_geracoes_[DATA]` |
| Modal de upgrade | `components/modal-plano.html` | Aparece ao tentar acessar papel premium ou estourar limite |
| Banner de consentimento LGPD | `assets/js/core/lgpd.js` | Delay 1.5s, recusa por sessão, armazena data de aceite |
| Dark/light mode | `assets/js/core/theme-toggle.js` | Respeita preferência do OS, persiste em `fp-tema` |
| Landing page | `index.html` | Hero, 3 passos, seção de planos/teaser |
| Página de planos | `pages/planos.html` | Cards comparativos Free/Premium/Max com preços |
| Política de privacidade | `pages/privacidade.html` | Documento LGPD completo |
| Termos de uso | `pages/termos.html` | Documento legal completo |
| Responsividade | Todos os CSS | Mobile-first; menu hambúrguer; grid adaptativo |
| SEO por papel | `pages/[papel].html` | Redirect com meta-refresh para indexação individual |
| Domínio customizado | `CNAME` | `folhapronta.app.br` |

---

## 7. O QUE ESTÁ PENDENTE

### Bugs / Problemas Conhecidos

| Item | Descrição | Criticidade |
|------|-----------|-------------|
| `stats-tracker.js` URL | Variável `COLE_AQUI_A_URL_DO_APPS_SCRIPT` não configurada — analytics inativa | Baixa |
| `recibo-aluguel.js` | Stub incompleto ou arquivo ausente | Média |
| CSS do gerador mobile | Pode precisar ajuste em telas muito pequenas (<360px) | Baixa |

### Funcionalidades Pendentes (Fase 1 restante)

| Feature | Prioridade | Complexidade |
|---------|-----------|--------------|
| Implementar ~13 papéis Premium restantes | Alta | Média por papel |
| Configurar Google Sheets analytics | Baixa | Baixa |
| Otimizar `components.css` (~15KB) | Baixa | Baixa |
| Captura de email / lista de espera | Média | Baixa |

### Funcionalidades Planejadas (Fase 2 — Backend)

| Feature | Tier | Depende de |
|---------|------|-----------|
| Cadastro e autenticação | Premium | Node.js + JWT |
| Plano verificado por token (remover hardcode 'free') | Premium | Backend |
| Upload de logo da empresa | Premium | S3 + Backend |
| Integração Mercado Pago | Premium | Backend |
| Geração ilimitada sem watermark | Premium | Autenticação |
| Salvar templates personalizados | Max | Backend + MySQL |
| Histórico de gerações | Max | Backend + MySQL |
| Multi-usuário / equipes | Max | Backend + MySQL |

### Funcionalidades Planejadas (Fase 3 — Escala)

- API pública de geração de PDFs
- Integração com ERPs brasileiros
- White-label para revendedores
- Módulo Agro completo (ver seção 8)

---

## 8. OBJETIVOS DE NEGÓCIO

### Modelo de Monetização

```
Free (R$ 0/mês)
├── 10 gerações/dia
├── Watermark no rodapé
├── Sem logo de empresa
└── Sem histórico

Premium (R$ 9,90/mês)
├── Gerações ilimitadas
├── Sem watermark
├── Upload de logo
├── 20+ modelos de papel
└── Sem templates salvos

Max (R$ 24,90/mês)
├── Tudo do Premium
├── Templates personalizados salvos
├── Histórico completo
└── Acesso multi-usuário (equipes)
```

**Funil de conversão previsto:**
1. Usuário chega via busca orgânica (ex: "folha de ponto grátis")
2. Usa o free sem cadastro — sem fricção de entrada
3. Bate no limite diário ou tenta papel premium → modal de upgrade contextual
4. Converte para Premium via Mercado Pago

### Roadmap de Produtos

| Fase | Status | Objetivo |
|------|--------|---------|
| Fase 1 — MVP Free | 🔄 Em andamento | 27 papéis free funcionando, analytics, SEO |
| Fase 2 — Premium | ⏳ Planejado | Backend Node.js, auth, Mercado Pago, logos |
| Fase 3 — Max | ⏳ Planejado | Templates salvos, histórico, multi-usuário |
| Fase 4 — Agro | ⏳ Planejado | Categoria específica para o agronegócio brasileiro |

### Estratégia Agro

O segmento agro é identificado como oportunidade estratégica de diferenciação:

- **Público:** Produtores rurais, agrônomos, cooperativas, técnicos agrícolas
- **Dor:** Formulários e cadernetas de campo em papel ainda são obrigatórios por lei em muitos contextos (certificação, rastreabilidade, crédito rural)
- **Papéis planejados:** Caderneta de campo, controle de aplicação de defensivos, rastreabilidade de lote, registro de colheita, folha de ponto rural (com sazonalidade), ata de reunião de cooperativa
- **Diferencial competitivo:** Nenhum concorrente direto atende esse nicho com PDFs prontos e gratuitos em português
- **Monetização:** Potencial para plano Agro específico ou parceria com cooperativas/ERPs rurais

### Posicionamento de Mercado

- **Concorrentes indiretos:** Canva (internacional, pago para PDFs), Google Docs (genérico), planilhas customizadas
- **Vantagem:** Especialização em papéis para impressão + zero fricção + gratuito com limite
- **SEO:** URLs amigáveis por papel + páginas individuais para indexação por modelo específico

---

## 9. LINKS IMPORTANTES

| Recurso | URL / Localização |
|---------|------------------|
| Site em produção | `https://folhapronta.app.br` |
| Domínio configurado | Arquivo `CNAME` na raiz do repositório |
| Repositório GitHub | *(configurado no remote git do projeto)* |
| Google Sheets Analytics | A ser configurado em `assets/js/core/stats-tracker.js` |
| Documentação do jsPDF | `https://raw.githack.com/MrRio/jsPDF/master/docs/` |
| Mercado Pago API (futuro) | `https://www.mercadopago.com.br/developers/` |

---

## Apêndice — Chaves do localStorage

| Chave | Tipo | Descrição |
|-------|------|-----------|
| `fp-tema` | `'light'` \| `'dark'` | Preferência de tema |
| `fp_lgpd_aceito` | boolean | Consentimento LGPD aceito |
| `fp_lgpd_data` | ISO string | Timestamp do aceite LGPD |
| `fp_plano` | `'free'` | Plano atual (hardcoded Fase 1) |
| `fp_geracoes_YYYY-MM-DD` | number | Contador de gerações do dia |

---

## Apêndice — Design Tokens

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#2563EB` | Azul principal (ações, links) |
| `--color-secondary` | `#10B981` | Verde (sucesso, confirmação) |
| `--color-accent` | `#F59E0B` | Âmbar (avisos, destaques) |
| `--color-plan-free` | `#6B7280` | Badge/card do plano free |
| `--color-plan-premium` | `#2563EB` | Badge/card do plano premium |
| `--color-plan-max` | `#7C3AED` | Badge/card do plano max |
| Base de espaçamento | `8px` | Grid de layout |
| Fonte display | Nunito | Títulos e cabeçalhos |
| Fonte corpo | Poppins | Textos e UI |

---

*Documento gerado por Claude Code — FolhaPronta v1 (Fase 1 MVP)*
