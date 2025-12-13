import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/auth';
import { createCapelao } from '../../services/capelaoService';
import RegistrationForm from '../../components/forms/RegistrationForm';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleFormSubmit = async (formData) => {
    try {
      setError('');

      // Detecta se deve ser admin (email contém "admin")
      const isAdmin = formData.email.toLowerCase().includes('admin');
      const userRole = isAdmin ? 'admin' : 'user';

      console.log('Iniciando registro...', { email: formData.email, role: userRole });

      // 1. Cria conta de autenticação
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../../services/firebase');
      
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.senha);
      const user = userCredential.user;
      
      console.log('Usuário criado no Authentication:', user.uid);

      // 2. Cria registro do capelão com o UID do usuário (remove campos de senha)
      const { senha, confirmarSenha, ...capelaoData } = formData;
      const capelaoResult = await createCapelao(capelaoData, user.uid);

      if (!capelaoResult.success) {
        setError('Erro ao criar registro do capelão: ' + capelaoResult.error);
        return;
      }

      console.log('Capelão criado:', capelaoResult.customId);

      // 3. Cria documento do usuário no Firestore com customId
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../services/firebase');
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: formData.email,
        role: userRole,
        customId: capelaoResult.customId,
        nomeCompleto: formData.nomeCompleto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Documento do usuário criado no Firestore');

      // 4. Sucesso - redireciona
      const mensagem = isAdmin 
        ? '✅ Cadastro realizado com sucesso! Você foi registrado como ADMINISTRADOR.\n\nFaça login com:\nEmail: ' + formData.email 
        : '✅ Cadastro realizado com sucesso!\n\nFaça login com seu email e senha.';
      
      alert(mensagem);
      navigate('/login');

    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao processar cadastro.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso. Tente fazer login ou use outro email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca. Use no mínimo 6 caracteres.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cadastro de Capelão
          </h1>
          <p className="text-gray-600">
            Preencha todos os campos para realizar seu cadastro
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-4xl mx-auto">
            {error}
          </div>
        )}

        <RegistrationForm onSubmit={handleFormSubmit} />

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Já tem cadastro? Faça login aqui
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
