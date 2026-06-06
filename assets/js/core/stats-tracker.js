/**
 * FolhaPronta — stats-tracker.js
 * Registra eventos de geração de PDF no Google Sheets.
 * LGPD: nenhum dado pessoal é coletado.
 * Apenas: nome do papel, categoria e data (sem hora, sem IP).
 */

(function () {
  const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbypachKkLOVxpI14nDNIgGejLZRkr1sCMfUCLrLskG4lqWGkM0zVomNGSz6H__NzczE/exec';

  window.FolhaPronta = window.FolhaPronta || {};

  window.FolhaPronta.tracker = {
    registrar(papel, categoria) {
      if (!SHEETS_URL) return;

      const params = new URLSearchParams({
        papel:     papel,
        categoria: categoria,
        data:      new Date().toISOString().slice(0, 10)
      });

      fetch(`${SHEETS_URL}?${params}`, {
        method:   'GET',
        mode:     'no-cors',
        redirect: 'manual',
      }).catch(() => {});
    }
  };
})();
