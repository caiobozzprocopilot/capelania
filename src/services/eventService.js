import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

// Criar novo evento/curso
export const createEvent = async (data) => {
  try {
    const eventId = `event_${Date.now()}`;
    
    const eventData = {
      ...data,
      id: eventId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: [] // Array de customIds dos capelães inscritos
    };

    await setDoc(doc(db, 'events', eventId), eventData);
    
    return { 
      success: true, 
      data: eventData
    };
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Buscar todos os eventos
export const getAllEvents = async () => {
  try {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });

    return { 
      success: true, 
      data: events 
    };
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Buscar evento por ID
export const getEvent = async (eventId) => {
  try {
    const docRef = doc(db, 'events', eventId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { 
        success: true, 
        data: { id: docSnap.id, ...docSnap.data() } 
      };
    } else {
      return { 
        success: false, 
        error: 'Evento não encontrado' 
      };
    }
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Atualizar evento
export const updateEvent = async (eventId, data) => {
  try {
    const docRef = doc(db, 'events', eventId);
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });

    return { 
      success: true 
    };
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Deletar evento
export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, 'events', eventId));
    
    return { 
      success: true 
    };
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Adicionar participante ao evento
export const addParticipantToEvent = async (eventId, capelaoCustomId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      return { success: false, error: 'Evento não encontrado' };
    }

    const eventData = eventSnap.data();
    const participants = eventData.participants || [];
    
    // Verifica se já está inscrito
    if (participants.includes(capelaoCustomId)) {
      return { success: false, error: 'Você já está inscrito neste evento' };
    }

    // Adiciona participante
    participants.push(capelaoCustomId);
    
    await updateDoc(eventRef, {
      participants,
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao adicionar participante:', error);
    return { success: false, error: error.message };
  }
};

// Remover participante do evento
export const removeParticipantFromEvent = async (eventId, capelaoCustomId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      return { success: false, error: 'Evento não encontrado' };
    }

    const eventData = eventSnap.data();
    const participants = eventData.participants || [];
    
    // Remove participante
    const updatedParticipants = participants.filter(id => id !== capelaoCustomId);
    
    await updateDoc(eventRef, {
      participants: updatedParticipants,
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao remover participante:', error);
    return { success: false, error: error.message };
  }
};

// Buscar eventos do capelão
export const getCapelaoEvents = async (capelaoCustomId) => {
  try {
    const eventsResult = await getAllEvents();
    
    if (!eventsResult.success) {
      return eventsResult;
    }

    // Filtra eventos onde o capelão está inscrito
    const capelaoEvents = eventsResult.data.filter(event => 
      event.participants && event.participants.includes(capelaoCustomId)
    );

    return { 
      success: true, 
      data: capelaoEvents 
    };
  } catch (error) {
    console.error('Erro ao buscar eventos do capelão:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};
