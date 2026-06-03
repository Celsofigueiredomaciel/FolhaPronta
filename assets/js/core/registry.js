// ============================================================
// FolhaPronta — assets/js/core/registry.js
// Fonte única de verdade de todos os papéis do sistema.
// Para adicionar um papel novo: apenas uma entrada aqui.
// ============================================================

window.FolhaPronta = window.FolhaPronta || {};

window.FolhaPronta.registry = [

  // ── ESCOLAR ──────────────────────────────────────────────
  {
    id:       'pautado',
    nome:     'Papel Pautado',
    icone:    '📝',
    plano:    'free',
    cat:      'escolar',
    cor:      '#10B981',
    bg:       '#DCFCE7',
    desc:     'Linhas horizontais com espaçamento ajustável. Ideal para caligrafia e redações.',
    modulo:   'assets/js/papeis/escolar/pautado.js',
    ativo:    true,
  },
  {
    id:       'quadriculado',
    nome:     'Quadriculado',
    icone:    '⬛',
    plano:    'free',
    cat:      'escolar',
    cor:      '#10B981',
    bg:       '#DCFCE7',
    desc:     'Grade de quadrados com tamanho configurável. Ótimo para matemática e gráficos.',
    modulo:   'assets/js/papeis/escolar/quadriculado.js',
    ativo:    true,
  },
  {
    id:       'caligrafia',
    nome:     'Caligrafia',
    icone:    '✍️',
    plano:    'premium',
    cat:      'escolar',
    cor:      '#10B981',
    bg:       '#DCFCE7',
    desc:     'Linhas guia triplas para praticar caligrafia cursiva e letra bastão.',
    modulo:   'assets/js/papeis/escolar/caligrafia.js',
    ativo:    false,
  },
  {
    id:       'milimetrado',
    nome:     'Milimetrado',
    icone:    '📏',
    plano:    'premium',
    cat:      'escolar',
    cor:      '#10B981',
    bg:       '#DCFCE7',
    desc:     'Grade milimétrica de alta precisão para desenhos técnicos.',
    modulo:   'assets/js/papeis/escolar/milimetrado.js',
    ativo:    false,
  },

  // ── TÉCNICO ───────────────────────────────────────────────
  {
    id:       'engenharia',
    nome:     'Engenharia',
    icone:    '🔧',
    plano:    'free',
    cat:      'tecnico',
    cor:      '#2563EB',
    bg:       '#DBEAFE',
    desc:     'Folha A4 com bordas técnicas e campos de legendas. Padrão para projetos.',
    modulo:   'assets/js/papeis/tecnico/engenharia.js',
    ativo:    true,
  },
  {
    id:       'partitura',
    nome:     'Partitura',
    icone:    '🎵',
    plano:    'premium',
    cat:      'tecnico',
    cor:      '#2563EB',
    bg:       '#DBEAFE',
    desc:     'Pautas musicais com 5 linhas e espaçamento configurável.',
    modulo:   'assets/js/papeis/tecnico/partitura.js',
    ativo:    false,
  },
  {
    id:       'isometrico',
    nome:     'Isométrico',
    icone:    '🔷',
    plano:    'premium',
    cat:      'tecnico',
    cor:      '#2563EB',
    bg:       '#DBEAFE',
    desc:     'Grade isométrica para desenho 3D e projetos de design.',
    modulo:   'assets/js/papeis/tecnico/isometrico.js',
    ativo:    false,
  },

  // ── EMPRESARIAL ───────────────────────────────────────────
  {
    id:       'protocolo',
    nome:     'Protocolo',
    icone:    '📋',
    plano:    'free',
    cat:      'empresarial',
    cor:      '#F59E0B',
    bg:       '#FEF3C7',
    desc:     'Folha de protocolo numerada para controle de documentos.',
    modulo:   'assets/js/papeis/empresarial/protocolo.js',
    ativo:    true,
  },
  {
    id:       'ponto',
    nome:     'Ponto',
    icone:    '🕐',
    plano:    'free',
    cat:      'empresarial',
    cor:      '#F59E0B',
    bg:       '#FEF3C7',
    desc:     'Folha de ponto mensal com campos de entrada, saída e assinatura.',
    modulo:   'assets/js/papeis/empresarial/ponto.js',
    ativo:    true,
  },
  {
    id:       'requisicao',
    nome:     'Requisição',
    icone:    '📦',
    plano:    'premium',
    cat:      'empresarial',
    cor:      '#F59E0B',
    bg:       '#FEF3C7',
    desc:     'Formulário de requisição de materiais com campos de aprovação.',
    modulo:   'assets/js/papeis/empresarial/requisicao.js',
    ativo:    false,
  },
  {
    id:       'hora-extra',
    nome:     'Hora Extra',
    icone:    '⏰',
    plano:    'premium',
    cat:      'empresarial',
    cor:      '#F59E0B',
    bg:       '#FEF3C7',
    desc:     'Controle de horas extras com campos de justificativa e aprovação.',
    modulo:   'assets/js/papeis/empresarial/hora-extra.js',
    ativo:    false,
  },
  {
    id:       'ata-reuniao',
    nome:     'Ata de Reunião',
    icone:    '📝',
    plano:    'premium',
    cat:      'empresarial',
    cor:      '#F59E0B',
    bg:       '#FEF3C7',
    desc:     'Modelo profissional de ata com pauta, participantes e assinaturas.',
    modulo:   'assets/js/papeis/empresarial/ata-reuniao.js',
    ativo:    false,
  },
  {
    id:       'ordem-servico',
    nome:     'Ordem de Serviço',
    icone:    '🔩',
    plano:    'max',
    cat:      'empresarial',
    cor:      '#7C3AED',
    bg:       '#F3E8FF',
    desc:     'OS completa com logo da empresa, itens de serviço e assinaturas.',
    modulo:   'assets/js/papeis/empresarial/ordem-servico.js',
    ativo:    false,
  },

  // ── RECIBOS ───────────────────────────────────────────────
  {
    id:       'recibo-simples',
    nome:     'Recibo Simples',
    icone:    '🧾',
    plano:    'free',
    cat:      'recibos',
    cor:      '#EC4899',
    bg:       '#FCE7F3',
    desc:     'Recibo básico com campos de valor, pagador, motivo e data. 2 vias.',
    modulo:   'assets/js/papeis/recibos/recibo-simples.js',
    ativo:    true,
  },
  {
    id:       'recibo-aluguel',
    nome:     'Recibo de Aluguel',
    icone:    '🏠',
    plano:    'free',
    cat:      'recibos',
    cor:      '#EC4899',
    bg:       '#FCE7F3',
    desc:     'Recibo de aluguel com IPTU, condomínio e período. 2 vias.',
    modulo:   'assets/js/papeis/recibos/recibo-aluguel.js',
    ativo:    true,
  },
  {
    id:       'recibo-comercial',
    nome:     'Recibo Comercial',
    icone:    '🏪',
    plano:    'premium',
    cat:      'recibos',
    cor:      '#EC4899',
    bg:       '#FCE7F3',
    desc:     'Recibo com CNPJ, razão social e campos fiscais completos.',
    modulo:   'assets/js/papeis/recibos/recibo-comercial.js',
    ativo:    false,
  },
  {
    id:       'recibo-2vias',
    nome:     'Recibo 2 Vias',
    icone:    '📑',
    plano:    'premium',
    cat:      'recibos',
    cor:      '#EC4899',
    bg:       '#FCE7F3',
    desc:     'Recibo duplicado em uma única folha A4.',
    modulo:   'assets/js/papeis/recibos/recibo-2vias.js',
    ativo:    false,
  },

  // ── CRIATIVO ──────────────────────────────────────────────
  {
    id:       'planner-semanal',
    nome:     'Planner Semanal',
    icone:    '📅',
    plano:    'free',
    cat:      'criativo',
    cor:      '#7C3AED',
    bg:       '#F3E8FF',
    desc:     'Planner de 7 dias com blocos de horários e espaço para anotações.',
    modulo:   'assets/js/papeis/criativo/planner-semanal.js',
    ativo:    true,
  },
  {
    id:       'lista-tarefas',
    nome:     'Lista de Tarefas',
    icone:    '✅',
    plano:    'free',
    cat:      'criativo',
    cor:      '#7C3AED',
    bg:       '#F3E8FF',
    desc:     'Checklist com campos de prioridade, prazo e categoria.',
    modulo:   'assets/js/papeis/criativo/lista-tarefas.js',
    ativo:    true,
  },
  {
    id:       'bullet-journal',
    nome:     'Bullet Journal',
    icone:    '🎯',
    plano:    'premium',
    cat:      'criativo',
    cor:      '#7C3AED',
    bg:       '#F3E8FF',
    desc:     'Página de bullet journal com grid de pontos e índice.',
    modulo:   'assets/js/papeis/criativo/bullet-journal.js',
    ativo:    false,
  },
  {
    id:       'storyboard',
    nome:     'Storyboard',
    icone:    '🎬',
    plano:    'max',
    cat:      'criativo',
    cor:      '#7C3AED',
    bg:       '#F3E8FF',
    desc:     'Grid de quadros com cena, diálogo e descrição para roteiristas.',
    modulo:   'assets/js/papeis/criativo/storyboard.js',
    ativo:    false,
  },

  // ── AGRO ──────────────────────────────────────────────────
  {
    id:       'caderneta-campo',
    nome:     'Caderneta de Campo',
    icone:    '🌾',
    plano:    'free',
    cat:      'agro',
    cor:      '#16A34A',
    bg:       '#DCFCE7',
    desc:     'Controle simples de plantio, colheita e gastos por safra.',
    modulo:   'assets/js/papeis/agro/caderneta-campo.js',
    ativo:    false,
  },
  {
    id:       'controle-insumos',
    nome:     'Controle de Insumos',
    icone:    '🌱',
    plano:    'free',
    cat:      'agro',
    cor:      '#16A34A',
    bg:       '#DCFCE7',
    desc:     'Entrada e saída de sementes, fertilizantes e defensivos.',
    modulo:   'assets/js/papeis/agro/controle-insumos.js',
    ativo:    false,
  },
  {
    id:       'diario-safra',
    nome:     'Diário de Safra',
    icone:    '📓',
    plano:    'free',
    cat:      'agro',
    cor:      '#16A34A',
    bg:       '#DCFCE7',
    desc:     'Registro semanal de atividades e observações do campo.',
    modulo:   'assets/js/papeis/agro/diario-safra.js',
    ativo:    false,
  },
  {
    id:       'recibo-rural',
    nome:     'Recibo Rural',
    icone:    '📜',
    plano:    'free',
    cat:      'agro',
    cor:      '#16A34A',
    bg:       '#DCFCE7',
    desc:     'Recibo para venda de produção agrícola e serviços rurais.',
    modulo:   'assets/js/papeis/agro/recibo-rural.js',
    ativo:    false,
  },

];

// ── Helpers para consultar o registry ────────────────────────

/**
 * Retorna um papel pelo ID.
 * @param {string} id
 * @returns {Object|undefined}
 */
window.FolhaPronta.getPapel = function(id) {
  return window.FolhaPronta.registry.find(p => p.id === id);
};

/**
 * Retorna todos os papéis de uma categoria.
 * @param {string} cat
 * @returns {Array}
 */
window.FolhaPronta.getPorCategoria = function(cat) {
  return window.FolhaPronta.registry.filter(p => p.cat === cat);
};

/**
 * Retorna todos os papéis de um plano.
 * @param {string} plano — 'free' | 'premium' | 'max'
 * @returns {Array}
 */
window.FolhaPronta.getPorPlano = function(plano) {
  return window.FolhaPronta.registry.filter(p => p.plano === plano);
};

/**
 * Retorna apenas os papéis ativos (módulo JS implementado).
 * @returns {Array}
 */
window.FolhaPronta.getAtivos = function() {
  return window.FolhaPronta.registry.filter(p => p.ativo === true);
};