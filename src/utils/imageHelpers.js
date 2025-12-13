/**
 * Comprime uma imagem para Base64
 * @param {File} file - Arquivo de imagem
 * @param {number} maxWidth - Largura máxima (padrão: 800px)
 * @param {number} quality - Qualidade JPEG (0-1, padrão: 0.8)
 * @returns {Promise<{dataUrl: string}>} - Data URL da imagem comprimida
 */
export const compressImageFile = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Cria canvas para redimensionar
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calcula novas dimensões mantendo a proporção
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenha imagem redimensionada
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converte para Base64 JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({ dataUrl });
      };
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(file);
  });
};

/**
 * Remove o prefixo "data:image/jpeg;base64," da string Base64
 * @param {string} dataUrl - Data URL completa
 * @returns {string} - String Base64 pura
 */
export const stripDataPrefix = (dataUrl) => {
  const prefix = dataUrl.indexOf(',');
  return prefix !== -1 ? dataUrl.substring(prefix + 1) : dataUrl;
};

/**
 * Adiciona o prefixo à string Base64 para exibição
 * @param {string} base64 - String Base64 pura
 * @param {string} mimeType - Tipo MIME (padrão: image/jpeg)
 * @returns {string} - Data URL completa
 */
export const addDataPrefix = (base64, mimeType = 'image/jpeg') => {
  if (!base64) return null;
  if (base64.startsWith('data:')) return base64; // Já tem prefixo
  return `data:${mimeType};base64,${base64}`;
};

/**
 * Valida o tamanho da imagem Base64
 * @param {string} base64 - String Base64 pura
 * @param {number} maxSize - Tamanho máximo em bytes (padrão: 950KB)
 * @returns {boolean} - true se válido
 */
export const validateBase64Size = (base64, maxSize = 950000) => {
  return base64.length <= maxSize;
};
