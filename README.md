# 📄 FolhaPronta

Gerador gratuito de papéis e documentos prontos para imprimir, em PDF, direto no navegador. Sem cadastro, sem instalação — escolha o modelo, personalize e imprima.

🔗 **Online:** [folhapronta.app.br](https://folhapronta.app.br)

---

## Sobre o projeto

O FolhaPronta resolve um problema cotidiano: precisar de um papel pautado, uma folha de ponto, um recibo ou uma caderneta de campo e não ter um modelo pronto à mão. Em vez de procurar arquivos soltos pela internet, o usuário escolhe um modelo, ajusta as opções e gera um PDF formatado em segundos — tudo gratuitamente.

O serviço é **100% gratuito** e funciona inteiramente no navegador: nenhum dado digitado pelo usuário é enviado a servidores.

---

## 🏗️ Arquitetura

- **Sem backend** — toda a geração de PDF acontece no navegador do usuário (client-side), com a biblioteca jsPDF.
- **Registry como fonte única** — um único arquivo (`registry.js`) define todo o catálogo de papéis: categorias, slugs, estado (ativo / em breve) e o módulo gerador de cada um. Páginas, contadores e o gerador leem dessa fonte, evitando dados duplicados e divergentes.
- **Modular** — cada papel funcional é um módulo JavaScript independente, carregado dinamicamente conforme a necessidade.
- **Privacidade por padrão** — sem cadastro, sem login, sem banco de dados de usuários. As preferências ficam em `localStorage`, no próprio dispositivo.
- **Hospedagem estática** — GitHub Pages, com domínio próprio.

### Stack

- HTML5, CSS3 e JavaScript puro (sem framework)
- [jsPDF](https://github.com/parallax/jsPDF) — geração de PDF no navegador
- Google Apps Script + Google Sheets — contagem anônima e agregada de acessos
- GitHub Pages — hospedagem

---

## 📁 Estrutura de pastas

```
FolhaPronta/
│
├── index.html                  ← Landing page
├── catalogo.html               ← Catálogo de todos os papéis
├── sitemap.xml / robots.txt    ← SEO
├── CNAME                        ← Domínio customizado (GitHub Pages)
│
├── pages/
│   ├── gerador.html            ← Tela de geração (lê o papel via ?papel=slug)
│   ├── termos.html             ← Termos de uso
│   ├── privacidade.html        ← Política de privacidade (LGPD)
│   ├── planos.html             ← Redirect para o catálogo
│   └── (demais .html)          ← Páginas de papéis / redirects
│
├── assets/
│   ├── css/
│   │   ├── global.css          ← Variáveis, reset, tipografia
│   │   ├── components.css      ← Botões, cards, header, footer
│   │   ├── landing.css         ← Estilo da home
│   │   ├── catalogo.css        ← Estilo do catálogo
│   │   └── gerador.css         ← Estilo da tela de geração
│   │
│   ├── icons/                  ← Logo (SVG) e og-image
│   │
│   └── js/
│       ├── core/
│       │   ├── registry.js     ← Catálogo: fonte única de papéis
│       │   ├── pdf-engine.js   ← Engine central de geração (jsPDF)
│       │   ├── stats-tracker.js← Contagem anônima de acessos
│       │   ├── theme-toggle.js ← Alternância de tema claro/escuro
│       │   └── lgpd.js         ← Aviso de privacidade / preferências
│       │
│       └── papeis/
│           ├── escolar/        ← pautado, quadriculado
│           ├── empresarial/    ← protocolo, ponto
│           ├── recibos/        ← recibo-simples, recibo-aluguel
│           ├── criativo/       ← lista-tarefas
│           └── agro/           ← diario-campo
│
└── docs/                       ← Documentação interna do projeto
```

---

## 📋 Papéis disponíveis

Os modelos abaixo geram PDF e estão funcionais. Outros aparecem no catálogo marcados como **"em breve"** e são adicionados conforme a demanda.

| Categoria    | Modelos funcionais                  |
|--------------|-------------------------------------|
| Escolar      | Pautado, Quadriculado               |
| Empresarial  | Protocolo, Folha de ponto           |
| Recibos      | Recibo simples, Recibo de aluguel   |
| Criativo     | Lista de tarefas                    |
| Agro         | Diário de campo                     |

---

## 🔒 Privacidade e LGPD

- Nenhum dado digitado nos formulários é enviado a servidores — o PDF é gerado localmente.
- Sem cadastro, login ou cobrança.
- Preferências (tema, último modelo, contagem diária) ficam apenas em `localStorage`.
- Estatísticas de acesso são anônimas e agregadas.
- Política completa em [`/pages/privacidade.html`](https://folhapronta.app.br/pages/privacidade.html).

---

## 💬 Contato

Sugestões ou dúvidas? [Fale pelo WhatsApp](https://wa.me/5591988799352).

---

<sub>Projeto autoral de Celso Figueiredo Maciel. Código sob licença MIT.</sub>