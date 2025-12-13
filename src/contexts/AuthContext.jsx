import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserData } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Observa mudanças no estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Busca dados do usuário no Firestore
        try {
          const result = await getUserData(user.uid);
          if (result.success) {
            setUserData(result.data);
          } else {
            console.warn('Dados do usuário não encontrados, pode ser primeiro acesso');
            setUserData(null);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const signOut = async () => {
    const { signOut: firebaseSignOut } = await import('../services/auth');
    await firebaseSignOut();
    setCurrentUser(null);
    setUserData(null);
  };

  const refreshUserData = async () => {
    if (currentUser) {
      const result = await getUserData(currentUser.uid);
      if (result.success) {
        setUserData(result.data);
      }
    }
  };

  const isAdmin = () => {
    return userData?.role === 'admin';
  };

  const value = {
    currentUser,
    userData,
    loading,
    signOut,
    refreshUserData,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
