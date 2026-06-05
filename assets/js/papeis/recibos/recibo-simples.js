// ============================================================
// FolhaPronta — papeis/recibos/recibo-simples.js
// Recibo simples preenchível — Plano Free
// ============================================================

const ReciboSimples = {

  id:        'recibo-simples',
  nome:      'Recibo Simples',
  plano:     'free',
  categoria: 'recibos',
  icone:     '🧾',
  descricao: 'Recibo simples para preenchimento manual. Gera 2 vias na mesma folha A4.',

  async gerar(engine, config = {}) {
    const doc = engine.novoDoc();
    if (!doc) return null;

    const {
      nomeRecebedor  = '',
      nomeEmitente   = '',
      valor          = '',
      descricao      = '',
      cidade         = '',
      numeroRecibo   = '',
    } = config;

    // Gera as 2 vias na mesma folha
    this._gerarVia(doc, engine, config, 'Via do Emitente', 20);
    this._gerarVia(doc, engine, config, 'Via do Pagador', 160);

    // Linha tracejada de corte no meio
    doc.setDrawColor(150, 150, 150);
    doc.setLineDash([3, 3]);
    doc.setLineWidth(0.4);
    doc.line(15, 155, 195, 155);

    const tesouraX = 13;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('✂', tesouraX, 155);

    doc.setLineDash([]);

    return doc;
  },

  _gerarVia(doc, engine, config, labelVia, yBase) {
    const {
      nomeRecebedor = '',
      nomeEmitente  = '',
      valor         = '',
      descricao     = '',
      cidade        = '',
      numeroRecibo  = '',
    } = config;

    const largura = 210;
    const margemL = 15;
    const margemR = 195;

    // ── Borda da via ──
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.setLineDash([]);
    doc.rect(margemL, yBase, largura - 30, 125);

    // ── Cabeçalho ──
    doc.setFillColor(37, 99, 235);
    doc.rect(margemL, yBase, largura - 30, 12, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RECIBO', margemL + 8, yBase + 8);

    // Número do recibo
    if (numeroRecibo) {
      doc.setFontSize(9);
      doc.text(`Nº ${numeroRecibo}`, margemR - 20, yBase + 8);
    }

    // Label da via
    doc.setFontSize(8);
    doc.text(labelVia, margemL + 80, yBase + 8, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // ── Valor em destaque ──
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Valor: R$', margemL + 8, yBase + 22);

    // Box do valor
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1);
    doc.rect(margemL + 30, yBase + 16, 70, 10);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(valor || '_________________________________', margemL + 33, yBase + 23);

    // Valor por extenso
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Por extenso:', margemL + 8, yBase + 32);
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(margemL + 32, yBase + 32, margemR - 5, yBase + 32);

    // ── Campos ──
    const campos = [
      { label: 'Recebi de:', valor: nomeEmitente,  y: yBase + 44 },
      { label: 'Referente a:', valor: descricao,   y: yBase + 56 },
      { label: 'Nome/CPF/CNPJ:', valor: nomeRecebedor, y: yBase + 68 },
    ];

    campos.forEach(campo => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(campo.label, margemL + 8, campo.y);

      doc.setFont('helvetica', 'normal');
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);

      const textoFinal = campo.valor
        ? String(campo.valor).substring(0, 60)
        : null;

      if (textoFinal) {
        doc.setTextColor(0, 0, 0);
        doc.text(textoFinal, margemL + 8 + doc.getTextWidth(campo.label) + 3, campo.y);
      } else {
        doc.line(margemL + 8 + doc.getTextWidth(campo.label) + 3, campo.y, margemR - 5, campo.y);
      }
    });

    // ── Assinatura e data ──
    const yAssinatura = yBase + 95;
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.4);

    // Linha assinatura
    doc.line(margemL + 8, yAssinatura, margemL + 80, yAssinatura);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Assinatura do Recebedor', margemL + 8, yAssinatura + 5);

    // Linha data
    doc.line(margemL + 100, yAssinatura, margemR - 5, yAssinatura);
    const textoData = cidade
      ? `${cidade}, ___/___/______`
      : '___/___/______';
    doc.text(textoData, margemL + 100, yAssinatura + 5);
  },

  renderizarFormulario(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="config-form">
        <p class="config-desc">
          📋 Preencha os campos abaixo (todos são opcionais — 
          você pode deixar em branco para preencher à mão)
        </p>

        <div class="config-grid-2">
          <div class="input-group">
            <label class="input-label" for="cfg-recebedor">Quem recebeu (seu nome/empresa)</label>
            <input type="text" class="input" id="cfg-recebedor"
              placeholder="Ex: João Silva" maxlength="60">
          </div>

          <div class="input-group">
            <label class="input-label" for="cfg-emitente">Quem pagou</label>
            <input type="text" class="input" id="cfg-emitente"
              placeholder="Ex: Maria Santos" maxlength="60">
          </div>
        </div>

        <div class="config-grid-2">
          <div class="input-group">
            <label class="input-label" for="cfg-valor">Valor (R$)</label>
            <input type="text" class="input" id="cfg-valor"
              placeholder="Ex: 150,00" maxlength="20">
          </div>

          <div class="input-group">
            <label class="input-label" for="cfg-numero">Número do recibo</label>
            <input type="text" class="input" id="cfg-numero"
              placeholder="Ex: 001" maxlength="10" pattern="[0-9]*">
          </div>
        </div>

        <div class="input-group">
          <label class="input-label" for="cfg-descricao">Referente a (descrição do pagamento)</label>
          <input type="text" class="input" id="cfg-descricao"
            placeholder="Ex: Prestação de serviço de pintura" maxlength="80">
        </div>

        <div class="input-group">
          <label class="input-label" for="cfg-cidade">Cidade</label>
          <input type="text" class="input" id="cfg-cidade"
            placeholder="Ex: Belém" maxlength="40">
        </div>

        <button class="btn btn-primary btn-lg btn-gerar" id="btn-gerar-recibo">
          🧾 Gerar Recibo (2 vias)
        </button>

        <p class="config-info" id="contador-geracoes"></p>
      </div>
    `;

    PDFEngine.atualizarContadorGeracoes();

    document.getElementById('cfg-numero')
      .addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
      });

    document.getElementById('btn-gerar-recibo').addEventListener('click', async () => {
      const valorRaw = document.getElementById('cfg-valor').value.trim();
      if (valorRaw) {
        const valorNum = parseFloat(valorRaw.replace(',', '.'));
        if (isNaN(valorNum) || valorNum <= 0) {
          alert('Digite um valor válido. Ex: 150,00');
          return;
        }
      }

      const config = {
        nomeRecebedor: document.getElementById('cfg-recebedor').value,
        nomeEmitente:  document.getElementById('cfg-emitente').value,
        valor:         document.getElementById('cfg-valor').value,
        numeroRecibo:  document.getElementById('cfg-numero').value,
        descricao:     document.getElementById('cfg-descricao').value,
        cidade:        document.getElementById('cfg-cidade').value,
        nomeArquivo:   'recibo-simples',
      };

      await PDFEngine.gerarComPlano(
        this.id,
        (eng, cfg) => this.gerar(eng, cfg),
        config
      );
    });
  }
};

window.ReciboSimples = ReciboSimples;