import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { stripDataPrefix, addDataPrefix } from './imageHelpers';
import { formatCPF, formatPhone, formatDate } from './formatters';

/**
 * Converte Base64 para Blob de imagem
 */
const base64ToBlob = (base64, mimeType = 'image/jpeg') => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * Exporta capelões para Excel com fotos em ZIP
 * @param {Array} capeloes - Lista de capelões
 * @param {Object} options - Opções de exportação
 */
export const exportToExcelWithPhotos = async (capeloes, options = {}) => {
  try {
    const {
      fileName = 'credenciais_export',
      includePhotos = true,
      selectedFields = 'all'
    } = options;

    // Criar ZIP
    const zip = new JSZip();
    const fotosFolder = zip.folder('fotos');
    
    // Preparar dados para Excel
    const excelData = [];
    
    for (const capelao of capeloes) {
      const nomeArquivoFoto = capelao.fotoB64 
        ? `capelao_${capelao.cpf.replace(/[^\d]/g, '')}.jpg`
        : '';

      // Adicionar foto ao ZIP se existir
      if (includePhotos && capelao.fotoB64) {
        try {
          const fotoBlob = base64ToBlob(capelao.fotoB64, capelao.fotoMime || 'image/jpeg');
          fotosFolder.file(nomeArquivoFoto, fotoBlob);
        } catch (error) {
          console.error(`Erro ao processar foto de ${capelao.nomeCompleto}:`, error);
        }
      }

      // Montar linha do Excel
      const row = {
        'Nome Completo': capelao.nomeCompleto || '',
        'CPF': formatCPF(capelao.cpf) || '',
        'RG': capelao.rg || '',
        'Data de Nascimento': capelao.dataNascimento || '',
        'Idade': capelao.idade || '',
        'Nome da Mãe': capelao.nomeMae || '',
        'Nome do Pai': capelao.nomePai || '',
        'Cargo Eclesiástico': capelao.cargoEclesiastico || '',
        'Igreja': capelao.igreja || '',
        'Cidade Natal': capelao.cidadeNatal || '',
        'Cidade Atual': capelao.cidadeAtual || '',
        'Telefone': formatPhone(capelao.telefone) || '',
        'Email': capelao.email || '',
        'Rua': capelao.endereco?.rua || '',
        'Número': capelao.endereco?.numero || '',
        'Complemento': capelao.endereco?.complemento || '',
        'Bairro': capelao.endereco?.bairro || '',
        'CEP': capelao.endereco?.cep || '',
        'Data de Validade': capelao.expirationDate?.split('T')[0] || '',
        'Data de Cadastro': capelao.registrationDate?.split('T')[0] || capelao.createdAt?.split('T')[0] || '',
        'Status': capelao.status || '',
        'Arquivo da Foto': nomeArquivoFoto ? `fotos/${nomeArquivoFoto}` : 'SEM FOTO'
      };

      excelData.push(row);
    }

    // Criar planilha Excel
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Ajustar largura das colunas
    const columnWidths = [
      { wch: 30 }, // Nome Completo
      { wch: 15 }, // CPF
      { wch: 15 }, // RG
      { wch: 15 }, // Data de Nascimento
      { wch: 8 },  // Idade
      { wch: 25 }, // Nome da Mãe
      { wch: 25 }, // Nome do Pai
      { wch: 20 }, // Cargo
      { wch: 25 }, // Igreja
      { wch: 20 }, // Cidade Natal
      { wch: 20 }, // Cidade Atual
      { wch: 15 }, // Telefone
      { wch: 25 }, // Email
      { wch: 30 }, // Rua
      { wch: 8 },  // Número
      { wch: 15 }, // Complemento
      { wch: 20 }, // Bairro
      { wch: 12 }, // CEP
      { wch: 15 }, // Data de Validade
      { wch: 15 }, // Data de Cadastro
      { wch: 12 }, // Status
      { wch: 35 }  // Arquivo da Foto
    ];
    worksheet['!cols'] = columnWidths;

    // Criar workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Capelões');

    // Adicionar informações extras em outra aba
    const infoData = [
      ['Sistema de Gerenciamento de Capelania'],
      ['Data de Exportação:', new Date().toLocaleString('pt-BR')],
      ['Total de Registros:', capeloes.length],
      [''],
      ['Instruções para a Gráfica:'],
      ['1. As fotos estão na pasta "fotos" dentro do ZIP'],
      ['2. Os nomes dos arquivos seguem o padrão: capelao_CPF.jpg'],
      ['3. A coluna "Arquivo da Foto" indica o caminho de cada foto'],
      ['4. Fotos sem cadastro aparecem como "SEM FOTO"']
    ];
    const infoSheet = XLSX.utils.aoa_to_sheet(infoData);
    XLSX.utils.book_append_sheet(workbook, infoSheet, 'Informações');

    // Converter workbook para buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Adicionar Excel ao ZIP
    zip.file(`${fileName}.xlsx`, excelBuffer);

    // Gerar ZIP e fazer download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(zipBlob, `${fileName}_${timestamp}.zip`);

    return {
      success: true,
      message: `Exportados ${capeloes.length} registros com sucesso!`,
      count: capeloes.length
    };

  } catch (error) {
    console.error('Erro ao exportar:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Exporta apenas Excel (sem fotos) - mais leve e rápido
 */
export const exportToExcelOnly = (capeloes, fileName = 'capeloes_export') => {
  try {
    const excelData = capeloes.map(capelao => ({
      'Nome Completo': capelao.nomeCompleto || '',
      'CPF': formatCPF(capelao.cpf) || '',
      'RG': capelao.rg || '',
      'Data de Nascimento': capelao.dataNascimento || '',
      'Cargo Eclesiástico': capelao.cargoEclesiastico || '',
      'Igreja': capelao.igreja || '',
      'Cidade Atual': capelao.cidadeAtual || '',
      'Telefone': formatPhone(capelao.telefone) || '',
      'Email': capelao.email || '',
      'Data de Validade': capelao.expirationDate?.split('T')[0] || '',
      'Status': capelao.status || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Capelões');

    // Download
    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);

    return {
      success: true,
      message: `Exportados ${capeloes.length} registros com sucesso!`,
      count: capeloes.length
    };

  } catch (error) {
    console.error('Erro ao exportar:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
