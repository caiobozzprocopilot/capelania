import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-KvtrTGlO_yrgKyiWyrbuK2HAQx9lk7s",
  authDomain: "capelania-aa2d4.firebaseapp.com",
  projectId: "capelania-aa2d4",
  storageBucket: "capelania-aa2d4.firebasestorage.app",
  messagingSenderId: "1027673863986",
  appId: "1:1027673863986:web:40179fc6a6c5c132c6492b",
  measurementId: "G-1S60F8HE6T"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
