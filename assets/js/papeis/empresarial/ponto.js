// ============================================================
// FolhaPronta — papeis/empresarial/ponto.js
// Folha de ponto mensal com controle de jornada — Plano Free
// ============================================================

const PapelPonto = {

  id:        'ponto',
  nome:      'Ponto',
  plano:     'free',
  categoria: 'empresarial',
  icone:     '🕐',
  descricao: 'Folha de ponto mensal com entrada/saída manhã e tarde, hora extra e assinatura.',

  _meses: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ],
  _diasSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],

  // Colunas: Dia(10) + DS(12) + EntM(18) + SaíM(18) + EntT(18) + SaíT(18) + HExt(18) + Ass(68) = 180mm
  _colunas: [
    { label: 'Dia',       w: 10 },
    { label: 'DS',        w: 12 },
    { label: 'Ent. Manhã', w: 18 },
    { label: 'Saí. Manhã', w: 18 },
    { label: 'Ent. Tarde', w: 18 },
    { label: 'Saí. Tarde', w: 18 },
    { label: 'H. Extra',  w: 18 },
    { label: 'Assinatura', w: 68 },
  ],

  async gerar(engine, config = {}) {
    const doc = engine.novoDoc();
    if (!doc) return null;

    const {
      mes             = new Date().getMonth() + 1,
      ano             = new Date().getFullYear(),
      nomeFuncionario = '',
      nomeEmpresa     = '',
      cargo           = '',
    } = config;

    const diasNoMes  = new Date(ano, mes, 0).getDate();

    // Calcula posições X de cada coluna
    const { margem: m } = engine.A4;
    let cx = m;
    const xs = this._colunas.map(col => { const x = cx; cx += col.w; return x; });

    // ── Cabeçalho escuro ──
    const { largura, altura } = engine.A4;
    let y = m;

    doc.setFillColor(17, 24, 39);
    doc.rect(m, y, 180, 16, 'F');

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('FOLHA DE PONTO', m + 4, y + 10);

    // Mês/Ano em destaque
    const mesAno = `${this._meses[mes - 1].toUpperCase()} / ${ano}`;
    doc.setFontSize(11);
    doc.text(mesAno, m + 180 - 4, y + 10, { align: 'right' });

    y += 16;

    // ── Faixa de informações do funcionário ──
    doc.setFillColor(243, 244, 246);
    doc.rect(m, y, 180, 16, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.rect(m, y, 180, 16, 'S');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);

    // Linha 1: empresa
    doc.text('Empresa:', m + 4, y + 5.5);
    doc.setFont('helvetica', 'normal');
    if (nomeEmpresa) {
      doc.text(nomeEmpresa, m + 22, y + 5.5);
    } else {
      doc.setDrawColor(180, 180, 180);
      doc.line(m + 22, y + 5.5, m + 178, y + 5.5);
    }

    // Linha 2: funcionário e cargo
    doc.setFont('helvetica', 'bold');
    doc.text('Funcionário:', m + 4, y + 12.5);
    doc.setFont('helvetica', 'normal');
    if (nomeFuncionario) {
      doc.text(nomeFuncionario, m + 28, y + 12.5);
    } else {
      doc.setDrawColor(180, 180, 180);
      doc.line(m + 28, y + 12.5, m + 98, y + 12.5);
    }
    doc.setFont('helvetica', 'bold');
    doc.text('Cargo:', m + 100, y + 12.5);
    doc.setFont('helvetica', 'normal');
    if (cargo) {
      doc.text(cargo, m + 116, y + 12.5);
    } else {
      doc.setDrawColor(180, 180, 180);
      doc.line(m + 116, y + 12.5, m + 178, y + 12.5);
    }

    y += 16;

    // ── Cabeçalho das colunas ──
    const COL_H = 8;
    doc.setFillColor(37, 99, 235);
    doc.rect(m, y, 180, COL_H, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
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

    // ── Linhas dos dias ──
    const yTabela = y;
    const altTabela = altura - m - yTabela - 14; // 14mm para rodapé de assinaturas
    const ROW_H = altTabela / 31; // sempre 31 linhas para consistência visual

    for (let dia = 1; dia <= 31; dia++) {
      const ry = yTabela + (dia - 1) * ROW_H;
      const diaExiste = dia <= diasNoMes;

      // Obtem dia da semana
      let diaSem = '';
      let isDomingo = false;
      let isSabado = false;
      if (diaExiste) {
        const d = new Date(ano, mes - 1, dia);
        diaSem = this._diasSemana[d.getDay()];
        isDomingo = d.getDay() === 0;
        isSabado  = d.getDay() === 6;
      }

      // Fundo da linha
      if (!diaExiste) {
        doc.setFillColor(248, 250, 252); // dia inexistente: cinza muito claro
      } else if (isDomingo) {
        doc.setFillColor(254, 226, 226); // domingo: vermelho muito claro
      } else if (isSabado) {
        doc.setFillColor(254, 243, 199); // sábado: amarelo muito claro
      } else if (dia % 2 === 0) {
        doc.setFillColor(249, 250, 251); // par: off-white
      } else {
        doc.setFillColor(255, 255, 255); // ímpar: branco
      }
      doc.rect(m, ry, 180, ROW_H, 'F');

      if (diaExiste) {
        doc.setFontSize(6.5);
        doc.setFont('helvetica', isDomingo || isSabado ? 'bold' : 'normal');
        const corTexto = isDomingo ? [185, 28, 28] : isSabado ? [146, 64, 14] : [55, 65, 81];
        doc.setTextColor(corTexto[0], corTexto[1], corTexto[2]);

        // Coluna Dia
        doc.text(String(dia).padStart(2, '0'), xs[0] + this._colunas[0].w / 2, ry + ROW_H / 2 + 2, { align: 'center' });

        // Coluna DS
        doc.text(diaSem, xs[1] + this._colunas[1].w / 2, ry + ROW_H / 2 + 2, { align: 'center' });
      } else {
        // Dias que não existem no mês: linha tracejada leve
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.2);
        doc.setLineDash([2, 2]);
        doc.line(m + 30, ry + ROW_H / 2, m + 180, ry + ROW_H / 2);
        doc.setLineDash([]);
      }

      // Linha inferior da row
      doc.setDrawColor(209, 213, 219);
      doc.setLineWidth(0.2);
      doc.line(m, ry + ROW_H, m + 180, ry + ROW_H);
    }

    // Borda externa da tabela
    doc.setDrawColor(107, 114, 128);
    doc.setLineWidth(0.4);
    doc.rect(m, yTabela, 180, 31 * ROW_H, 'S');

    // Separadores verticais
    this._colunas.forEach((col, i) => {
      if (i > 0) {
        doc.setDrawColor(209, 213, 219);
        doc.setLineWidth(0.3);
        doc.line(xs[i], yTabela, xs[i], yTabela + 31 * ROW_H);
      }
    });

    // ── Rodapé: assinaturas ──
    const yRodape = yTabela + 31 * ROW_H + 3;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.3);

    // Assinatura funcionário
    doc.line(m, yRodape + 6, m + 80, yRodape + 6);
    doc.text('Assinatura do Funcionário', m, yRodape + 10);

    // Assinatura responsável
    doc.line(m + 100, yRodape + 6, m + 178, yRodape + 6);
    doc.text('Assinatura do Responsável', m + 100, yRodape + 10);

    return doc;
  },

  renderizarFormulario(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const anoAtual = new Date().getFullYear();
    const mesAtual = new Date().getMonth() + 1;

    const opcoesAno = [anoAtual - 1, anoAtual, anoAtual + 1]
      .map(a => `<option value="${a}" ${a === anoAtual ? 'selected' : ''}>${a}</option>`)
      .join('');

    const opcoesMes = this._meses
      .map((nome, i) =>
        `<option value="${i + 1}" ${i + 1 === mesAtual ? 'selected' : ''}>${nome}</option>`
      ).join('');

    container.innerHTML = `
      <div class="config-form">
        <p class="config-desc">
          🕐 Preencha os dados da folha de ponto. Os campos são opcionais —
          você pode deixar em branco para preencher à mão.
        </p>

        <div class="config-grid-2">
          <div class="input-group">
            <label class="input-label">Mês</label>
            <select class="select" id="cfg-mes">${opcoesMes}</select>
          </div>
          <div class="input-group">
            <label class="input-label">Ano</label>
            <select class="select" id="cfg-ano">${opcoesAno}</select>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">Nome do funcionário</label>
          <input type="text" class="input" id="cfg-funcionario"
            placeholder="Ex: Maria dos Santos" maxlength="60">
        </div>

        <div class="config-grid-2">
          <div class="input-group">
            <label class="input-label">Empresa</label>
            <input type="text" class="input" id="cfg-empresa"
              placeholder="Ex: Empresa XYZ Ltda." maxlength="50">
          </div>
          <div class="input-group">
            <label class="input-label">Cargo</label>
            <input type="text" class="input" id="cfg-cargo"
              placeholder="Ex: Analista" maxlength="30">
          </div>
        </div>

        <button class="btn btn-primary btn-lg btn-gerar" id="btn-gerar-ponto">
          🕐 Gerar Folha de Ponto
        </button>

        <p class="config-info" id="contador-geracoes"></p>
      </div>
    `;

    PDFEngine.atualizarContadorGeracoes();

    document.getElementById('btn-gerar-ponto').addEventListener('click', async () => {
      const config = {
        mes:             parseInt(document.getElementById('cfg-mes').value),
        ano:             parseInt(document.getElementById('cfg-ano').value),
        nomeFuncionario: document.getElementById('cfg-funcionario').value,
        nomeEmpresa:     document.getElementById('cfg-empresa').value,
        cargo:           document.getElementById('cfg-cargo').value,
        nomeArquivo:     'folha-de-ponto',
      };

      await PDFEngine.gerarComPlano(
        this.id,
        (eng, cfg) => this.gerar(eng, cfg),
        config
      );
      window.FolhaPronta?.tracker?.registrar('ponto', 'empresarial');
    });
  }
};

window.PapelPonto = PapelPonto;
