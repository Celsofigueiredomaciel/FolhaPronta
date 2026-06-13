BLOCO F — Visibilidade

F1. sitemap.xml (criar na RAIZ do projeto)

xml<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://folhapronta.app.br/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://folhapronta.app.br/catalogo.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://folhapronta.app.br/pages/termos.html</loc>
    <changefreq>yearly</changefreq>
    <priority>0.2</priority>
  </url>
  <url>
    <loc>https://folhapronta.app.br/pages/privacidade.html</loc>
    <changefreq>yearly</changefreq>
    <priority>0.2</priority>
  </url>
</urlset>

(O gerador fica de fora de propósito — tem noindex. Páginas de aterrissagem
por papel são candidatas à Parte 02.)

F2. robots.txt (criar na RAIZ)

User-agent: *
Allow: /
Disallow: /pages/gerador.html
Sitemap: https://folhapronta.app.br/sitemap.xml

F3. Canonical + domínio canônico

Adicionar no <head> de cada página:


index.html:    <link rel="canonical" href="https://folhapronta.app.br/">
catalogo.html: <link rel="canonical" href="https://folhapronta.app.br/catalogo.html">
pages/termos.html e pages/privacidade.html: canonical com a URL própria.


F4. Open Graph completo (preview bonito no WhatsApp)


VOCÊ cria a imagem: 1200×630 px, PNG, salvar em assets/icons/og-image.png.
Conteúdo sugerido: fundo azul da marca, logo, frase "O papel que você precisa,
pronto em segundos" e "100% grátis · folhapronta.app.br". Canva resolve em 10 min.
HAIKU adiciona no <head> do index.html e catalogo.html:


html<meta property="og:image" content="https://folhapronta.app.br/assets/icons/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

F5. Google Search Console (MANUAL — passo a passo)


Acessar https://search.google.com/search-console com sua conta Google.
"Adicionar propriedade" → escolher tipo Domínio → digitar folhapronta.app.br.
O Google fornece um registro TXT (algo como google-site-verification=XXXX).
No Registro.br → seu domínio → CONFIGURAR ZONA DNS (o mesmo painel do print)
→ NOVA ENTRADA → Tipo TXT, Nome em branco (ou folhapronta.app.br),
Dados = o código do Google → SALVAR ALTERAÇÕES.
Voltar ao Search Console → "Verificar". Se falhar, espera 30-60 min
(propagação DNS) e tenta de novo. NÃO recriar a entrada.
Verificado → menu "Sitemaps" → adicionar https://folhapronta.app.br/sitemap.xml.
Pronto. Indexação leva de dias a ~2 semanas. Conferir depois em
"Desempenho" e "Páginas".


Aceite F: https://folhapronta.app.br/sitemap.xml e /robots.txt abrem no
navegador; Search Console com domínio verificado e sitemap "Êxito".


BLOCO G — termos.html


Localizar a seção de planos/preços (linhas ~580-600, onde estão R$ 9,90 e R$ 24,90).
Remover a tabela/menção de valores e planos Premium/Max.
Substituir por:



Gratuidade do serviço. O FolhaPronta é atualmente oferecido de forma
gratuita, com limite de 10 (dez) gerações de PDF por dia por dispositivo e
marca d'água discreta no rodapé dos documentos. Caso planos pagos sejam
lançados no futuro, seus termos, valores e condições serão divulgados
previamente nesta página, sem efeito retroativo sobre o uso gratuito.




Revisar o restante do termos por outras menções a "Premium", "Max" ou
"assinatura" e ajustar.


Aceite G: grep -n "9,90\|24,90\|Premium\|Max" pages/termos.html → zero
ocorrências (exceto se "Max" aparecer em outra palavra).


BLOCO H — Acabamento visual

H1. Contraste da logo (a palavra "Folha" some no fundo escuro)

Tarefa investigativa: abrir assets/icons/logo.svg e identificar o fill do
texto "Folha". Duas soluções aceitáveis (escolher a mais simples no contexto):
a) Editar o SVG: trocar o fill escuro por currentColor ou um cinza claro
que funcione nos dois temas; ou
b) CSS: no tema escuro, aplicar [data-tema="dark"] .logo img { filter: brightness(0) invert(1); }
(mesmo truque já usado no footer).
Aceite: "FolhaPronta" legível por inteiro no header em tema claro E escuro,
no index e nas internas.

H2. Barras sticky cobrindo títulos (catálogo)


Em catalogo.css, conferir o top da .filtros-bar sticky — deve ficar
exatamente abaixo do header, com background sólido (sem transparência).
Adicionar: .categoria-secao { scroll-margin-top: 160px; } (ajustar o
valor: altura do header + barra de filtros + folga).
Mesmo tratamento no gerador.css para a .gerador-topbar se ela for sticky.
Aceite: rolando o catálogo inteiro, nenhum título de seção (Escolar,
Empresarial, Agro...) fica encoberto pela barra em posição de leitura.


H3. Balão do WhatsApp no mobile

Em components.css (onde o .btn-whatsapp vive agora), adicionar:

css@media (max-width: 480px) {
  .btn-whatsapp {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
    right: 12px;
    bottom: 12px;
  }
}

Aceite: no A01, o balão não cobre o CTA "Como funciona" do hero nem o
botão Gerar do gerador.

H4. Placeholders por categoria (gerador)


registry.js: adicionar campo exemplo em cada papel. Sugestões:

escolar: 'Ex: Escola Municipal Tiradentes'
tecnico: 'Ex: Projeto Residencial Silva'
empresarial: 'Ex: Comercial Pará Ltda'
recibos: 'Ex: Aluguel ref. junho/2026'
criativo: 'Ex: Semana 24 — junho'
agro: 'Ex: Fazenda Santa Luzia'



gerador.html, função renderizarFormularioFallback: trocar o placeholder
fixo por ${info.exemplo || 'Ex: digite um título'} (exige passar o campo
no REGISTRO — adicionar exemplo: papel.exemplo na montagem do mapa).
Aceite: abrir ?papel=controle-insumos → placeholder agro;
?papel=caligrafia → placeholder escolar.


H5. Medir cliques de "Me avise" (transforma curiosidade em dado)


catalogo.html: adicionar <script src="assets/js/core/stats-tracker.js"></script>
junto dos outros scripts.
No handler de clique dos cards em-breve, ANTES do window.open, adicionar:


jswindow.FolhaPronta?.tracker?.registrar?.(nome, 'me-avise');


Conferir na planilha se aparece a linha com categoria me-avise ao clicar.
Aceite: clicar em "Me avise" num card → linha nova na planilha + WhatsApp
abre normalmente. (Mesmo que a pessoa não envie a mensagem, o interesse fica
registrado — é seu ranking de demanda de graça.)



FICA DE FORA (de propósito)


Módulos Agro novos → aguardando feedback do agrônomo.
Páginas de aterrissagem por papel (SEO) → candidata forte à Parte 02,
decidir com dados do Search Console em mãos.
Mudanças estruturais de UX no gerador → esperar dados de uso real.


GREP/PROVA FINAL DA PARTE 01

bashgrep -rn "9,90\|24,90" pages/termos.html        # zero
curl -s https://folhapronta.app.br/robots.txt    # responde
curl -s https://folhapronta.app.br/sitemap.xml   # responde


Search Console verificado com sitemap aceito (print)
Logo legível nos 2 temas (print claro + escuro)
A01: balão não cobre CTA (print)
Planilha com linha me-avise (print)