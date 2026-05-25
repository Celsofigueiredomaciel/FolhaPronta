// ============================================================
// FolhaPronta — pdf-engine.js
// Engine central de geração de PDF via jsPDF
// ============================================================

const PDFEngine = {

  // Configurações padrão A4
  A4: {
    largura:  210,  // mm
    altura:   297,  // mm
    margem:   15,   // mm
  },

  // Inicializa novo documento jsPDF
  novoDoc(orientacao = 'portrait') {
    // CDN UMD registra como window.jspdf.jsPDF; fallback para window.jsPDF
    const JsPDF = (window.jspdf && window.jspdf.jsPDF) ||
                  (typeof jsPDF !== 'undefined' && jsPDF);
    if (!JsPDF) {
      console.error('FolhaPronta: jsPDF não carregado.');
      return null;
    }
    return new JsPDF({
      orientation: orientacao,
      unit: 'mm',
      format: 'a4'
    });
  },

  // Adiciona marca d'água no rodapé (plano free)
  adicionarMarcaDAgua(doc) {
    const { largura, altura } = this.A4;
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.setFont('helvetica', 'italic');
    doc.text(
      'Gerado gratuitamente em FolhaPronta.com.br',
      largura / 2,
      altura - 5,
      { align: 'center' }
    );
    // Restaura cor padrão
    doc.setTextColor(0, 0, 0);
  },

  // Adiciona cabeçalho com nome da empresa (premium)
  adicionarCabecalho(doc, opcoes = {}) {
    const { largura, margem } = this.A4;
    const { empresa, logoBase64, logoTipo } = opcoes;

    if (!empresa && !logoBase64) return;

    let yAtual = margem;

    // Logo se disponível
    if (logoBase64 && logoTipo) {
      try {
        doc.addImage(logoBase64, logoTipo, margem, yAtual, 30, 15);
      } catch(e) {
        console.warn('FolhaPronta: erro ao inserir logo', e);
      }
    }

    // Nome da empresa
    if (empresa) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      const xTexto = logoBase64 ? margem + 35 : margem;
      doc.text(empresa, xTexto, yAtual + 8);
      doc.setTextColor(0, 0, 0);
    }

    return yAtual + 20; // retorna Y após o cabeçalho
  },

  // Salva o PDF com nome amigável
  salvar(doc, nomeArquivo) {
    const nome = nomeArquivo
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    doc.save(`${nome}-folhapronta.pdf`);
  },

  // Gera e salva com verificação de plano
  async gerarComPlano(papelId, funcaoGeracao, opcoes = {}) {

    // Verifica se pode gerar hoje
    if (!PlanoGuard.podeGerar()) {
      PlanoGuard.solicitarUpgrade('limite-geracoes');
      return false;
    }

    // Verifica se tem acesso ao papel
    if (!PlanoGuard.podeAcessar(papelId)) {
      PlanoGuard.solicitarUpgrade('papel-premium');
      return false;
    }

    try {
      // Mostra loading
      this.mostrarLoading(true);

      // Executa a função de geração específica do papel
      const doc = await funcaoGeracao(this, opcoes);

      if (!doc) {
        this.mostrarLoading(false);
        return false;
      }

      // Adiciona marca d'água se plano free
      const limites = PlanoGuard.getLimites();
      if (limites.marcaDAgua) {
        this.adicionarMarcaDAgua(doc);
      }

      // Registra a geração
      PlanoGuard.registrarGeracao();

      // Salva o PDF
      this.salvar(doc, opcoes.nomeArquivo || papelId);

      // Feedback de sucesso
      this.mostrarToast('✅ PDF gerado com sucesso!', 'success');
      this.mostrarLoading(false);

      // Atualiza contador na UI se existir
      this.atualizarContadorGeracoes();

      return true;

    } catch (erro) {
      console.error('FolhaPronta: erro ao gerar PDF', erro);
      this.mostrarToast('❌ Erro ao gerar PDF. Tente novamente.', 'error');
      this.mostrarLoading(false);
      return false;
    }
  },

  // UI helpers
  mostrarLoading(visivel) {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
      loading.classList.toggle('hidden', !visivel);
    }
    document.querySelectorAll('.btn-gerar').forEach(btn => {
      if (visivel) {
        btn.dataset.textoOriginal = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Gerando…';
      } else {
        btn.disabled = false;
        if (btn.dataset.textoOriginal) {
          btn.textContent = btn.dataset.textoOriginal;
          delete btn.dataset.textoOriginal;
        }
      }
    });
  },

  mostrarToast(mensagem, tipo = 'success') {
    // Remove toast anterior se existir
    const anterior = document.querySelector('.toast');
    if (anterior) anterior.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensagem;
    document.body.appendChild(toast);

    // Remove após 3 segundos
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  atualizarContadorGeracoes() {
    const el = document.getElementById('contador-geracoes');
    if (!el) return;
    const restantes = PlanoGuard.geracoesRestantes();
    el.textContent = restantes === Infinity
      ? 'Ilimitado'
      : `${restantes} gerações restantes hoje`;
  }
};

window.PDFEngine = PDFEngine;