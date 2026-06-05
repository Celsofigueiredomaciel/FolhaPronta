// ============================================================
// FolhaPronta — papeis/escolar/quadriculado.js
// Papel quadriculado com grade configurável — Plano Free
// ============================================================

const PapelQuadriculado = {

  id:        'quadriculado',
  nome:      'Quadriculado',
  plano:     'free',
  categoria: 'escolar',
  icone:     '⬛',
  descricao: 'Grades quadriculadas com tamanho e cor configuráveis. Ideal para matemática e gráficos.',

  opcoes: {
    tamanhos: [
      { valor: 5,  label: 'Pequeno (5mm) — matemática e gráficos' },
      { valor: 7,  label: 'Médio (7mm) — uso geral' },
      { valor: 10, label: 'Grande (10mm) — desenho e infantil' },
    ],
    cores: [
      { valor: '#CCCCCC', label: 'Cinza claro (padrão)' },
      { valor: '#A5C8F0', label: 'Azul claro' },
      { valor: '#F0A5A5', label: 'Rosa claro' },
      { valor: '#A5F0B4', label: 'Verde claro' },
    ],
  },

  async gerar(engine, config = {}) {
    const doc = engine.novoDoc();
    if (!doc) return null;

    const {
      tamanho        = 7,
      corGrade       = '#CCCCCC',
      titulo         = '',
      numerarPaginas = false,
      quantPaginas   = 1,
    } = config;

    const rgb = this._hexToRgb(corGrade);

    for (let pagina = 1; pagina <= quantPaginas; pagina++) {
      if (pagina > 1) doc.addPage();

      const { largura, altura, margem: m } = engine.A4;
      const xL = m;
      const xR = largura - m;

      // ── Título (apenas na primeira página) ──
      let yInicio = m;
      if (titulo && pagina === 1) {
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(titulo, largura / 2, m + 5, { align: 'center' });

        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.5);
        doc.line(xL, m + 8, xR, m + 8);
        yInicio = m + 13;
      }

      const yF = altura - m;

      // ── Grade ──
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.setLineWidth(0.25);

      // Linhas horizontais
      let y = yInicio;
      while (y <= yF) {
        doc.line(xL, y, xR, y);
        y += tamanho;
      }

      // Linhas verticais — mesmo ponto de partida horizontal
      let x = xL;
      while (x <= xR) {
        doc.line(x, yInicio, x, yF);
        x += tamanho;
      }

      // ── Número de página ──
      if (numerarPaginas && quantPaginas > 1) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(`${pagina} / ${quantPaginas}`, largura / 2, altura - 6, { align: 'center' });
        doc.setTextColor(0, 0, 0);
      }
    }

    return doc;
  },

  _hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? {
      r: parseInt(r[1], 16),
      g: parseInt(r[2], 16),
      b: parseInt(r[3], 16),
    } : { r: 204, g: 204, b: 204 };
  },

  renderizarFormulario(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="config-form">

        <div class="input-group">
          <label class="input-label">Tamanho dos quadrados</label>
          <select class="select" id="cfg-tamanho">
            ${this.opcoes.tamanhos.map(op =>
              `<option value="${op.valor}" ${op.valor === 7 ? 'selected' : ''}>${op.label}</option>`
            ).join('')}
          </select>
        </div>

        <div class="input-group">
          <label class="input-label">Cor da grade</label>
          <select class="select" id="cfg-cor-grade">
            ${this.opcoes.cores.map(op =>
              `<option value="${op.valor}">${op.label}</option>`
            ).join('')}
          </select>
        </div>

        <div class="input-group">
          <label class="input-label">Título da folha (opcional)</label>
          <input type="text" class="input" id="cfg-titulo"
            placeholder="Ex: Matemática — 3º Ano" maxlength="60">
        </div>

        <div class="config-checkboxes">
          <label class="checkbox-label">
            <input type="checkbox" id="cfg-numerar">
            Numerar páginas
          </label>
        </div>

        <div class="input-group">
          <label class="input-label">Quantidade de páginas</label>
          <select class="select" id="cfg-paginas">
            <option value="1">1 página</option>
            <option value="2">2 páginas</option>
            <option value="5">5 páginas</option>
            <option value="10">10 páginas</option>
          </select>
        </div>

        <button class="btn btn-primary btn-lg btn-gerar" id="btn-gerar-quadriculado">
          📄 Gerar PDF Grátis
        </button>

        <p class="config-info" id="contador-geracoes"></p>
      </div>
    `;

    PDFEngine.atualizarContadorGeracoes();

    document.getElementById('btn-gerar-quadriculado').addEventListener('click', async () => {
      const config = {
        tamanho:        parseInt(document.getElementById('cfg-tamanho').value),
        corGrade:       document.getElementById('cfg-cor-grade').value,
        titulo:         document.getElementById('cfg-titulo').value,
        numerarPaginas: document.getElementById('cfg-numerar').checked,
        quantPaginas:   parseInt(document.getElementById('cfg-paginas').value),
        nomeArquivo:    'quadriculado',
      };

      await PDFEngine.gerarComPlano(
        this.id,
        (eng, cfg) => this.gerar(eng, cfg),
        config
      );
      window.FolhaPronta?.tracker?.registrar('quadriculado', 'escolar');
    });
  }
};

window.PapelQuadriculado = PapelQuadriculado;
