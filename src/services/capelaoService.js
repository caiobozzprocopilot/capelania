import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { validateBase64Size } from '../utils/imageHelpers';

// Gera ID personalizado: nome_cidade
const generateCustomId = (nomeCompleto, cidadeAtual) => {
  const nome = nomeCompleto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '_'); // Substitui espaços por underscore
  
  const cidade = cidadeAtual
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  
  return `${nome}_${cidade}`;
};

// Criar novo capelão
export const createCapelao = async (data, userId) => {
  try {
    // Gera ID personalizado
    const customId = generateCustomId(data.nomeCompleto, data.cidadeAtual);

    // Valida tamanho da imagem Base64
    if (data.fotoB64 && !validateBase64Size(data.fotoB64)) {
      return { 
        success: false, 
        error: 'A imagem é muito grande. Máximo permitido: 950KB' 
      };
    }

    const capelaoData = {
      ...data,
      userId,
      customId,
      fotoB64: data.fotoB64 || null,
      fotoMime: data.fotoMime || 'image/jpeg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      registrationDate: new Date().toISOString(),
      expirationDate: calculateExpirationDate(new Date()).toISOString(),
      status: 'active',
      productionStatus: 'cadastrado', // Status de produção da credencial
      productionHistory: [] // Histórico de mudanças de status
    };

    // Remove campos desnecessários
    delete capelaoData.foto;

    // Usa o customId como ID do documento
    await setDoc(doc(db, 'capeloes', customId), capelaoData);

    return { success: true, data: capelaoData, customId };
  } catch (error) {
    console.error('Erro ao criar capelão:', error);
    return { success: false, error: error.message };
  }
};

// Buscar capelão por ID
export const getCapelao = async (id) => {
  try {
    const docRef = doc(db, 'capeloes', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Capelão não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao buscar capelão:', error);
    return { success: false, error: error.message };
  }
};

// Buscar todos os capelões
export const getAllCapeloes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'capeloes'));
    const capeloes = [];
    
    querySnapshot.forEach((doc) => {
      capeloes.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: capeloes };
  } catch (error) {
    console.error('Erro ao buscar capelões:', error);
    return { success: false, error: error.message };
  }
};

// Atualizar capelão
export const updateCapelao = async (id, data) => {
  try {
    // Valida tamanho da imagem Base64 se fornecida
    if (data.fotoB64 && !validateBase64Size(data.fotoB64)) {
      return { 
        success: false, 
        error: 'A imagem é muito grande. Máximo permitido: 950KB' 
      };
    }

    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
      // Atualiza a data de expiração na renovação
      ...(data.isRenewal && {
        registrationDate: new Date().toISOString(),
        expirationDate: calculateExpirationDate(new Date()).toISOString()
      })
    };

    // Remove campos desnecessários
    delete updatedData.foto;

    const docRef = doc(db, 'capeloes', id);
    await updateDoc(docRef, updatedData);

    return { success: true, data: updatedData };
  } catch (error) {
    console.error('Erro ao atualizar capelão:', error);
    return { success: false, error: error.message };
  }
};

// Deletar capelão
export const deleteCapelao = async (id) => {
  try {
    await deleteDoc(doc(db, 'capeloes', id));
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar capelão:', error);
    return { success: false, error: error.message };
  }
};

// Buscar capelões por status de validade
export const getCapeloesByStatus = async (status) => {
  try {
    const q = query(
      collection(db, 'capeloes'),
      where('status', '==', status),
      orderBy('expirationDate', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const capeloes = [];
    
    querySnapshot.forEach((doc) => {
      capeloes.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: capeloes };
  } catch (error) {
    console.error('Erro ao buscar capelões por status:', error);
    return { success: false, error: error.message };
  }
};

// Calcula data de expiração (4 anos)
const calculateExpirationDate = (date) => {
  const expiration = new Date(date);
  expiration.setFullYear(expiration.getFullYear() + 4);
  return expiration;
};

// Obter estatísticas
export const getStatistics = async () => {
  try {
    const capeloes = await getAllCapeloes();
    
    if (!capeloes.success) {
      return { success: false, error: capeloes.error };
    }

    const total = capeloes.data.length;
    const today = new Date();
    
    let active = 0;
    let expiringSoon = 0;
    let expired = 0;

    capeloes.data.forEach(capelao => {
      const expirationDate = new Date(capelao.expirationDate);
      const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiration < 0) {
        expired++;
      } else if (daysUntilExpiration <= 90) {
        expiringSoon++;
      } else {
        active++;
      }
    });

    return {
      success: true,
      data: {
        total,
        active,
        expiringSoon,
        expired
      }
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return { success: false, error: error.message };
  }
};

// Atualizar status de produção de um capelão
export const updateProductionStatus = async (id, newStatus, observation = '') => {
  try {
    const docRef = doc(db, 'capeloes', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: 'Capelão não encontrado' };
    }

    const currentData = docSnap.data();
    const historyEntry = {
      status: newStatus,
      observation,
      timestamp: new Date().toISOString(),
      previousStatus: currentData.productionStatus || 'cadastrado'
    };

    await updateDoc(docRef, {
      productionStatus: newStatus,
      productionHistory: [...(currentData.productionHistory || []), historyEntry],
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar status de produção:', error);
    return { success: false, error: error.message };
  }
};

// Atualizar status de produção em lote
export const updateBatchProductionStatus = async (capelaoIds, newStatus, observation = '') => {
  try {
    const updatePromises = capelaoIds.map(id => 
      updateProductionStatus(id, newStatus, observation)
    );

    const results = await Promise.all(updatePromises);
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return {
      success: failCount === 0,
      successCount,
      failCount,
      message: `${successCount} capelão(ães) atualizado(s) com sucesso${failCount > 0 ? `, ${failCount} falharam` : ''}`
    };
  } catch (error) {
    console.error('Erro ao atualizar status em lote:', error);
    return { success: false, error: error.message };
  }
};
