// ============================================================
// FolhaPronta — papeis/escolar/pautado.js
// Papel pautado com opções de espaçamento — Plano Free
// ============================================================

const PapelPautado = {

  id:       'pautado',
  nome:     'Papel Pautado',
  plano:    'free',
  categoria: 'escolar',
  icone:    '📝',
  descricao: 'Linhas horizontais para escrita. Ideal para estudantes e anotações.',

  // Opções de configuração
  opcoes: {
    espacamentos: [
      { valor: 6,  label: 'Estreito (6mm) — caligrafia fina' },
      { valor: 8,  label: 'Normal (8mm) — uso geral' },
      { valor: 10, label: 'Largo (10mm) — letra maior' },
      { valor: 12, label: 'Extra largo (12mm) — infantil' },
    ],
    margens: [
      { valor: 'sem',    label: 'Sem margem' },
      { valor: 'simples', label: 'Margem simples (esquerda)' },
      { valor: 'dupla',   label: 'Margem dupla (esquerda e direita)' },
    ],
    linhasCor: [
      { valor: '#CCCCCC', label: 'Cinza claro (padrão)' },
      { valor: '#A5C8F0', label: 'Azul claro' },
      { valor: '#F0A5A5', label: 'Rosa claro' },
      { valor: '#A5F0B4', label: 'Verde claro' },
    ]
  },

  // Gera o PDF do papel pautado
  async gerar(engine, config = {}) {
    const doc = engine.novoDoc();
    if (!doc) return null;

    const {
      espacamento  = 8,
      margem       = 'simples',
      corLinha     = '#CCCCCC',
      titulo       = '',
      linhasData   = false,
      numerarPaginas = false,
      quantPaginas = 1,
    } = config;

    // Converte cor hex para RGB
    const rgb = this._hexToRgb(corLinha);

    for (let pagina = 1; pagina <= quantPaginas; pagina++) {
      if (pagina > 1) doc.addPage();

      const { largura, altura, margem: margemDoc } = engine.A4;
      const margemEsq = margemDoc;
      const margemDir = largura - margemDoc;
      const margemTop = margem === 'com-titulo' ? 35 : margemDoc;
      const margemBot = altura - margemDoc;

      // ── Título da página (opcional) ──
      if (titulo && pagina === 1) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(titulo, largura / 2, margemDoc + 5, { align: 'center' });

        // Linha abaixo do título
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.5);
        doc.line(margemEsq, margemDoc + 8, margemDir, margemDoc + 8);
      }

      const yInicio = titulo && pagina === 1 ? margemDoc + 14 : margemTop;

      // ── Margem vertical (linha vermelha) ──
      if (margem === 'simples' || margem === 'dupla') {
        doc.setDrawColor(220, 80, 80);
        doc.setLineWidth(0.4);
        doc.line(margemEsq + 15, margemTop, margemEsq + 15, margemBot);
      }

      if (margem === 'dupla') {
        doc.line(margemDir - 5, margemTop, margemDir - 5, margemBot);
      }

      // ── Linhas de pauta ──
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.setLineWidth(0.3);

      let y = yInicio;
      while (y <= margemBot) {
        doc.line(margemEsq, y, margemDir, y);
        y += espacamento;
      }

      // ── Campo de data (opcional) ──
      if (linhasData) {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'normal');
        doc.text('Data: ___/___/______', margemDir - 40, margemDoc + 4);
        doc.setTextColor(0, 0, 0);
      }

      // ── Número de página (opcional) ──
      if (numerarPaginas && quantPaginas > 1) {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `${pagina} / ${quantPaginas}`,
          largura / 2,
          altura - 6,
          { align: 'center' }
        );
        doc.setTextColor(0, 0, 0);
      }
    }

    return doc;
  },

  // Utilitário: converte HEX para RGB
  _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 204, g: 204, b: 204 };
  },

  // Monta o formulário de configuração na tela
  renderizarFormulario(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="config-form">

        <div class="input-group">
          <label class="input-label" for="cfg-espacamento">Espaçamento entre linhas</label>
          <select class="select" id="cfg-espacamento">
            ${this.opcoes.espacamentos.map(op =>
              `<option value="${op.valor}" ${op.valor === 8 ? 'selected' : ''}>
                ${op.label}
              </option>`
            ).join('')}
          </select>
        </div>

        <div class="input-group">
          <label class="input-label" for="cfg-margem">Margem lateral</label>
          <select class="select" id="cfg-margem">
            ${this.opcoes.margens.map(op =>
              `<option value="${op.valor}" ${op.valor === 'simples' ? 'selected' : ''}>
                ${op.label}
              </option>`
            ).join('')}
          </select>
        </div>

        <div class="input-group">
          <label class="input-label" for="cfg-cor-linha">Cor das linhas</label>
          <select class="select" id="cfg-cor-linha">
            ${this.opcoes.linhasCor.map(op =>
              `<option value="${op.valor}">${op.label}</option>`
            ).join('')}
          </select>
        </div>

        <div class="input-group">
          <label class="input-label" for="cfg-titulo">Título da folha (opcional)</label>
          <input type="text"
            class="input"
            id="cfg-titulo"
            placeholder="Ex: Disciplina de Português"
            maxlength="60">
        </div>

        <div class="config-checkboxes">
          <label class="checkbox-label" for="cfg-data">
            <input type="checkbox" id="cfg-data">
            Campo de data no topo
          </label>
          <label class="checkbox-label" for="cfg-numerar">
            <input type="checkbox" id="cfg-numerar">
            Numerar páginas
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

        <button class="btn btn-primary btn-lg btn-gerar" id="btn-gerar-pautado">
          📄 Gerar PDF Grátis
        </button>

        <p class="config-info" id="contador-geracoes"></p>
      </div>
    `;

    // Atualiza contador
    PDFEngine.atualizarContadorGeracoes();

    // Evento do botão
    document.getElementById('btn-gerar-pautado').addEventListener('click', async () => {
      const config = {
        espacamento:    parseInt(document.getElementById('cfg-espacamento').value),
        margem:         document.getElementById('cfg-margem').value,
        corLinha:       document.getElementById('cfg-cor-linha').value,
        titulo:         document.getElementById('cfg-titulo').value,
        linhasData:     document.getElementById('cfg-data').checked,
        numerarPaginas: document.getElementById('cfg-numerar').checked,
        quantPaginas:   parseInt(document.getElementById('cfg-paginas').value),
        nomeArquivo:    'papel-pautado',
      };

      await PDFEngine.gerarComPlano(
        this.id,
        (eng, cfg) => this.gerar(eng, cfg),
        config
      );
      window.FolhaPronta?.tracker?.registrar('pautado', 'escolar');
    });
  },

  renderizarPreview(container, config = {}) {
    const {
      corLinha   = '#CCCCCC',
      margem     = 'simples',
      titulo     = '',
      linhasData = false,
    } = config;

    const temMargem = margem === 'simples' || margem === 'dupla';

    container.innerHTML = `
      <div style="font-family:sans-serif;font-size:10px;padding:4px;">
        <div style="position:relative;background:#fff;border:1px solid #ccc;border-radius:3px;padding:4px 4px 2px;overflow:hidden;">
          ${linhasData ? `
            <div style="font-size:7px;color:#aaa;text-align:right;margin-bottom:2px;">
              Data: ___/___/______
            </div>
          ` : ''}
          ${titulo ? `
            <div style="font-size:8px;font-weight:bold;color:#3c3c3c;text-align:center;padding-bottom:2px;margin-bottom:3px;border-bottom:0.5px solid #888;">
              ${titulo}
            </div>
          ` : ''}
          ${temMargem ? `<div style="position:absolute;left:17px;top:0;bottom:0;border-left:1px solid #dc5050;pointer-events:none;"></div>` : ''}
          ${margem === 'dupla' ? `<div style="position:absolute;right:5px;top:0;bottom:0;border-left:1px solid #dc5050;pointer-events:none;"></div>` : ''}
          ${Array.from({ length: 13 }, (_, i) => `
            <div style="height:7px;border-bottom:1px solid ${corLinha};"></div>
          `).join('')}
        </div>
      </div>
    `;
  },

  obterConfig() {
    return {
      espacamento:    parseInt(document.getElementById('cfg-espacamento')?.value  || '8'),
      margem:         document.getElementById('cfg-margem')?.value                || 'simples',
      corLinha:       document.getElementById('cfg-cor-linha')?.value             || '#CCCCCC',
      titulo:         document.getElementById('cfg-titulo')?.value                || '',
      linhasData:     document.getElementById('cfg-data')?.checked                || false,
      numerarPaginas: document.getElementById('cfg-numerar')?.checked             || false,
      quantPaginas:   parseInt(document.getElementById('cfg-paginas')?.value      || '1'),
    };
  }
};

window.PapelPautado = PapelPautado;