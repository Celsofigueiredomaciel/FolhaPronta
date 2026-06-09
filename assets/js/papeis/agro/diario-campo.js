// ============================================================
// FolhaPronta — papeis/agro/diario-campo.js
// Diário de Campo — registro diário de atividades — Plano Free
// ============================================================

const DiarioCampo = {

  id:        'diario-campo',
  nome:      'Diário de Campo',
  plano:     'free',
  categoria: 'agro',
  icone:     '🌾',
  descricao: 'Registro diário de atividades, clima e observações por talhão.',

  opcoes: {
    linhas: [
      { valor: 15, label: '15 linhas por página' },
      { valor: 20, label: '20 linhas por página' },
      { valor: 25, label: '25 linhas por página' },
    ],
  },

  async gerar(engine, config = {}) {
    const doc = engine.novoDoc();
    if (!doc) return null;

    const { quantPaginas = 1 } = config;

    for (let p = 1; p <= quantPaginas; p++) {
      if (p > 1) doc.addPage();
      this._gerarPagina(doc, engine, config, p);
    }

    return doc;
  },

  _gerarPagina(doc, engine, config, pagina) {
    const {
      produtor        = '',
      propriedade     = '',
      cultura         = '',
      talhao          = '',
      mesAno          = '',
      linhasPorPagina = 20,
      quantPaginas    = 1,
    } = config;

    const margemL = 12;
    const margemR = 198;
    const largura = margemR - margemL;
    let y = 10;

    // ── Cabeçalho ──────────────────────────────────────────────
    doc.setFillColor(22, 163, 74);
    doc.rect(margemL, y, largura, 12, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DIARIO DE CAMPO', margemL + 4, y + 8);

    if (quantPaginas > 1) {
      doc.setFontSize(8);
      doc.text(`Pag. ${pagina}/${quantPaginas}`, margemR - 4, y + 8, { align: 'right' });
    }

    y += 16;

    // ── Identificação ───────────────────────────────────────────
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);

    // Linha 1: Produtor | Propriedade
    doc.setFont('helvetica', 'bold');
    doc.text('Produtor:', margemL, y);
    doc.setFont('helvetica', 'normal');
    if (produtor) {
      doc.text(produtor, margemL + 20, y);
    } else {
      doc.line(margemL + 20, y, margemL + 80, y);
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Propriedade:', margemL + 95, y);
    doc.setFont('helvetica', 'normal');
    if (propriedade) {
      doc.text(propriedade, margemL + 120, y);
    } else {
      doc.line(margemL + 120, y, margemR, y);
    }

    y += 8;

    // Linha 2: Cultura | Talhão | Mês/Ano
    doc.setFont('helvetica', 'bold');
    doc.text('Cultura:', margemL, y);
    doc.setFont('helvetica', 'normal');
    if (cultura) {
      doc.text(cultura, margemL + 18, y);
    } else {
      doc.line(margemL + 18, y, margemL + 65, y);
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Talhao:', margemL + 70, y);
    doc.setFont('helvetica', 'normal');
    if (talhao) {
      doc.text(talhao, margemL + 85, y);
    } else {
      doc.line(margemL + 85, y, margemL + 130, y);
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Mes/Ano:', margemL + 135, y);
    doc.setFont('helvetica', 'normal');
    if (mesAno) {
      doc.text(mesAno, margemL + 153, y);
    } else {
      doc.line(margemL + 153, y, margemR, y);
    }

    y += 10;

    // ── Tabela ─────────────────────────────────────────────────
    // Data(22) | Atividade realizada(82) | Clima(30) | Observações(52)
    const colunas = [
      { label: 'Data',                w: 22 },
      { label: 'Atividade realizada', w: 82 },
      { label: 'Clima',               w: 30 },
      { label: 'Observacoes',         w: 52 },
    ];

    const alturaHeader = 8;
    const alturaLinha  = Math.min(10, (270 - y - alturaHeader) / linhasPorPagina);

    // Header
    doc.setFillColor(220, 252, 231);
    doc.rect(margemL, y, largura, alturaHeader, 'F');
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(0.5);
    doc.rect(margemL, y, largura, alturaHeader);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(22, 163, 74);

    let xCol = margemL;
    colunas.forEach((col, i) => {
      doc.text(col.label, xCol + 2, y + 5.5);
      if (i < colunas.length - 1) {
        doc.setDrawColor(22, 163, 74);
        doc.setLineWidth(0.3);
        doc.line(xCol + col.w, y, xCol + col.w, y + alturaHeader);
      }
      xCol += col.w;
    });

    y += alturaHeader;

    // Linhas
    doc.setTextColor(0, 0, 0);
    for (let i = 0; i < linhasPorPagina; i++) {
      const yL = y + i * alturaLinha;

      if (i % 2 !== 0) {
        doc.setFillColor(248, 255, 250);
        doc.rect(margemL, yL, largura, alturaLinha, 'F');
      }

      doc.setDrawColor(210, 210, 210);
      doc.setLineWidth(0.2);
      doc.line(margemL, yL + alturaLinha, margemR, yL + alturaLinha);

      xCol = margemL;
      colunas.forEach((col, ci) => {
        if (ci < colunas.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.line(xCol + col.w, yL, xCol + col.w, yL + alturaLinha);
        }
        xCol += col.w;
      });
    }

    // Borda externa
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(0.5);
    doc.rect(margemL, y, largura, linhasPorPagina * alturaLinha);

    // ── Rodapé ─────────────────────────────────────────────────
    // Marca d'água NÃO é escrita aqui: o pdf-engine.gerarComPlano()
    // adiciona automaticamente no plano free. Escrever aqui causaria
    // marca duplicada. Mantemos só a linha de assinatura.
    const yRodape = y + linhasPorPagina * alturaLinha + 6;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('Assinatura do responsavel: _________________________________', margemL, yRodape);
  },

  renderizarFormulario(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="config-form">
        <p class="config-desc">
          🌾 Preencha os campos de identificação (todos opcionais —
          pode deixar em branco para preencher à mão)
        </p>

        <div class="config-grid-2">
          <div class="input-group">
            <label class="input-label" for="cfg-produtor">Nome do produtor</label>
            <input type="text" class="input" id="cfg-produtor"
              placeholder="Ex: João Ferreira" maxlength="50">
          </div>
          <div class="input-group">
            <label class="input-label" for="cfg-propriedade">Propriedade / Fazenda</label>
            <input type="text" class="input" id="cfg-propriedade"
              placeholder="Ex: Sítio Boa Esperança" maxlength="50">
          </div>
        </div>

        <div class="config-grid-2">
          <div class="input-group">
            <label class="input-label" for="cfg-cultura">Cultura</label>
            <input type="text" class="input" id="cfg-cultura"
              placeholder="Ex: Soja, Milho, Cana" maxlength="30">
          </div>
          <div class="input-group">
            <label class="input-label" for="cfg-talhao">Talhão</label>
            <input type="text" class="input" id="cfg-talhao"
              placeholder="Ex: Talhão 1 — Área Norte" maxlength="40">
          </div>
        </div>

        <div class="config-grid-2">
          <div class="input-group">
            <label class="input-label" for="cfg-mes-ano">Mês / Ano</label>
            <input type="text" class="input" id="cfg-mes-ano"
              placeholder="Ex: Junho/2026" maxlength="20">
          </div>
          <div class="input-group">
            <label class="input-label" for="cfg-linhas">Linhas por página</label>
            <select class="select" id="cfg-linhas">
              <option value="15">15 linhas por página</option>
              <option value="20" selected>20 linhas por página</option>
              <option value="25">25 linhas por página</option>
            </select>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label" for="cfg-paginas">Quantidade de páginas</label>
          <select class="select" id="cfg-paginas">
            <option value="1">1 página</option>
            <option value="2">2 páginas</option>
            <option value="3">3 páginas</option>
          </select>
        </div>

        <button class="btn btn-primary btn-lg btn-gerar" id="btn-gerar-diario-campo">
          🌾 Gerar Diário de Campo
        </button>

        <p class="config-info" id="contador-geracoes"></p>
      </div>
    `;

    PDFEngine.atualizarContadorGeracoes();

    document.getElementById('btn-gerar-diario-campo').addEventListener('click', async () => {
      const config = {
        produtor:        document.getElementById('cfg-produtor').value,
        propriedade:     document.getElementById('cfg-propriedade').value,
        cultura:         document.getElementById('cfg-cultura').value,
        talhao:          document.getElementById('cfg-talhao').value,
        mesAno:          document.getElementById('cfg-mes-ano').value,
        linhasPorPagina: parseInt(document.getElementById('cfg-linhas').value),
        quantPaginas:    parseInt(document.getElementById('cfg-paginas').value),
        nomeArquivo:     'diario-campo',
      };

      await PDFEngine.gerarComPlano(
        this.id,
        (eng, cfg) => this.gerar(eng, cfg),
        config
      );
      window.FolhaPronta?.tracker?.registrar('diario-campo', 'agro');
    });
  },

  renderizarPreview(container, config = {}) {
    container.innerHTML = `
      <div style="font-family:sans-serif;font-size:10px;padding:4px;">
        <div style="background:#16A34A;color:#fff;padding:4px 6px;border-radius:3px;font-weight:bold;margin-bottom:6px;">
          🌾 DIÁRIO DE CAMPO
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:6px;font-size:8px;color:#444;">
          <span><b>Produtor:</b> ___________________</span>
          <span><b>Propriedade:</b> ______________</span>
          <span><b>Cultura:</b> __________________</span>
          <span><b>Talhão:</b> __________________</span>
        </div>
        <div style="border:1px solid #16A34A;border-radius:2px;overflow:hidden;">
          <div style="display:grid;grid-template-columns:22px 82px 30px 1fr;background:#DCFCE7;color:#16A34A;font-weight:bold;font-size:7px;padding:2px 3px;">
            <span>Data</span><span>Atividade</span><span>Clima</span><span>Obs.</span>
          </div>
          ${Array.from({ length: 6 }, (_, i) => `
            <div style="display:grid;grid-template-columns:22px 82px 30px 1fr;font-size:6px;padding:2px 3px;background:${i % 2 ? '#f8fff8' : '#fff'};border-top:1px solid #e5e5e5;">
              <span style="color:#aaa">__/__</span><span></span><span></span><span></span>
            </div>
          `).join('')}
          <div style="font-size:6px;color:#bbb;padding:2px 3px;text-align:center;">… mais 14 linhas</div>
        </div>
      </div>
    `;
  },

  obterConfig() {
    return {
      produtor:        document.getElementById('cfg-produtor')?.value    || '',
      propriedade:     document.getElementById('cfg-propriedade')?.value || '',
      cultura:         document.getElementById('cfg-cultura')?.value     || '',
      talhao:          document.getElementById('cfg-talhao')?.value      || '',
      mesAno:          document.getElementById('cfg-mes-ano')?.value     || '',
      linhasPorPagina: parseInt(document.getElementById('cfg-linhas')?.value  || '20'),
      quantPaginas:    parseInt(document.getElementById('cfg-paginas')?.value || '1'),
    };
  },
};

window.DiarioCampo = DiarioCampo;