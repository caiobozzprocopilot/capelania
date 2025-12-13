// Status de produção da credencial
export const PRODUCTION_STATUS = {
  CADASTRADO: 'cadastrado',
  EM_LOTE: 'em_lote',
  EXPORTADO: 'exportado',
  EM_PRODUCAO: 'em_producao',
  PRODUZIDO: 'produzido',
  ENVIADO: 'enviado',
  ENTREGUE: 'entregue'
};

// Configuração de cada status
export const PRODUCTION_STATUS_CONFIG = {
  [PRODUCTION_STATUS.CADASTRADO]: {
    label: 'Cadastrado',
    description: 'Aguardando processamento',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300',
    icon: 'FileText'
  },
  [PRODUCTION_STATUS.EM_LOTE]: {
    label: 'Em Lote',
    description: 'Adicionado a um lote para exportação',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    icon: 'Package'
  },
  [PRODUCTION_STATUS.EXPORTADO]: {
    label: 'Exportado',
    description: 'Dados enviados para a gráfica',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-300',
    icon: 'Upload'
  },
  [PRODUCTION_STATUS.EM_PRODUCAO]: {
    label: 'Em Produção',
    description: 'Gráfica está produzindo a credencial',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    icon: 'Factory'
  },
  [PRODUCTION_STATUS.PRODUZIDO]: {
    label: 'Produzido',
    description: 'Credencial pronta',
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-300',
    icon: 'CheckCircle'
  },
  [PRODUCTION_STATUS.ENVIADO]: {
    label: 'Enviado',
    description: 'Credencial a caminho',
    color: 'cyan',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-800',
    borderColor: 'border-cyan-300',
    icon: 'Truck'
  },
  [PRODUCTION_STATUS.ENTREGUE]: {
    label: 'Entregue',
    description: 'Credencial recebida pelo capelão',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    icon: 'Gift'
  }
};

// Obter configuração de um status
export const getProductionStatusConfig = (status) => {
  return PRODUCTION_STATUS_CONFIG[status] || PRODUCTION_STATUS_CONFIG[PRODUCTION_STATUS.CADASTRADO];
};

// Ordem de progresso dos status
export const STATUS_ORDER = [
  PRODUCTION_STATUS.CADASTRADO,
  PRODUCTION_STATUS.EM_LOTE,
  PRODUCTION_STATUS.EXPORTADO,
  PRODUCTION_STATUS.EM_PRODUCAO,
  PRODUCTION_STATUS.PRODUZIDO,
  PRODUCTION_STATUS.ENVIADO,
  PRODUCTION_STATUS.ENTREGUE
];

// Calcula progresso em porcentagem
export const getProductionProgress = (status) => {
  const index = STATUS_ORDER.indexOf(status);
  if (index === -1) return 0;
  return ((index + 1) / STATUS_ORDER.length) * 100;
};

// Próximo status no workflow
export const getNextStatus = (currentStatus) => {
  const index = STATUS_ORDER.indexOf(currentStatus);
  if (index === -1 || index === STATUS_ORDER.length - 1) return null;
  return STATUS_ORDER[index + 1];
};

// Verifica se pode avançar para um status
export const canAdvanceToStatus = (currentStatus, targetStatus) => {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const targetIndex = STATUS_ORDER.indexOf(targetStatus);
  return targetIndex > currentIndex;
};
