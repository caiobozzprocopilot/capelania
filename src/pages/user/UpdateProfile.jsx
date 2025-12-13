import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCapelao, updateCapelao } from '../../services/capelaoService';
import { getUserData } from '../../services/auth';
import RegistrationForm from '../../components/forms/RegistrationForm';
import Header from '../../components/layout/Header';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [customId, setCustomId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const loadUserData = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      // Primeiro busca o customId
      const userDataResult = await getUserData(currentUser.uid);
      
      if (!userDataResult.success || !userDataResult.data.customId) {
        console.error('CustomId não encontrado');
        setInitialData(null);
        setLoading(false);
        return;
      }

      setCustomId(userDataResult.data.customId);

      // Busca os dados do capelão usando o customId
      const result = await getCapelao(userDataResult.data.customId);
      
      if (result.success) {
        setInitialData(result.data);
      } else {
        console.error('Erro ao carregar dados:', result.error);
        setInitialData(null);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setInitialData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const result = await updateCapelao(customId, formData);
      
      if (result.success) {
        alert('Cadastro atualizado com sucesso! Sua credencial foi renovada.');
        navigate('/profile');
      } else {
        alert('Erro ao atualizar: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar cadastro. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Atualizar Cadastro
            </h1>
            <p className="text-gray-600">
              Atualize seus dados e renove sua credencial por mais 4 anos
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-4xl mx-auto">
            <p className="text-sm text-yellow-800 font-semibold mb-2">
              ⚠️ Importante
            </p>
            <p className="text-sm text-yellow-700">
              Ao atualizar seus dados, sua credencial será renovada automaticamente por mais 4 anos. 
              Certifique-se de que todas as informações estão corretas antes de confirmar.
            </p>
          </div>

          <RegistrationForm 
            onSubmit={handleSubmit} 
            initialData={initialData}
            isUpdate={true}
          />
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
