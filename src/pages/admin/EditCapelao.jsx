import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCapelao, updateCapelao } from '../../services/capelaoService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import RegistrationForm from '../../components/forms/RegistrationForm';

const EditCapelao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [capelao, setCapelao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }
    loadCapelao();
  }, [id]);

  const loadCapelao = async () => {
    setLoading(true);
    
    try {
      const result = await getCapelao(id);
      
      if (result.success) {
        setCapelao(result.data);
      } else {
        console.error('Erro ao carregar capelão:', result.error);
        setCapelao(null);
      }
    } catch (error) {
      console.error('Erro ao buscar capelão:', error);
      setCapelao(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const result = await updateCapelao(id, formData);
      
      if (result.success) {
        alert('Perfil atualizado com sucesso!');
        navigate('/admin');
      } else {
        alert('Erro ao atualizar perfil: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!capelao) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Capelão não encontrado
          </h1>
          <Button onClick={() => navigate('/admin')}>
            Voltar ao Painel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Editar Perfil do Capelão
            </h1>
            <p className="text-gray-600">
              Atualize as informações de {capelao.nomeCompleto}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            Voltar ao Painel
          </Button>
        </div>

        {/* Formulário */}
        <Card>
          <RegistrationForm
            initialData={capelao}
            onSubmit={handleSubmit}
            submitButtonText="Salvar Alterações"
            isUpdate={true}
          />
        </Card>
      </div>
    </div>
  );
};

export default EditCapelao;
