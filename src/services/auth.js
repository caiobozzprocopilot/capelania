import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Registrar novo usuário
export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Detecta role do userData ou usa padrão
    const userRole = userData.role || 'user';

    // Salva dados do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      uid: user.uid,
      email: email,
      role: userRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expirationDate: calculateExpirationDate(new Date()).toISOString()
    }, { merge: true });

    return { success: true, user };
  } catch (error) {
    console.error('Erro ao registrar:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Login
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Logout
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Recuperar senha
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Erro ao recuperar senha:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Observar mudanças no estado de autenticação
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Obter dados do usuário do Firestore
export const getUserData = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'Usuário não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return { success: false, error: error.message };
  }
};

// Calcula data de expiração (4 anos)
const calculateExpirationDate = (date) => {
  const expiration = new Date(date);
  expiration.setFullYear(expiration.getFullYear() + 4);
  return expiration;
};

// Mensagens de erro em português
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'Este email já está em uso',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres)',
    'auth/user-disabled': 'Usuário desabilitado',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
  };

  return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente';
};
