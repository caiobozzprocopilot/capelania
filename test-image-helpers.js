// Teste rápido das funções de imagem
// Execute no console do navegador para testar

import { compressImageFile, stripDataPrefix, addDataPrefix, validateBase64Size } from './src/utils/imageHelpers';

// Teste 1: Comprimir imagem
const testCompression = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    console.log('Arquivo original:', {
      nome: file.name,
      tamanho: file.size,
      tipo: file.type
    });
    
    try {
      const { dataUrl } = await compressImageFile(file, 800, 0.8);
      const base64 = stripDataPrefix(dataUrl);
      
      console.log('Após compressão:', {
        tamanhoBase64: base64.length,
        tamanhoKB: (base64.length / 1024).toFixed(2) + ' KB',
        valido: validateBase64Size(base64) ? 'SIM' : 'NÃO'
      });
      
      // Exibe preview
      const img = document.createElement('img');
      img.src = addDataPrefix(base64);
      img.style.maxWidth = '300px';
      document.body.appendChild(img);
      
    } catch (error) {
      console.error('Erro:', error);
    }
  };
  
  input.click();
};

// Execute:
// testCompression();

console.log('Teste carregado! Execute: testCompression()');
