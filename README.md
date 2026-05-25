# 📄 FolhaPronta

Site de utilidade pública para geração e impressão de papéis formatados em PDF.
Sem cadastro, sem complicação — escolheu, personalizou, imprimiu.

---

## 🏗️ Arquitetura

### Princípios
- **Zero backend na Fase 1** — tudo roda no navegador (jsPDF)
- **Modular** — cada tipo de papel é um módulo JS independente
- **Escalável** — estrutura já preparada para backend nas Fases 2 e 3
- **LGPD ready** — cookies apenas com consentimento
- **Acessível** — foco em público amplo (escolar, empresarial, doméstico)

### Stack Fase 1 (atual)
- HTML5 + CSS3 + JavaScript puro (sem framework)
- jsPDF — geração de PDF no navegador
- html2canvas — captura de personalizações visuais
- GitHub Pages / Netlify — hospedagem gratuita

### Stack Fase 2 (futuro — Premium)
- Node.js + TypeScript (backend)
- MySQL (banco de dados)
- JWT + RBAC (autenticação)
- Mercado Pago (assinaturas)

---

## 📁 Estrutura de Pastas

```
folhapronta/
│
├── index.html                        ← Landing page principal
├── catalogo.html                     ← Catálogo de todos os papéis
├── README.md
│
├── pages/
│   ├── planos.html                   ← Página Free / Premium / Max
│   ├── privacidade.html              ← Política de privacidade (LGPD)
│   └── termos.html                   ← Termos de uso
│
├── components/
│   ├── header.html                   ← Cabeçalho reutilizável
│   ├── footer.html                   ← Rodapé com WhatsApp
│   ├── cookie-banner.html            ← Banner LGPD
│   └── modal-plano.html              ← Modal de upgrade de plano
│
├── assets/
│   ├── css/
│   │   ├── global.css                ← Variáveis, reset, tipografia
│   │   ├── components.css            ← Botões, cards, modais
│   │   ├── landing.css               ← Estilo da home
│   │   └── gerador.css               ← Estilo da tela de geração
│   │
│   ├── fonts/                        ← Fontes locais (opcional)
│   ├── icons/                        ← SVG icons
│   │
│   └── js/
│       ├── core/
│       │   ├── app.js                ← Inicialização e roteamento
│       │   ├── plano-guard.js        ← Controle de acesso por plano
│       │   ├── pdf-engine.js         ← Engine central jsPDF
│       │   ├── storage.js            ← localStorage (preferências)
│       │   ├── lgpd.js               ← Consentimento e cookies
│       │   └── whatsapp.js           ← Botão de feedback
│       │
│       ├── planos/
│       │   ├── planos.js             ← Definição dos planos e limites
│       │   └── upgrade.js            ← Lógica de upgrade (futura API)
│       │
│       └── papeis/
│           ├── escolar/
│           │   ├── pautado.js        ← Papel pautado (free)
│           │   ├── quadriculado.js   ← Papel quadriculado (free)
│           │   ├── caligrafia.js     ← Caligrafia infantil (premium)
│           │   └── milimetrado.js    ← Milimetrado (premium)
│           │
│           ├── tecnico/
│           │   ├── engenharia.js     ← Quadriculado engenharia (free)
│           │   ├── partitura.js      ← Partitura musical (premium)
│           │   └── isometrico.js     ← Papel isométrico (premium)
│           │
│           ├── empresarial/
│           │   ├── protocolo.js      ← Papel protocolo (free)
│           │   ├── ponto.js          ← Folha de ponto (free)
│           │   ├── requisicao.js     ← Requisição (premium)
│           │   ├── hora-extra.js     ← Hora extra (premium)
│           │   ├── ata-reuniao.js    ← Ata de reunião (premium)
│           │   └── ordem-servico.js  ← Ordem de serviço (max)
│           │
│           ├── recibos/
│           │   ├── recibo-simples.js     ← Recibo simples (free)
│           │   ├── recibo-comercial.js   ← Recibo comercial (premium)
│           │   ├── recibo-aluguel.js     ← Recibo aluguel (premium)
│           │   └── recibo-duas-vias.js   ← Duas vias A4 (premium)
│           │
│           └── criativo/
│               ├── planner-semanal.js    ← Planner semanal (free)
│               ├── bullet-journal.js     ← Bullet journal (premium)
│               ├── lista-tarefas.js      ← To-do list (free)
│               └── storyboard.js        ← Storyboard (max)
```

---

## 🎯 Planos

| Recurso                        | Free | Premium | Max |
|-------------------------------|------|---------|-----|
| Papéis básicos                | ✅   | ✅      | ✅  |
| Todos os papéis               | ❌   | ✅      | ✅  |
| Sem marca d'água              | ❌   | ✅      | ✅  |
| Personalização com logo       | ❌   | ✅      | ✅  |
| Salvar modelos personalizados | ❌   | ❌      | ✅  |
| Histórico de PDFs             | ❌   | ❌      | ✅  |
| Multi-usuário (empresa)       | ❌   | ❌      | ✅  |
| Banco de dados próprio        | ❌   | ❌      | ✅  |

---

## 🔒 LGPD

- Banner de consentimento de cookies na primeira visita
- Nenhum dado pessoal coletado no plano Free
- Política de privacidade completa em `/pages/privacidade.html`
- Personalização salva apenas em localStorage (dispositivo do usuário)
- Fase Premium/Max: consentimento explícito no cadastro

---

## 📱 Roadmap

### Fase 1 — MVP Free (agora)
- [x] Estrutura de pastas e arquitetura
- [ ] Landing page
- [ ] Catálogo de papéis
- [ ] 5 papéis funcionais gerando PDF
- [ ] Banner LGPD
- [ ] Botão WhatsApp feedback
- [ ] Deploy GitHub Pages

### Fase 2 — Premium
- [ ] Backend Node.js + MySQL
- [ ] Autenticação JWT
- [ ] Integração Mercado Pago
- [ ] Upload de logo
- [ ] Histórico de PDFs

### Fase 3 — Max
- [ ] Banco de dados por conta
- [ ] Templates salvos
- [ ] Multi-usuário
- [ ] API para integrações

---

## 💬 Feedback
Sugestões? [Fale pelo WhatsApp](https://wa.me/5591988799352?text=Oi!%20Tenho%20uma%20sugestão%20para%20o%20FolhaPronta:)