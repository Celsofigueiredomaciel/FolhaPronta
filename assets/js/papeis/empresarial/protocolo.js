// ============================================================
// FolhaPronta — papeis/empresarial/protocolo.js
// Livro de protocolo com colunas configuráveis — Plano Free
// ============================================================

const PapelProtocolo = {

  id:        'protocolo',
  nome:      'Protocolo',
  plano:     'free',
  categoria: 'empresarial',
  icone:     '📋',
  descricao: 'Livro de protocolo numerado para controle de documentos e correspondências.',

  // Colunas fixas: Nº(12) + Data(22) + Assunto(50) + Remetente(30) + Destinatário(30) + Assinatura(36) = 180mm
  _colunas: [
    { label: 'Nº',           w: 12 },
    { label: 'Data',         w: 22 },
    { label: 'Assunto',      w: 50 },
    { label: 'Remetente',    w: 30 },
    { label: 'Destinatário', w: 30 },
    { label: 'Assinatura',   w: 36 },
  ],

  opcoes: {
    linhas: [
      { valor: 20, label: '20 linhas por página' },
      { valor: 25, label: '25 linhas por página' },
      { valor: 30, label: '30 linhas por página' },
    ],
  },

  async gerar(engine, config = {}) {
    const doc = engine.novoDoc();
    if (!doc) return null;

    const {
      nomeEmpresa      = '',
      linhasPorPagina  = 25,
      numerarLinhas    = false,
      quantPaginas     = 1,
    } = config;

    for (let pagina = 1; pagina <= quantPaginas; pagina++) {
      if (pagina > 1) doc.addPage();
      this._gerarPagina(doc, engine, config, pagina);
    }

    return doc;
  },

  _gerarPagina(doc, engine, config, pagina) {
    const { largura, altura, margem: m } = engine.A4;
    const {
      nomeEmpresa     = '',
      linhasPorPagina = 25,
      numerarLinhas   = false,
      quantPaginas    = 1,
    } = config;

    // Calcula posições X de cada coluna
    let cx = m;
    const xs = this._colunas.map(col => { const x = cx; cx += col.w; return x; });

    let y = m;

    // ── Cabeçalho azul ──
    doc.setFillColor(37, 99, 235);
    doc.rect(m, y, 180, 13, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('LIVRO DE PROTOCOLO', largura / 2, y + 9, { align: 'center' });
    doc.setFontSize(8);
    doc.text(`Pág. ${pagina} / ${quantPaginas}`, m + 178, y + 9, { align: 'right' });
    y += 13;

    // ── Nome da empresa ──
    doc.setFillColor(243, 244, 246);
    doc.rect(m, y, 180, 9, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.rect(m, y, 180, 9, 'S');
    doc.setFontSize(8);
    if (nomeEmpresa) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text(nomeEmpresa, largura / 2, y + 6.5, { align: 'center' });
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(156, 163, 175);
      doc.text('Empresa / Organização: ________________________________________________', m + 4, y + 6.5);
    }
    y += 9;

    // ── Período ──
    doc.setFillColor(255, 255, 255);
    doc.rect(m, y, 180, 7, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Período: ____/____/______  a  ____/____/______', m + 4, y + 5);
    y += 7;

    // ── Cabeçalho das colunas ──
    const COL_H = 8;
    doc.setFillColor(31, 41, 55);
    doc.rect(m, y, 180, COL_H, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');

    this._colunas.forEach((col, i) => {
      const textX = xs[i] + col.w / 2;
      doc.text(col.label.toUpperCase(), textX, y + 5.5, { align: 'center' });
      if (i > 0) {
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.3);
        doc.line(xs[i], y, xs[i], y + COL_H);
      }
    });
    y += COL_H;

    // ── Linhas da tabela ──
    const yTabela = y;
    const altTabela = altura - m - yTabela;
    const ROW_H = altTabela / linhasPorPagina;
    const linhaBase = (pagina - 1) * linhasPorPagina + 1;

    for (let i = 0; i < linhasPorPagina; i++) {
      const ry = yTabela + i * ROW_H;

      // Fundo alternado
      if (i % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(249, 250, 251);
      }
      doc.rect(m, ry, 180, ROW_H, 'F');

      // Número sequencial na coluna Nº
      if (numerarLinhas) {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(String(linhaBase + i), xs[0] + this._colunas[0].w / 2, ry + ROW_H / 2 + 2.5, { align: 'center' });
      }

      // Linha inferior da row
      doc.setDrawColor(209, 213, 219);
      doc.setLineWidth(0.25);
      doc.line(m, ry + ROW_H, m + 180, ry + ROW_H);
    }

    // Borda externa da tabela
    doc.setDrawColor(107, 114, 128);
    doc.setLineWidth(0.5);
    doc.rect(m, yTabela, 180, linhasPorPagina * ROW_H, 'S');

    // Separadores verticais das colunas (sobre as linhas)
    this._colunas.forEach((col, i) => {
      if (i > 0) {
        doc.setDrawColor(209, 213, 219);
        doc.setLineWidth(0.3);
        doc.line(xs[i], yTabela, xs[i], yTabela + linhasPorPagina * ROW_H);
      }
    });
  },

  renderizarFormulario(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="config-form">
        <p class="config-desc">
          📋 Preencha as opções abaixo. O livro de protocolo é gerado com colunas
          para Nº, Data, Assunto, Remetente, Destinatário e Assinatura.
        </p>

        <div class="input-group">
          <label class="input-label" for="cfg-empresa">Nome da empresa (opcional)</label>
          <input type="text" class="input" id="cfg-empresa"
            placeholder="Ex: Prefeitura Municipal de Belém" maxlength="60">
        </div>

        <div class="input-group">
          <label class="input-label" for="cfg-linhas">Linhas por página</label>
          <select class="select" id="cfg-linhas">
            ${this.opcoes.linhas.map(op =>
              `<option value="${op.valor}" ${op.valor === 25 ? 'selected' : ''}>${op.label}</option>`
            ).join('')}
          </select>
        </div>

        <div class="config-checkboxes">
          <label class="checkbox-label">
            <input type="checkbox" id="cfg-numerar-linhas">
            Pré-numerar as linhas (Nº de protocolo)
          </label>
        </div>

        <div class="input-group">
          <label class="input-label" for="cfg-paginas">Quantidade de páginas</label>
          <select class="select" id="cfg-paginas">
            <option value="1">1 página</option>
            <option value="2">2 páginas</option>
            <option value="5">5 páginas</option>
            <option value="10">10 páginas</option>
          </select>
        </div>

        <button class="btn btn-primary btn-lg btn-gerar" id="btn-gerar-protocolo">
          📋 Gerar Livro de Protocolo
        </button>

        <p class="config-info" id="contador-geracoes"></p>
      </div>
    `;

    PDFEngine.atualizarContadorGeracoes();

    document.getElementById('btn-gerar-protocolo').addEventListener('click', async () => {
      const config = {
        nomeEmpresa:     document.getElementById('cfg-empresa').value,
        linhasPorPagina: parseInt(document.getElementById('cfg-linhas').value),
        numerarLinhas:   document.getElementById('cfg-numerar-linhas').checked,
        quantPaginas:    parseInt(document.getElementById('cfg-paginas').value),
        nomeArquivo:     'protocolo',
      };

      await PDFEngine.gerarComPlano(
        this.id,
        (eng, cfg) => this.gerar(eng, cfg),
        config
      );
      window.FolhaPronta?.tracker?.registrar('protocolo', 'empresarial');
    });
  }
};

window.PapelProtocolo = PapelProtocolo;
