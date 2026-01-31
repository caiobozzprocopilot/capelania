/**
 * Serviço para geração de credenciais virtuais
 * Usa Canvas API para sobrepor dados do capelão nos templates
 */

import { addDataPrefix } from '../utils/imageHelpers';
import jsPDF from 'jspdf';

/**
 * Carrega uma imagem e retorna como Promise
 */
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Gera a frente da credencial com os dados do capelão
 */
export const generateCredentialFront = async (capelaoData) => {
  try {
    // Carregar template e foto do capelão
    const template = await loadImage('/templates/credential-front.png');
    const photoUrl = capelaoData.fotoB64 ? addDataPrefix(capelaoData.fotoB64, capelaoData.fotoMime) : null;
    const photo = photoUrl ? await loadImage(photoUrl) : null;

    // Criar canvas com dimensões do template
    const canvas = document.createElement('canvas');
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext('2d');

    // Desenhar template
    ctx.drawImage(template, 0, 0);

    // Configurar fonte
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';

    // Adicionar nome (Nome / Name:) - fonte menor
    ctx.font = 'bold 26px Arial';
    ctx.fillText(capelaoData.nomeCompleto || '', 246, 395);

    // Adicionar função (Função / Function:)
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Capelão', 246, 477);

    // Adicionar foto do capelão - enquadra exatamente no retângulo azul do template
    if (photo) {
      // Coordenadas exatas do retângulo azul na imagem
      const photoX = 794;
      const photoY = 288;
      const photoWidth = 153;
      const photoHeight = 205;

      // Desenhar foto diretamente no retângulo, sem distorção
      ctx.drawImage(photo, photoX, photoY, photoWidth, photoHeight);
    }

    // Converter para blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 1.0);
    });
  } catch (error) {
    console.error('Erro ao gerar frente da credencial:', error);
    throw error;
  }
};

/**
 * Gera o verso da credencial com os dados do capelão
 */
export const generateCredentialBack = async (capelaoData) => {
  try {
    // Carregar template
    const template = await loadImage('/templates/credential-back.png');

    // Criar canvas
    const canvas = document.createElement('canvas');
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext('2d');

    // Desenhar template
    ctx.drawImage(template, 0, 0);

    // Configurar fonte
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.font = 'bold 24px Arial';

    // Função para formatar data
    const formatDate = (dateValue) => {
      if (!dateValue) return '';
      
      // Se for Timestamp do Firestore
      if (dateValue.seconds) {
        return new Date(dateValue.seconds * 1000).toLocaleDateString('pt-BR');
      }
      
      // Se for ISO String ou Date - corrigir timezone
      const dateStr = dateValue.toString();
      if (dateStr.includes('-')) {
        // Formato YYYY-MM-DD - criar data no fuso local
        const [year, month, day] = dateStr.split('T')[0].split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('pt-BR');
      }
      
      const date = new Date(dateValue);
      return !isNaN(date.getTime()) ? date.toLocaleDateString('pt-BR') : '';
    };

    // RG (x: ~51, y: ~224)
    ctx.fillText(capelaoData.rg || '', 51, 224);

    // CPF (x: ~331, y: ~224)
    ctx.fillText(capelaoData.cpf || '', 331, 224);

    // Data de expedição (x: ~521, y: ~224)
    const dataExpedicao = formatDate(capelaoData.createdAt) || new Date().toLocaleDateString('pt-BR');
    ctx.fillText(dataExpedicao, 521, 224);

    // Naturalidade (x: ~51, y: ~299)
    ctx.fillText(capelaoData.cidadeNatal || '', 51, 299);

    // Data de nascimento (x: ~521, y: ~299)
    ctx.fillText(formatDate(capelaoData.dataNascimento), 521, 299);

    // Filiação - Mãe (x: ~51, y: ~376)
    ctx.fillText(capelaoData.nomeMae || '', 51, 376);

    // Filiação - Pai (x: ~51, y: ~413)
    ctx.fillText(capelaoData.nomePai || '', 51, 413);

    // Data de validade (x: ~714, y: ~399)
    ctx.fillText(formatDate(capelaoData.expirationDate), 714, 399);

    // Converter para blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 1.0);
    });
  } catch (error) {
    console.error('Erro ao gerar verso da credencial:', error);
    throw error;
  }
};

/**
 * Gera ambos os lados da credencial
 */
export const generateFullCredential = async (capelaoData) => {
  const [front, back] = await Promise.all([
    generateCredentialFront(capelaoData),
    generateCredentialBack(capelaoData)
  ]);

  return { front, back };
};

/**
 * Converte blob para data URL
 */
const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Baixa a credencial como PDF único com frente e verso
 */
export const downloadCredential = async (capelaoData) => {
  try {
    const { front, back } = await generateFullCredential(capelaoData);

    // Converte blobs para data URLs
    const frontDataUrl = await blobToDataURL(front);
    const backDataUrl = await blobToDataURL(back);

    // Criar PDF no formato de cartão (85.6mm x 54mm - tamanho cartão de crédito)
    // Usando 300 DPI para impressão: 85.6mm = 1011px, 54mm = 638px
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54]
    });

    // Adiciona a frente (primeira página)
    pdf.addImage(frontDataUrl, 'PNG', 0, 0, 85.6, 54, undefined, 'FAST');

    // Adiciona nova página para o verso
    pdf.addPage();
    pdf.addImage(backDataUrl, 'PNG', 0, 0, 85.6, 54, undefined, 'FAST');

    // Faz o download do PDF
    const fileName = `credencial-${capelaoData.nomeCompleto.replace(/\s+/g, '-')}.pdf`;
    pdf.save(fileName);

    return { success: true };
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return { success: false, error: error.message };
  }
};
