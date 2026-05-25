// ============================================================
// FolhaPronta — lgpd.js
// Consentimento de cookies e conformidade LGPD
// ============================================================

const LGPD = {

  CHAVE_CONSENTIMENTO: 'fp_lgpd_aceito',
  CHAVE_DATA:          'fp_lgpd_data',

  // Verifica se já houve consentimento
  temConsentimento() {
    return localStorage.getItem(this.CHAVE_CONSENTIMENTO) === 'true';
  },

  // Registra consentimento do usuário
  registrarConsentimento() {
    localStorage.setItem(this.CHAVE_CONSENTIMENTO, 'true');
    localStorage.setItem(this.CHAVE_DATA, new Date().toISOString());
    this.ocultarBanner();
  },

  // Recusar apenas cookies não essenciais
  recusarOpcional() {
    // Mesmo recusando, registramos que o banner foi exibido
    // para não mostrar novamente nesta sessão
    sessionStorage.setItem('fp_lgpd_recusado_sessao', 'true');
    this.ocultarBanner();
  },

  // Exibe o banner se necessário
  exibirBannerSeNecessario() {
    if (this.temConsentimento()) return;
    if (sessionStorage.getItem('fp_lgpd_recusado_sessao')) return;

    // Pequeno delay para não aparecer imediatamente
    setTimeout(() => {
      const banner = document.getElementById('lgpd-banner');
      if (banner) {
        banner.classList.remove('hidden');
      }
    }, 1500);
  },

  // Oculta o banner
  ocultarBanner() {
    const banner = document.getElementById('lgpd-banner');
    if (banner) {
      banner.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => banner.classList.add('hidden'), 300);
    }
  },

  // Retorna data do consentimento formatada
  getDataConsentimento() {
    const data = localStorage.getItem(this.CHAVE_DATA);
    if (!data) return null;
    return new Date(data).toLocaleDateString('pt-BR');
  }
};

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  LGPD.exibirBannerSeNecessario();

  // Botão aceitar
  const btnAceitar = document.getElementById('lgpd-aceitar');
  if (btnAceitar) {
    btnAceitar.addEventListener('click', () => LGPD.registrarConsentimento());
  }

  // Botão recusar / só essenciais
  const btnRecusar = document.getElementById('lgpd-recusar');
  if (btnRecusar) {
    btnRecusar.addEventListener('click', () => LGPD.recusarOpcional());
  }
});

window.LGPD = LGPD;