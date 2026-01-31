// Calcula idade a partir da data de nascimento
export const calculateAge = (birthDate) => {
  const today = new Date();
  
  // Parse da data sem problema de timezone
  let birth;
  const dateStr = birthDate.toString();
  if (dateStr.includes('-')) {
    // Formato YYYY-MM-DD - criar data no fuso local
    const [year, month, day] = dateStr.split('T')[0].split('-');
    birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    birth = new Date(birthDate);
  }
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Calcula data de expiração (4 anos após o registro)
export const calculateExpirationDate = (registrationDate) => {
  // Parse da data sem problema de timezone
  let date;
  const dateStr = registrationDate.toString();
  if (dateStr.includes('-')) {
    // Formato YYYY-MM-DD - criar data no fuso local
    const [year, month, day] = dateStr.split('T')[0].split('-');
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    date = new Date(registrationDate);
  }
  date.setFullYear(date.getFullYear() + 4);
  return date;
};

// Calcula dias restantes até expiração
export const daysUntilExpiration = (expirationDate) => {
  const today = new Date();
  // Parse da data sem problema de timezone
  let expiration;
  const dateStr = expirationDate.toString();
  if (dateStr.includes('-')) {
    // Formato YYYY-MM-DD - criar data no fuso local
    const [year, month, day] = dateStr.split('T')[0].split('-');
    expiration = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    expiration = new Date(expirationDate);
  }
  const diffTime = expiration - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Calcula meses restantes até expiração
export const monthsUntilExpiration = (expirationDate) => {
  const today = new Date();
  // Parse da data sem problema de timezone
  let expiration;
  const dateStr = expirationDate.toString();
  if (dateStr.includes('-')) {
    // Formato YYYY-MM-DD - criar data no fuso local
    const [year, month, day] = dateStr.split('T')[0].split('-');
    expiration = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    expiration = new Date(expirationDate);
  }
  
  let months = (expiration.getFullYear() - today.getFullYear()) * 12;
  months += expiration.getMonth() - today.getMonth();
  
  return months;
};

// Calcula porcentagem de validade decorrida
export const calculateValidityPercentage = (registrationDate, expirationDate) => {
  // Parse das datas sem problema de timezone
  let start, end;
  const regDateStr = registrationDate.toString();
  if (regDateStr.includes('-')) {
    const [year, month, day] = regDateStr.split('T')[0].split('-');
    start = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    start = new Date(registrationDate);
  }
  
  const expDateStr = expirationDate.toString();
  if (expDateStr.includes('-')) {
    const [year, month, day] = expDateStr.split('T')[0].split('-');
    end = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    end = new Date(expirationDate);
  }
  
  const today = new Date();
  
  const totalTime = end - start;
  const elapsedTime = today - start;
  
  const percentage = (elapsedTime / totalTime) * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

// Obtém status de validade
export const getValidityStatus = (expirationDate) => {
  const months = monthsUntilExpiration(expirationDate);
  const days = daysUntilExpiration(expirationDate);
  
  if (days < 0) {
    return {
      status: 'expired',
      label: 'Expirado',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-500'
    };
  }
  
  if (months < 6) {
    return {
      status: 'expiring-soon',
      label: 'Próximo ao Vencimento',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-500'
    };
  }
  
  if (months < 12) {
    return {
      status: 'warning',
      label: 'Atenção',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-500'
    };
  }
  
  return {
    status: 'active',
    label: 'Ativo',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-500'
  };
};

// Formata tempo restante em texto legível
export const formatTimeRemaining = (expirationDate) => {
  const days = daysUntilExpiration(expirationDate);
  
  if (days < 0) {
    return `Expirado há ${Math.abs(days)} dias`;
  }
  
  if (days === 0) {
    return 'Expira hoje';
  }
  
  if (days === 1) {
    return 'Expira amanhã';
  }
  
  if (days < 30) {
    return `Expira em ${days} dias`;
  }
  
  const months = monthsUntilExpiration(expirationDate);
  if (months === 1) {
    return 'Expira em 1 mês';
  }
  
  if (months < 12) {
    return `Expira em ${months} meses`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 1 && remainingMonths === 0) {
    return 'Expira em 1 ano';
  }
  
  if (remainingMonths === 0) {
    return `Expira em ${years} anos`;
  }
  
  return `Expira em ${years} ano${years > 1 ? 's' : ''} e ${remainingMonths} ${remainingMonths > 1 ? 'meses' : 'mês'}`;
};
