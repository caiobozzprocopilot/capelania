// Validação de CPF
export const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // MODO TESTE: Aceita qualquer CPF com 11 dígitos (sem validação do dígito verificador)
  // Para produção, descomente o código abaixo:
  
  /*
  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;
  
  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;
  */
  
  return true;
};

// Validação de email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validação de telefone
export const validatePhone = (phone) => {
  const cleaned = phone.replace(/[^\d]/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

// Validação de nome completo
export const validateFullName = (name) => {
  const trimmed = name.trim();
  const words = trimmed.split(/\s+/);
  return words.length >= 2 && words.every(word => word.length >= 2);
};

// Validação de idade mínima
export const validateAge = (birthDate, minAge = 18) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= minAge;
};

// Validação de CEP
export const validateCEP = (cep) => {
  const cleaned = cep.replace(/[^\d]/g, '');
  return cleaned.length === 8;
};

// Validação de arquivo de imagem
export const validateImageFile = (file) => {
  if (!file) return { valid: false, error: 'Nenhum arquivo selecionado' };
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Formato inválido. Use JPG ou PNG' };
  }
  
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Arquivo muito grande. Máximo 2MB' };
  }
  
  return { valid: true };
};

// Validação de proporção 3x4 da imagem
export const validateImageRatio = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const ratio = img.width / img.height;
      const expectedRatio = 3 / 4;
      const tolerance = 0.1;
      
      URL.revokeObjectURL(url);
      
      if (Math.abs(ratio - expectedRatio) <= tolerance) {
        resolve({ valid: true });
      } else {
        resolve({ 
          valid: false, 
          error: 'A imagem deve ter proporção 3x4 (foto 3x4)' 
        });
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: 'Erro ao carregar imagem' });
    };
    
    img.src = url;
  });
};
