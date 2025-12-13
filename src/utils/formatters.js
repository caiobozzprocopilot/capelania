// Formatação de CPF (formato: 123.321.123-12)
export const formatCPF = (value) => {
  const cleaned = value.replace(/[^\d]/g, '');
  
  if (cleaned.length === 0) return '';
  
  let formatted = '';
  
  // Primeiro grupo: 3 dígitos
  if (cleaned.length > 0) {
    formatted = cleaned.substring(0, 3);
  }
  
  // Segundo grupo: 3 dígitos
  if (cleaned.length > 3) {
    formatted += '.' + cleaned.substring(3, 6);
  }
  
  // Terceiro grupo: 3 dígitos
  if (cleaned.length > 6) {
    formatted += '.' + cleaned.substring(6, 9);
  }
  
  // Último grupo: 2 dígitos com hífen
  if (cleaned.length > 9) {
    formatted += '-' + cleaned.substring(9, 11);
  }
  
  return formatted;
};

// Formatação de telefone
export const formatPhone = (value) => {
  const cleaned = value.replace(/[^\d]/g, '');
  
  if (cleaned.length <= 10) {
    // (XX) XXXX-XXXX
    const match = cleaned.match(/^(\d{0,2})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]]
        .filter(Boolean)
        .map((part, index) => {
          if (index === 0) return `(${part}`;
          if (index === 1) return `) ${part}`;
          return `-${part}`;
        })
        .join('');
    }
  } else {
    // (XX) XXXXX-XXXX
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]]
        .filter(Boolean)
        .map((part, index) => {
          if (index === 0) return `(${part}`;
          if (index === 1) return `) ${part}`;
          return `-${part}`;
        })
        .join('');
    }
  }
  
  return value;
};

// Formatação de CEP
export const formatCEP = (value) => {
  const cleaned = value.replace(/[^\d]/g, '');
  const match = cleaned.match(/^(\d{0,5})(\d{0,3})$/);
  
  if (match) {
    return [match[1], match[2]]
      .filter(Boolean)
      .join('-');
  }
  
  return value;
};

// Formatação de RG (formato: 12.321.432-01)
export const formatRG = (value) => {
  const cleaned = value.replace(/[^\d]/g, '');
  
  if (cleaned.length === 0) return '';
  
  let formatted = '';
  
  // Primeiro grupo: 2 dígitos
  if (cleaned.length > 0) {
    formatted = cleaned.substring(0, 2);
  }
  
  // Segundo grupo: 3 dígitos
  if (cleaned.length > 2) {
    formatted += '.' + cleaned.substring(2, 5);
  }
  
  // Terceiro grupo: 3 dígitos
  if (cleaned.length > 5) {
    formatted += '.' + cleaned.substring(5, 8);
  }
  
  // Último grupo: 2 dígitos com hífen
  if (cleaned.length > 8) {
    formatted += '-' + cleaned.substring(8, 10);
  }
  
  return formatted;
};

// Formatação de data para exibição
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

// Formatação de data para input
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
