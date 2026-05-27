/**
 * FolhaPronta — theme-toggle.js
 * Gerencia alternância entre tema claro e escuro
 */

(function () {
  const CHAVE       = 'fp-tema';
  const ICONE_DARK  = '🌙';
  const ICONE_LIGHT = '☀️';
  const META_COLOR_DARK  = '#111827';
  const META_COLOR_LIGHT = '#2563EB';

  function getTemaAtual() {
    return document.documentElement.getAttribute('data-tema') || 'light';
  }

  function aplicarTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);
    localStorage.setItem(CHAVE, tema);

    // Atualiza ícone do botão
    const btn = document.getElementById('btn-tema');
    if (btn) {
      const icone = btn.querySelector('.tema-icone');
      if (icone) icone.textContent = tema === 'dark' ? ICONE_LIGHT : ICONE_DARK;
      btn.setAttribute('aria-label',
        tema === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro');
    }

    // Atualiza meta theme-color
    const meta = document.getElementById('theme-color-meta');
    if (meta) {
      meta.setAttribute('content',
        tema === 'dark' ? META_COLOR_DARK : META_COLOR_LIGHT);
    }
  }

  function inicializar() {
    // Aplica o tema salvo (ou detectado no <head>)
    const temaSalvo = localStorage.getItem(CHAVE) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    aplicarTema(temaSalvo);

    // Botão de toggle
    const btn = document.getElementById('btn-tema');
    if (btn) {
      btn.addEventListener('click', () => {
        const novoTema = getTemaAtual() === 'dark' ? 'light' : 'dark';
        aplicarTema(novoTema);
      });
    }

    // Respeita mudança do sistema operacional
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem(CHAVE)) {
          aplicarTema(e.matches ? 'dark' : 'light');
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
  } else {
    inicializar();
  }
})();
