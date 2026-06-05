
// ============================================================
// FolhaPronta — papeis/recibos/recibo-aluguel.js
// Recibo de aluguel — 2 vias — Plano Free
// ============================================================

const ReciboAluguel = {

  id:        'recibo-aluguel',
  nome:      'Recibo de Aluguel',
  plano:     'free',
  categoria: 'recibos',
  icone:     '🏠',
  descricao: 'Recibo de aluguel com campos de IPTU, condomínio e período. 2 vias na mesma folha A4.',

  async gerar(engine, config = {}) {
    const doc = engine.novoDoc();
    if (!doc) return null;

    this._gerarVia(doc, engine, config, 'Via do Locador', 20);
    this._gerarVia(doc, engine, config, 'Via do Locatário', 160);

    doc.setDrawColor(150, 150, 150);
    doc.setLineDash([3, 3]);
    doc.setLineWidth(0.4);
    doc.line(15, 155, 195, 155);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('✂', 13, 155);
    doc.setLineDash([]);

    return doc;
  },

  _gerarVia(doc, engine, config, labelVia, yBase) {
    const {
      nomeLocador    = '',
      nomeLocatario  = '',
      endereco       = '',
      valorAluguel   = '',
      valorIPTU      = '',
      valorCond      = '',
      periodo        = '',
      vencimento     = '',
      cidade         = '',
      numeroRecibo   = '',
    } = config;

    const margemL = 15;
    const margemR = 195;

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.setLineDash([]);
    doc.rect(margemL, yBase, 180, 125);

    // Cabeçalho
    doc.setFillColor(236, 72, 153);
    doc.rect(margemL, yBase, 180, 12, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RECIBO DE ALUGUEL', margemL + 8, yBase + 8);

    if (numeroRecibo) {
      doc.setFontSize(9);
      doc.text(`Nº ${numeroRecibo}`, margemR - 20, yBase + 8);
    }

    doc.setFontSize(8);
    doc.text(labelVia, margemL + 110, yBase + 8, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // Período
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Período de referência:', margemL + 8, yBase + 20);
    doc.setFont('helvetica', 'normal');
    if (periodo) {
      doc.text(periodo, margemL + 55, yBase + 20);
    } else {
      doc.setDrawColor(180,180,180);
      doc.setLineWidth(0.3);
      doc.line(margemL + 55, yBase + 20, margemR - 5, yBase + 20);
    }

    // Endereço imóvel
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Imóvel:', margemL + 8, yBase + 30);
    doc.setFont('helvetica', 'normal');
    doc.setDrawColor(180,180,180);
    doc.setLineWidth(0.3);
    if (endereco) {
      doc.text(endereco, margemL + 25, yBase + 30);
    } else {
      doc.line(margemL + 25, yBase + 30, margemR - 5, yBase + 30);
    }

    // Locador / Locatário
    const camposPessoas = [
      { label: 'Locador (proprietário):', valor: nomeLocador,   y: yBase + 42 },
      { label: 'Locatário (inquilino):',  valor: nomeLocatario, y: yBase + 54 },
    ];

    camposPessoas.forEach(campo => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(campo.label, margemL + 8, campo.y);
      doc.setFont('helvetica', 'normal');
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      if (campo.valor) {
        doc.setTextColor(0, 0, 0);
        doc.text(campo.valor, margemL + 8 + doc.getTextWidth(campo.label) + 3, campo.y);
      } else {
        doc.line(margemL + 8 + doc.getTextWidth(campo.label) + 3, campo.y, margemR - 5, campo.y);
      }
    });

    // Valores
    const yValores = yBase + 66;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Discriminação dos valores:', margemL + 8, yValores);

    const itens = [
      { label: 'Aluguel:',     valor: valorAluguel, x: margemL + 8  },
      { label: 'IPTU:',        valor: valorIPTU,    x: margemL + 70 },
      { label: 'Condomínio:',  valor: valorCond,    x: margemL + 120},
    ];

    itens.forEach(item => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(item.label, item.x, yValores + 10);
      doc.setFont('helvetica', 'normal');
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      if (item.valor) {
        doc.setTextColor(0, 0, 0);
        doc.text('R$ ' + item.valor, item.x, yValores + 18);
      } else {
        doc.line(item.x, yValores + 18, item.x + 45, yValores + 18);
      }
    });

    // Total
    doc.setFillColor(253, 242, 248);
    doc.rect(margemL + 120, yValores + 22, 70, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(236, 72, 153);
    doc.setFontSize(9);
    doc.text('TOTAL: R$', margemL + 124, yValores + 30);
    doc.setTextColor(0,0,0);
    doc.line(margemL + 148, yValores + 30, margemR - 5, yValores + 30);

    // Vencimento
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Vencimento:', margemL + 8, yValores + 30);
    doc.setFont('helvetica', 'normal');
    if (vencimento) {
      doc.setTextColor(0,0,0);
      doc.text(vencimento, margemL + 30, yValores + 30);
    } else {
      doc.setDrawColor(180,180,180);
      doc.line(margemL + 30, yValores + 30, margemL + 80, yValores + 30);
    }

    // Assinatura
    const yAssinatura = yBase + 110;
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.4);
    doc.line(margemL + 8, yAssinatura, margemL + 80, yAssinatura);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Assinatura do Locador', margemL + 8, yAssinatura + 5);

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
          🏠 Preencha os campos abaixo (todos opcionais —
          pode deixar em branco para preencher à mão)
        </p>

        <div class="config-grid-2">
          <div class="input-group">
            <label class="input-label" for="cfg-locador">Locador (proprietário)</label>
            <input type="text" class="input" id="cfg-locador"
              placeholder="Ex: João Silva" maxlength="60">
          </div>
          <div class="input-group">
            <label class="input-label" for="cfg-locatario">Locatário (inquilino)</label>
            <input type="text" class="input" id="cfg-locatario"
              placeholder="Ex: Maria Santos" maxlength="60">
          </div>
        </div>

        <div class="input-group">
          <label class="input-label" for="cfg-endereco">Endereço do imóvel</label>
          <input type="text" class="input" id="cfg-endereco"
            placeholder="Ex: Rua das Flores, 123 — Belém/PA" maxlength="80">
        </div>

        <div class="config-grid-2">
          <div class="input-group">
            <label class="input-label" for="cfg-periodo">Período de referência</label>
            <input type="text" class="input" id="cfg-periodo"
              placeholder="Ex: Junho/2026" maxlength="30">
          </div>
          <div class="input-group">
            <label class="input-label" for="cfg-vencimento">Vencimento</label>
            <input type="text" class="input" id="cfg-vencimento"
              placeholder="Ex: 10/06/2026" maxlength="20">
          </div>
        </div>

        <div class="config-grid-2">
          <div class="input-group">
            <label class="input-label" for="cfg-aluguel">Valor do Aluguel (R$)</label>
            <input type="text" class="input" id="cfg-aluguel"
              placeholder="Ex: 800,00" maxlength="15">
          </div>
          <div class="input-group">
            <label class="input-label" for="cfg-numero">Número do recibo</label>
            <input type="text" class="input" id="cfg-numero"
              placeholder="Ex: 001" maxlength="10">
          </div>
        </div>

        <div class="config-grid-2">
          <div class="input-group">
            <label class="input-label" for="cfg-iptu">IPTU (R$)</label>
            <input type="text" class="input" id="cfg-iptu"
              placeholder="Ex: 50,00" maxlength="15">
          </div>
          <div class="input-group">
            <label class="input-label" for="cfg-cond">Condomínio (R$)</label>
            <input type="text" class="input" id="cfg-cond"
              placeholder="Ex: 120,00" maxlength="15">
          </div>
        </div>

        <div class="input-group">
          <label class="input-label" for="cfg-cidade">Cidade</label>
          <input type="text" class="input" id="cfg-cidade"
            placeholder="Ex: Belém" maxlength="40">
        </div>

        <button class="btn btn-primary btn-lg btn-gerar" id="btn-gerar-aluguel">
          🏠 Gerar Recibo de Aluguel (2 vias)
        </button>

        <p class="config-info" id="contador-geracoes"></p>
      </div>
    `;

    PDFEngine.atualizarContadorGeracoes();

    document.getElementById('btn-gerar-aluguel').addEventListener('click', async () => {
      const valorRaw = document.getElementById('cfg-aluguel').value.trim();
      const validacao = PDFEngine.validarValor(valorRaw);
      if (!validacao.valido) {
        alert(validacao.erro);
        return;
      }

      const iptuRaw = document.getElementById('cfg-iptu').value.trim();
      const validacaoIPTU = PDFEngine.validarValor(iptuRaw);
      if (!validacaoIPTU.valido) {
        alert('IPTU: ' + validacaoIPTU.erro);
        return;
      }

      const condRaw = document.getElementById('cfg-cond').value.trim();
      const validacaoCond = PDFEngine.validarValor(condRaw);
      if (!validacaoCond.valido) {
        alert('Condomínio: ' + validacaoCond.erro);
        return;
      }

      const config = {
        nomeLocador:   document.getElementById('cfg-locador').value,
        nomeLocatario: document.getElementById('cfg-locatario').value,
        endereco:      document.getElementById('cfg-endereco').value,
        valorAluguel:  document.getElementById('cfg-aluguel').value,
        valorIPTU:     document.getElementById('cfg-iptu').value,
        valorCond:     document.getElementById('cfg-cond').value,
        periodo:       document.getElementById('cfg-periodo').value,
        vencimento:    document.getElementById('cfg-vencimento').value,
        cidade:        document.getElementById('cfg-cidade').value,
        numeroRecibo:  document.getElementById('cfg-numero').value,
        nomeArquivo:   'recibo-aluguel',
      };

      await PDFEngine.gerarComPlano(
        this.id,
        (eng, cfg) => this.gerar(eng, cfg),
        config
      );
      window.FolhaPronta?.tracker?.registrar('recibo-aluguel', 'recibos');
    });
  }
};

window.ReciboAluguel = ReciboAluguel;
