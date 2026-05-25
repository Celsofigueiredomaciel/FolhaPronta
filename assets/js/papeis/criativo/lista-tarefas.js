// ============================================================
// FolhaPronta — papeis/criativo/lista-tarefas.js
// Lista de tarefas com checkboxes e prioridade — Plano Free
// ============================================================

const PapelListaTarefas = {

  id:        'lista-tarefas',
  nome:      'Lista de Tarefas',
  plano:     'free',
  categoria: 'criativo',
  icone:     '✅',
  descricao: 'Checklist com checkboxes, prioridade (alta/média/baixa) e campo de data opcional.',

  opcoes: {
    quantidades: [
      { valor: 10, label: '10 itens (espaçado)' },
      { valor: 15, label: '15 itens (normal)' },
      { valor: 20, label: '20 itens (compacto)' },
      { valor: 25, label: '25 itens (muito compacto)' },
    ],
  },

  // Cores das prioridades (RGB)
  _prioridades: {
    A: { r: 220, g: 38,  b: 38,  label: 'Alta',  cor: '#DC2626' },
    M: { r: 245, g: 158, b: 11,  label: 'Média', cor: '#F59E0B' },
    B: { r: 16,  g: 185, b: 129, label: 'Baixa', cor: '#10B981' },
  },

  async gerar(engine, config = {}) {
    const doc = engine.novoDoc();
    if (!doc) return null;

    const {
      titulo         = '',
      quantItens     = 15,
      exibirData     = false,
      exibirPrioridade = false,
      numerarItens   = false,
      quantPaginas   = 1,
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
      titulo           = '',
      quantItens       = 15,
      exibirData       = false,
      exibirPrioridade = false,
      numerarItens     = false,
      quantPaginas     = 1,
    } = config;

    let y = m;

    // ── Cabeçalho roxo com título ──
    const COR_HEADER = { r: 124, g: 58, b: 237 }; // purple-600
    doc.setFillColor(COR_HEADER.r, COR_HEADER.g, COR_HEADER.b);
    doc.rect(m, y, 180, 14, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    const tituloTexto = (titulo && pagina === 1)
      ? titulo
      : (titulo ? `${titulo} — cont.` : 'LISTA DE TAREFAS');
    doc.text(tituloTexto, m + 6, y + 10);

    // Ícone checklist no canto direito
    doc.setFontSize(9);
    doc.text('✓ ✓ ✓', m + 174, y + 10, { align: 'right' });

    y += 14;

    // ── Linha de data e página ──
    doc.setFillColor(237, 233, 254); // purple-100
    doc.rect(m, y, 180, 8, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(91, 33, 182); // purple-800

    if (exibirData) {
      doc.setFont('helvetica', 'bold');
      doc.text('Data:', m + 4, y + 5.5);
      doc.setFont('helvetica', 'normal');
      doc.setDrawColor(167, 139, 250); // purple-400
      doc.setLineWidth(0.3);
      doc.line(m + 16, y + 5.5, m + 70, y + 5.5);
    }

    if (quantPaginas > 1) {
      doc.setTextColor(124, 58, 237);
      doc.text(`${pagina} / ${quantPaginas}`, m + 178, y + 5.5, { align: 'right' });
    }

    y += 8;

    // ── Legenda de prioridade ──
    if (exibirPrioridade) {
      doc.setFillColor(250, 250, 250);
      doc.rect(m, y, 180, 7, 'F');
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(107, 114, 128);
      doc.text('PRIORIDADE:', m + 4, y + 5);

      const legendaX = m + 32;
      Object.entries(this._prioridades).forEach(([key, p], i) => {
        const lx = legendaX + i * 28;
        doc.setFillColor(p.r, p.g, p.b);
        doc.rect(lx, y + 1.5, 6, 4, 'F');
        doc.setTextColor(55, 65, 81);
        doc.setFont('helvetica', 'normal');
        doc.text(`${key} — ${p.label}`, lx + 7.5, y + 5);
      });
      y += 7;
    }

    // ── Itens da lista ──
    const yLista = y + 3;
    const alturaLista = altura - m - yLista;
    const ROW_H = alturaLista / quantItens;

    // Dimensões do checkbox
    const CB_SIZE   = Math.min(ROW_H * 0.55, 6);  // proporção ao row
    const CB_RADIUS = 1;
    const CB_X = m + 2;

    // Largura da coluna de prioridade (se habilitada)
    const PRI_W = exibirPrioridade ? 9 : 0;
    // Largura da numeração (se habilitada)
    const NUM_W = numerarItens ? 8 : 0;

    for (let i = 0; i < quantItens; i++) {
      const ry = yLista + i * ROW_H;
      const cy = ry + (ROW_H - CB_SIZE) / 2;

      // Fundo alternado suave
      if (i % 2 === 1) {
        doc.setFillColor(250, 247, 255); // roxo muito claro
        doc.rect(m, ry, 180, ROW_H, 'F');
      }

      let xAtual = CB_X;

      // Numeração
      if (numerarItens) {
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(167, 139, 250);
        doc.text(String(i + 1).padStart(2, '0'), xAtual + NUM_W / 2, cy + CB_SIZE / 2 + 2, { align: 'center' });
        xAtual += NUM_W;
      }

      // Checkbox — quadrado com canto arredondado (simulado com roundedRect se disponível)
      doc.setDrawColor(167, 139, 250); // purple-400
      doc.setLineWidth(0.6);
      doc.setFillColor(255, 255, 255);
      doc.rect(xAtual, cy, CB_SIZE, CB_SIZE, 'FD'); // fill white + stroke
      xAtual += CB_SIZE + 3;

      // Badge de prioridade
      if (exibirPrioridade) {
        // Seletor visual: três mini quadrados coloridos (um para cada nível)
        const PRI_KEYS = ['A', 'M', 'B'];
        const sqSz = PRI_W / 3 - 0.5;
        PRI_KEYS.forEach((key, ki) => {
          const p = this._prioridades[key];
          doc.setFillColor(p.r, p.g, p.b);
          doc.setDrawColor(p.r, p.g, p.b);
          // Apenas o contorno (para preenchimento manual)
          doc.rect(xAtual + ki * (sqSz + 0.5), cy + 0.5, sqSz, CB_SIZE - 1, 'S');
        });
        xAtual += PRI_W + 3;
      }

      // Linha da tarefa
      const xLinhaFim = m + 180 - 2;
      doc.setDrawColor(196, 181, 253); // purple-300
      doc.setLineWidth(0.3);
      const yLinha = cy + CB_SIZE - 1;
      doc.line(xAtual, yLinha, xLinhaFim, yLinha);

      // Separador leve entre itens
      doc.setDrawColor(237, 233, 254); // purple-100
      doc.setLineWidth(0.2);
      doc.line(m, ry + ROW_H, m + 180, ry + ROW_H);
    }

    // Borda do bloco de itens
    doc.setDrawColor(167, 139, 250); // purple-400
    doc.setLineWidth(0.4);
    doc.rect(m, yLista, 180, quantItens * ROW_H, 'S');
  },

  renderizarFormulario(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="config-form">

        <div class="input-group">
          <label class="input-label">Título da lista (opcional)</label>
          <input type="text" class="input" id="cfg-titulo"
            placeholder="Ex: Compras do mês / Tarefas da semana" maxlength="60">
        </div>

        <div class="input-group">
          <label class="input-label">Quantidade de itens</label>
          <select class="select" id="cfg-itens">
            ${this.opcoes.quantidades.map(op =>
              `<option value="${op.valor}" ${op.valor === 15 ? 'selected' : ''}>${op.label}</option>`
            ).join('')}
          </select>
        </div>

        <div class="config-checkboxes">
          <label class="checkbox-label">
            <input type="checkbox" id="cfg-data">
            Campo de data no topo
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="cfg-prioridade" checked>
            Coluna de prioridade (A / M / B)
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="cfg-numerar">
            Numerar itens
          </label>
        </div>

        <div class="input-group">
          <label class="input-label">Quantidade de páginas</label>
          <select class="select" id="cfg-paginas">
            <option value="1">1 página</option>
            <option value="2">2 páginas</option>
            <option value="3">3 páginas</option>
          </select>
        </div>

        <button class="btn btn-primary btn-lg btn-gerar" id="btn-gerar-lista-tarefas">
          ✅ Gerar Lista de Tarefas
        </button>

        <p class="config-info" id="contador-geracoes"></p>
      </div>
    `;

    PDFEngine.atualizarContadorGeracoes();

    document.getElementById('btn-gerar-lista-tarefas').addEventListener('click', async () => {
      const config = {
        titulo:           document.getElementById('cfg-titulo').value,
        quantItens:       parseInt(document.getElementById('cfg-itens').value),
        exibirData:       document.getElementById('cfg-data').checked,
        exibirPrioridade: document.getElementById('cfg-prioridade').checked,
        numerarItens:     document.getElementById('cfg-numerar').checked,
        quantPaginas:     parseInt(document.getElementById('cfg-paginas').value),
        nomeArquivo:      'lista-de-tarefas',
      };

      await PDFEngine.gerarComPlano(
        this.id,
        (eng, cfg) => this.gerar(eng, cfg),
        config
      );
    });
  }
};

window.PapelListaTarefas = PapelListaTarefas;
