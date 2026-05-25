// ============================================================
// FolhaPronta — planos.js
// Definição dos planos, limites e controle de acesso
// ============================================================

const PLANOS = {
  free: {
    id: 'free',
    nome: 'Free',
    preco: 0,
    descricao: 'Para uso esporádico e pessoal',
    cor: '#6B7280',
    limites: {
      geracoesHoje: 5,         // máx 5 PDFs por dia
      marcaDAgua: true,         // mostra marca d'água
      logoEmpresa: false,       // não pode subir logo
      salvarModelos: false,     // não salva modelos
      historicoGeracao: false,  // sem histórico
    },
    papeis: [
      // Escolar
      'pautado',
      'quadriculado',
      // Técnico
      'engenharia',
      // Empresarial
      'protocolo',
      'ponto',
      // Recibos
      'recibo-simples',
      // Criativo
      'planner-semanal',
      'lista-tarefas',
    ]
  },

  premium: {
    id: 'premium',
    nome: 'Premium',
    preco: 9.90,
    descricao: 'Para uso profissional e empresarial',
    cor: '#2563EB',
    popular: true,
    limites: {
      geracoesHoje: -1,         // ilimitado
      marcaDAgua: false,         // sem marca d'água
      logoEmpresa: true,         // pode subir logo
      salvarModelos: false,      // sem banco de dados
      historicoGeracao: false,   // sem histórico
    },
    papeis: [
      // Todos os papéis free +
      'pautado', 'quadriculado', 'caligrafia', 'milimetrado',
      'engenharia', 'partitura', 'isometrico',
      'protocolo', 'ponto', 'requisicao', 'hora-extra', 'ata-reuniao',
      'recibo-simples', 'recibo-comercial', 'recibo-aluguel', 'recibo-duas-vias',
      'planner-semanal', 'bullet-journal', 'lista-tarefas',
    ]
  },

  max: {
    id: 'max',
    nome: 'Max',
    preco: 24.90,
    descricao: 'Para equipes e empresas',
    cor: '#7C3AED',
    limites: {
      geracoesHoje: -1,
      marcaDAgua: false,
      logoEmpresa: true,
      salvarModelos: true,       // salva no banco de dados
      historicoGeracao: true,    // histórico completo
      multiUsuario: true,        // múltiplos usuários
    },
    papeis: 'todos' // acesso a todos os papéis
  }
};

// ── Controle do plano atual ──────────────────────────────────
const PlanoGuard = {

  // Retorna o plano atual do usuário (por enquanto sempre 'free')
  getPlanoAtual() {
    return localStorage.getItem('fp_plano') || 'free';
  },

  // Verifica se o papel está disponível no plano atual
  podeAcessar(papelId) {
    const planoId = this.getPlanoAtual();
    const plano   = PLANOS[planoId];
    if (!plano) return false;
    if (plano.papeis === 'todos') return true;
    return plano.papeis.includes(papelId);
  },

  // Verifica limite de gerações diárias
  podeGerar() {
    const planoId = this.getPlanoAtual();
    const plano   = PLANOS[planoId];
    if (plano.limites.geracoesHoje === -1) return true;

    const hoje     = new Date().toISOString().split('T')[0];
    const key      = `fp_geracoes_${hoje}`;
    const contador = parseInt(localStorage.getItem(key) || '0');
    return contador < plano.limites.geracoesHoje;
  },

  // Registra uma geração
  registrarGeracao() {
    const hoje = new Date().toISOString().split('T')[0];
    const key  = `fp_geracoes_${hoje}`;
    const atual = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, atual + 1);
  },

  // Retorna quantas gerações restam hoje
  geracoesRestantes() {
    const planoId = this.getPlanoAtual();
    const plano   = PLANOS[planoId];
    if (plano.limites.geracoesHoje === -1) return Infinity;

    const hoje     = new Date().toISOString().split('T')[0];
    const key      = `fp_geracoes_${hoje}`;
    const contador = parseInt(localStorage.getItem(key) || '0');
    return Math.max(0, plano.limites.geracoesHoje - contador);
  },

  // Retorna as configurações de limite do plano atual
  getLimites() {
    const planoId = this.getPlanoAtual();
    return PLANOS[planoId]?.limites || PLANOS.free.limites;
  },

  // Mostra modal de upgrade quando necessário
  solicitarUpgrade(motivo = 'recurso') {
    const modal = document.getElementById('modal-upgrade');
    if (!modal) return;

    const mensagens = {
      'limite-geracoes': {
        icone: '⚡',
        titulo: 'Limite diário atingido!',
        desc: 'No plano Free você pode gerar 5 PDFs por dia. Faça upgrade para gerar ilimitadamente.'
      },
      'marca-dagua': {
        icone: '✨',
        titulo: 'Remova a marca d\'água',
        desc: 'Com o Premium seus PDFs ficam limpos e profissionais, sem nenhuma marca d\'água.'
      },
      'logo-empresa': {
        icone: '🏢',
        titulo: 'Adicione o logo da sua empresa',
        desc: 'Com o Premium você pode personalizar todos os papéis com o logo da sua empresa.'
      },
      'papel-premium': {
        icone: '📄',
        titulo: 'Papel exclusivo Premium',
        desc: 'Este modelo está disponível apenas nos planos Premium e Max.'
      },
      'salvar-modelos': {
        icone: '💾',
        titulo: 'Salve seus modelos',
        desc: 'Com o plano Max você salva seus modelos personalizados e acessa de qualquer dispositivo.'
      },
      'recurso': {
        icone: '🚀',
        titulo: 'Recurso Premium',
        desc: 'Faça upgrade para acessar todos os recursos do FolhaPronta.'
      }
    };

    const info = mensagens[motivo] || mensagens['recurso'];
    document.getElementById('modal-upgrade-icone').textContent  = info.icone;
    document.getElementById('modal-upgrade-titulo').textContent = info.titulo;
    document.getElementById('modal-upgrade-desc').textContent   = info.desc;
    modal.classList.remove('hidden');
  }
};

// Exporta para uso nos módulos de papel
window.PLANOS     = PLANOS;
window.PlanoGuard = PlanoGuard;