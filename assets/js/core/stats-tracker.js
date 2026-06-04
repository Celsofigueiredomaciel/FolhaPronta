/**
 * FolhaPronta — stats-tracker.js
 * Registra eventos de geração de PDF no Google Sheets.
 * LGPD: nenhum dado pessoal é coletado.
 * Apenas: nome do papel, categoria e data (sem hora, sem IP).
 */

(function () {
  const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx5KeK_azfQHAc8Oe2AvPhO78wsSvsPswr-7cwWbS-pgldpARycvdGHzMcdxbedMGv_/exec';

  window.FolhaPronta = window.FolhaPronta || {};

  window.FolhaPronta.tracker = {
    registrar(papel, categoria) {
      if (!SHEETS_URL || SHEETS_URL === 'COLE_AQUI_A_URL_DO_APPS_SCRIPT') return;

      const payload = {
        papel:     papel,
        categoria: categoria,
        data:      new Date().toISOString().slice(0, 10)
      };

      // Fire-and-forget: não bloqueia nem exibe erro ao usuário
      fetch(SHEETS_URL, {
        method: 'POST',
        mode:   'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      }).catch(() => {});
    }
  };
})();
