import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCapelao } from '../../services/capelaoService';
import { getUserData } from '../../services/auth';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import StatusBadge from '../../components/common/StatusBadge';
import ProductionStatusBadge from '../../components/common/ProductionStatusBadge';
import Button from '../../components/common/Button';
import { getProductionStatusConfig, getProductionProgress } from '../../utils/productionStatus';
import { FileText, Package, Upload, Factory, CheckCircle, Truck, Gift } from 'lucide-react';

const ICON_COMPONENTS = {
  'FileText': FileText,
  'Package': Package,
  'Upload': Upload,
  'Factory': Factory,
  'CheckCircle': CheckCircle,
  'Truck': Truck,
  'Gift': Gift
};
import { formatDate, formatCPF, formatPhone } from '../../utils/formatters';
import { calculateValidityPercentage, getValidityStatus } from '../../utils/dateHelpers';
import { addDataPrefix } from '../../utils/imageHelpers';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [capelaoData, setCapelaoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCapelaoData();
  }, [currentUser]);

  const loadCapelaoData = async () => {
    if (!currentUser) return;

    setLoading(true);
    
    try {
      // Primeiro busca o customId do usuário
      const userDataResult = await getUserData(currentUser.uid);
      
      if (!userDataResult.success || !userDataResult.data.customId) {
        console.error('CustomId não encontrado');
        setCapelaoData(null);
        setLoading(false);
        return;
      }

      // Busca os dados do capelão usando o customId
      const result = await getCapelao(userDataResult.data.customId);
      
      if (result.success) {
        setCapelaoData(result.data);
      } else {
        console.error('Erro ao carregar dados:', result.error);
        setCapelaoData(null);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setCapelaoData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!capelaoData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <p className="text-gray-600">Dados não encontrados</p>
        </Card>
      </div>
    );
  }

  const validityPercentage = calculateValidityPercentage(
    capelaoData.registrationDate,
    capelaoData.expirationDate
  );

  const status = getValidityStatus(capelaoData.expirationDate);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meu Perfil
          </h1>
          <p className="text-gray-600">
            Visualize e atualize suas informações
          </p>
        </div>

        {/* Status da Credencial */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Status da Credencial
              </h2>
              <p className="text-gray-600">
                Validade até {formatDate(capelaoData.expirationDate)}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <StatusBadge expirationDate={capelaoData.expirationDate} size="lg" />
              <ProductionStatusBadge 
                status={capelaoData.productionStatus || 'cadastrado'} 
                size="md" 
              />
            </div>
          </div>

          {/* Status de Produção Detalhado */}
          {(() => {
            const prodConfig = getProductionStatusConfig(capelaoData.productionStatus || 'cadastrado');
            const progress = getProductionProgress(capelaoData.productionStatus || 'cadastrado');
            const IconComponent = ICON_COMPONENTS[prodConfig.icon];
            
            return (
              <div className={`mb-6 p-4 ${prodConfig.bgColor} border ${prodConfig.borderColor} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <IconComponent className={`w-8 h-8 ${prodConfig.textColor}`} />
                  <div className="flex-1">
                    <h3 className={`font-semibold ${prodConfig.textColor}`}>
                      {prodConfig.label}
                    </h3>
                    <p className={`text-sm ${prodConfig.textColor} mt-1`}>
                      {prodConfig.description}
                    </p>
                    {/* Barra de Progresso da Produção */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={prodConfig.textColor}>Progresso da Produção</span>
                        <span className={prodConfig.textColor}>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${prodConfig.color === 'green' ? 'bg-green-600' : `bg-${prodConfig.color}-600`}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <ProgressBar
            percentage={validityPercentage}
            expirationDate={capelaoData.expirationDate}
            height="h-6"
          />

          {status.status === 'expired' || status.status === 'expiring-soon' ? (
            <div className={`mt-6 p-4 ${status.bgColor} border ${status.borderColor} rounded-lg`}>
              <p className={`font-semibold ${status.textColor}`}>
                ⚠️ Ação Necessária
              </p>
              <p className={`text-sm ${status.textColor} mt-1`}>
                {status.status === 'expired'
                  ? 'Sua credencial expirou. Entre em contato com a administração para renovação.'
                  : 'Sua credencial está próxima ao vencimento. Prepare-se para atualizar seus dados.'}
              </p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => navigate('/profile/update')}
              >
                Atualizar Cadastro
              </Button>
            </div>
          ) : null}
        </Card>

        {/* Dados Pessoais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Foto */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Foto 3x4</h3>
            {capelaoData.fotoB64 ? (
              <img
                src={addDataPrefix(capelaoData.fotoB64, capelaoData.fotoMime)}
                alt={capelaoData.nomeCompleto}
                className="w-full h-auto object-cover rounded-lg border-2 border-gray-300"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </Card>

          {/* Informações Principais */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nome Completo</p>
                  <p className="font-semibold">{capelaoData.nomeCompleto}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data de Nascimento</p>
                  <p className="font-semibold">{formatDate(capelaoData.dataNascimento)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Idade</p>
                  <p className="font-semibold">{capelaoData.idade} anos</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="font-semibold">{formatCPF(capelaoData.cpf)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">RG</p>
                  <p className="font-semibold">{capelaoData.rg}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-semibold">{formatPhone(capelaoData.telefone)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{capelaoData.email}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Filiação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nome da Mãe</p>
                  <p className="font-semibold">{capelaoData.nomeMae}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nome do Pai</p>
                  <p className="font-semibold">{capelaoData.nomePai}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Localização */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Localização</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Cidade Natal</p>
                <p className="font-semibold">{capelaoData.cidadeNatal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cidade Atual</p>
                <p className="font-semibold">{capelaoData.cidadeAtual}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Endereço</h3>
            <div className="space-y-2">
              <p className="font-semibold">
                {capelaoData.endereco.rua}, {capelaoData.endereco.numero}
              </p>
              {capelaoData.endereco.complemento && (
                <p className="text-gray-600">{capelaoData.endereco.complemento}</p>
              )}
              <p className="text-gray-600">
                {capelaoData.endereco.bairro}
              </p>
              <p className="text-gray-600">
                CEP: {capelaoData.endereco.cep}
              </p>
            </div>
          </Card>
        </div>

        {/* Botão de Atualização */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/profile/update')}
            className="px-8"
          >
            Atualizar Dados
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
