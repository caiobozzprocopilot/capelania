import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCapeloes } from '../../services/capelaoService';
import { useAuth } from '../../contexts/AuthContext';
import { MessageCircle, Download, FileSpreadsheet, List, Package, CheckSquare, Square, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import ProductionStatusBadge from '../../components/common/ProductionStatusBadge';
import Button from '../../components/common/Button';
import StatsGrid from '../../components/dashboard/StatsGrid';
import ProgressChart from '../../components/dashboard/ProgressChart';
import DonutChart from '../../components/dashboard/DonutChart';
import ExportModal from '../../components/admin/ExportModal';
import ProductionStatusModal from '../../components/admin/ProductionStatusModal';
import { formatDate } from '../../utils/formatters';
import { getValidityStatus } from '../../utils/dateHelpers';
import { addDataPrefix } from '../../utils/imageHelpers';
import { exportToExcelWithPhotos, exportToExcelOnly } from '../../utils/excelExport';
import { updateBatchProductionStatus } from '../../services/capelaoService';
import { PRODUCTION_STATUS } from '../../utils/productionStatus';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [capeloes, setCapeloes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCidade, setFilterCidade] = useState('all');
  const [filterIgreja, setFilterIgreja] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [activeTab, setActiveTab] = useState('lista'); // 'lista' ou 'lotes'
  const [selectedBatches, setSelectedBatches] = useState([]); // IDs dos lotes selecionados

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    try {
      // Busca todos os capelões do Firestore
      const result = await getAllCapeloes();
      
      if (result.success) {
        const capeloesData = result.data;
        setCapeloes(capeloesData);
        
        // Calcula estatísticas
        const stats = {
          total: capeloesData.length,
          active: 0,
          expiringSoon: 0,
          expired: 0
        };
        
        capeloesData.forEach(capelao => {
          const status = getValidityStatus(capelao.expirationDate).status;
          if (status === 'active') stats.active++;
          else if (status === 'warning' || status === 'expiring-soon') stats.expiringSoon++;
          else if (status === 'expired') stats.expired++;
        });
        
        setStats(stats);
      } else {
        console.error('Erro ao carregar capelões:', result.error);
        setCapeloes([]);
        setStats({ total: 0, active: 0, expiringSoon: 0, expired: 0 });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setCapeloes([]);
      setStats({ total: 0, active: 0, expiringSoon: 0, expired: 0 });
    } finally {
      setLoading(false);
    }
  };

  const filteredCapeloes = capeloes.filter(capelao => {
    const matchesSearch = capelao.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capelao.cpf.includes(searchTerm) ||
                         capelao.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || getValidityStatus(capelao.expirationDate).status === filterStatus;
    const matchesCidade = filterCidade === 'all' || capelao.cidadeAtual === filterCidade;
    const matchesIgreja = filterIgreja === 'all' || capelao.igreja === filterIgreja;

    return matchesSearch && matchesStatus && matchesCidade && matchesIgreja;
  });

  // Extrair cidades únicas
  const cidades = ['all', ...new Set(capeloes.map(c => c.cidadeAtual).filter(Boolean))];
  
  // Extrair igrejas únicas
  const igrejas = ['all', ...new Set(capeloes.map(c => c.igreja).filter(Boolean))];

  // Agrupa capelões em lotes de 10
  const getBatches = () => {
    const batches = [];
    const batchSize = 10;
    
    for (let i = 0; i < filteredCapeloes.length; i += batchSize) {
      batches.push({
        id: Math.floor(i / batchSize) + 1,
        startIndex: i,
        endIndex: Math.min(i + batchSize, filteredCapeloes.length),
        capeloes: filteredCapeloes.slice(i, i + batchSize)
      });
    }
    
    return batches;
  };

  const batches = getBatches();

  // Toggle seleção de lote
  const toggleBatchSelection = (batchId) => {
    setSelectedBatches(prev => 
      prev.includes(batchId)
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  // Selecionar todos os lotes
  const selectAllBatches = () => {
    if (selectedBatches.length === batches.length) {
      setSelectedBatches([]);
    } else {
      setSelectedBatches(batches.map(b => b.id));
    }
  };

  // Obter capelões dos lotes selecionados
  const getSelectedCapeloes = () => {
    if (selectedBatches.length === 0) return [];
    
    const selected = [];
    batches.forEach(batch => {
      if (selectedBatches.includes(batch.id)) {
        selected.push(...batch.capeloes);
      }
    });
    
    return selected;
  };

  const handleWhatsApp = (telefone) => {
    // Remove caracteres especiais e espaços
    const cleanPhone = telefone.replace(/[^\d]/g, '');
    // Abre WhatsApp com o número
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  const handleExport = async (exportType) => {
    try {
      let result;
      let capeloesToExport;

      // Define quais capelões exportar
      if (activeTab === 'lotes' && selectedBatches.length > 0) {
        capeloesToExport = getSelectedCapeloes();
      } else {
        capeloesToExport = filteredCapeloes;
      }

      if (capeloesToExport.length === 0) {
        alert('Selecione pelo menos um lote para exportar.');
        return;
      }
      
      if (exportType === 'withPhotos') {
        result = await exportToExcelWithPhotos(capeloesToExport, {
          fileName: 'credenciais_para_grafica',
          includePhotos: true
        });
      } else {
        result = exportToExcelOnly(capeloesToExport, 'capeloes_dados');
      }
      
      if (result.success) {
        // Atualiza status para "exportado" automaticamente
        const capelaoIds = capeloesToExport.map(c => c.id);
        await updateBatchProductionStatus(capelaoIds, PRODUCTION_STATUS.EXPORTADO, 'Dados exportados automaticamente pelo sistema');
        
        setShowExportModal(false);
        alert(`${result.message}\n\nStatus atualizado para "Exportado"`);
        
        // Recarrega dados
        loadData();
      } else {
        alert('Erro ao exportar: ' + result.error);
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
      alert('Erro ao exportar dados.');
    }
  };

  // Atualizar status de produção dos lotes selecionados
  const handleUpdateProductionStatus = async (newStatus, observation) => {
    const capeloesToUpdate = getSelectedCapeloes();
    const capelaoIds = capeloesToUpdate.map(c => c.id);

    const result = await updateBatchProductionStatus(capelaoIds, newStatus, observation);

    if (result.success) {
      alert(result.message);
      loadData(); // Recarrega os dados
    } else {
      alert(`Erro: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">
                Gerenciamento de capelões cadastrados
              </p>
            </div>
            
            {/* Botão de Exportação */}
            <Button
              variant="primary"
              onClick={() => setShowExportModal(true)}
              disabled={filteredCapeloes.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar Dados
              {filteredCapeloes.length > 0 && (
                <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {filteredCapeloes.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Estatísticas Visuais */}
        {stats && (
          <>
            {/* Grid de Estatísticas com Ícones */}
            <StatsGrid stats={stats} />

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Gráfico de Barras - Status */}
              <ProgressChart
                title="Status das Credenciais"
                data={[
                  { 
                    label: 'Ativos', 
                    value: stats.active, 
                    color: 'bg-green-500' 
                  },
                  { 
                    label: 'Vencendo em Breve', 
                    value: stats.expiringSoon, 
                    color: 'bg-yellow-500' 
                  },
                  { 
                    label: 'Expirados', 
                    value: stats.expired, 
                    color: 'bg-red-500' 
                  }
                ]}
              />

              {/* Gráfico de Rosca - Distribuição */}
              <DonutChart
                title="Distribuição por Status"
                data={[
                  { 
                    label: 'Ativos', 
                    value: stats.active, 
                    colorClass: 'fill-green-500',
                    bgColor: 'bg-green-500'
                  },
                  { 
                    label: 'Vencendo', 
                    value: stats.expiringSoon, 
                    colorClass: 'fill-yellow-500',
                    bgColor: 'bg-yellow-500'
                  },
                  { 
                    label: 'Expirados', 
                    value: stats.expired, 
                    colorClass: 'fill-red-500',
                    bgColor: 'bg-red-500'
                  }
                ]}
              />
            </div>
          </>
        )}

        {/* Tabs de Visualização */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('lista')}
                className={`${
                  activeTab === 'lista'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
              >
                <List className="w-4 h-4" />
                Lista Completa
              </button>
              <button
                onClick={() => setActiveTab('lotes')}
                className={`${
                  activeTab === 'lotes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
              >
                <Package className="w-4 h-4" />
                Lotes para Exportação
                {batches.length > 0 && (
                  <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {batches.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="warning">Atenção</option>
                <option value="expiring-soon">Próximo ao Vencimento</option>
                <option value="expired">Expirados</option>
              </select>
            </div>

            <div>
              <select
                value={filterCidade}
                onChange={(e) => setFilterCidade(e.target.value)}
                className="input-field"
              >
                <option value="all">Todas as Cidades</option>
                {cidades.filter(c => c !== 'all').map((cidade, index) => (
                  <option key={index} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterIgreja}
                onChange={(e) => setFilterIgreja(e.target.value)}
                className="input-field"
              >
                <option value="all">Todas as Igrejas</option>
                {igrejas.filter(i => i !== 'all').map((igreja, index) => (
                  <option key={index} value={igreja}>{igreja}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Informação de Filtros Aplicados */}
        {(searchTerm || filterStatus !== 'all' || filterCidade !== 'all' || filterIgreja !== 'all') && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Filtros aplicados:</strong> Exibindo {filteredCapeloes.length} de {capeloes.length} registros
              {searchTerm && ` | Busca: "${searchTerm}"`}
              {filterStatus !== 'all' && ` | Status: ${filterStatus}`}
              {filterCidade !== 'all' && ` | Cidade: ${filterCidade}`}
              {filterIgreja !== 'all' && ` | Igreja: ${filterIgreja}`}
            </p>
          </div>
        )}

        {/* Conteúdo da Tab Ativa */}
        {activeTab === 'lista' ? (
          /* Lista de Capelões */
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Validade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Produção
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCapeloes.map((capelao) => (
                  <tr key={capelao.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {capelao.fotoB64 ? (
                        <img
                          src={addDataPrefix(capelao.fotoB64, capelao.fotoMime)}
                          alt={capelao.nomeCompleto}
                          className="h-12 w-10 object-cover rounded border"
                        />
                      ) : (
                        <div className="h-12 w-10 bg-gray-200 rounded flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {capelao.nomeCompleto}
                      </div>
                      <div className="text-sm text-gray-500">
                        {capelao.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {capelao.cpf}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {capelao.telefone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(capelao.expirationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge expirationDate={capelao.expirationDate} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ProductionStatusBadge 
                        status={capelao.productionStatus || 'cadastrado'} 
                        size="sm" 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleWhatsApp(capelao.telefone)}
                        className="inline-flex items-center justify-center w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors mr-3"
                        title="Contatar via WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/capelao/${capelao.id}`)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCapeloes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum capelão encontrado</p>
              </div>
            )}
          </div>
        </Card>
        ) : (
          /* Visualização de Lotes */
          <div className="space-y-6">
            {/* Cabeçalho dos Lotes */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Gerenciar Lotes de Exportação
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Selecione os lotes que deseja exportar. Cada lote contém até 10 capelães.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={selectAllBatches}
                  className="text-sm flex items-center gap-2"
                >
                  {selectedBatches.length === batches.length ? (
                    <>
                      <Square className="w-4 h-4" />
                      Desmarcar Todos
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-4 h-4" />
                      Selecionar Todos
                    </>
                  )}
                </Button>
              </div>

              {/* Estatísticas de Seleção */}
              {selectedBatches.length > 0 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-100 rounded-full p-2">
                        <FileSpreadsheet className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-900">
                          {selectedBatches.length} lote{selectedBatches.length !== 1 ? 's' : ''} selecionado{selectedBatches.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-primary-700">
                          {getSelectedCapeloes().length} capelã{getSelectedCapeloes().length !== 1 ? 'es' : 'o'} para exportar
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowStatusModal(true)}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Atualizar Status
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => setShowExportModal(true)}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Exportar Selecionados
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Grid de Lotes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batch) => (
                <Card 
                  key={batch.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedBatches.includes(batch.id)
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                  onClick={() => toggleBatchSelection(batch.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                        selectedBatches.includes(batch.id)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {batch.id}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Lote {batch.id}</h4>
                        <p className="text-xs text-gray-500">
                          {batch.capeloes.length} capelã{batch.capeloes.length !== 1 ? 'es' : 'o'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedBatches.includes(batch.id)
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedBatches.includes(batch.id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Lista de Capelães do Lote */}
                  <div className="space-y-2 mt-3 pt-3 border-t border-gray-200">
                    {batch.capeloes.map((capelao, idx) => (
                      <div key={capelao.id} className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-10 flex-shrink-0">
                          {capelao.fotoB64 ? (
                            <img
                              src={addDataPrefix(capelao.fotoB64, capelao.fotoMime)}
                              alt={capelao.nomeCompleto}
                              className="w-full h-full object-cover rounded border"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {idx + 1}. {capelao.nomeCompleto}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {capelao.cidadeAtual} • {capelao.igreja}
                          </p>
                          <div className="mt-1">
                            <ProductionStatusBadge 
                              status={capelao.productionStatus || 'cadastrado'} 
                              size="xs" 
                              showIcon={false}
                            />
                          </div>
                        </div>
                        <StatusBadge expirationDate={capelao.expirationDate} size="xs" />
                      </div>
                    ))}
                  </div>

                  {/* Estatísticas do Lote */}
                  <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 gap-2 text-xs">
                    {(() => {
                      const stats = {
                        active: 0,
                        warning: 0,
                        expired: 0
                      };
                      batch.capeloes.forEach(c => {
                        const status = getValidityStatus(c.expirationDate).status;
                        if (status === 'active') stats.active++;
                        else if (status === 'warning' || status === 'expiring-soon') stats.warning++;
                        else stats.expired++;
                      });
                      return (
                        <>
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{stats.active}</div>
                            <div className="text-gray-500">Ativos</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-yellow-600">{stats.warning}</div>
                            <div className="text-gray-500">Atenção</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-red-600">{stats.expired}</div>
                            <div className="text-gray-500">Expirados</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </Card>
              ))}
            </div>

            {batches.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhum lote disponível. Ajuste os filtros para visualizar capelães.</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Modal de Exportação */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        capeloes={activeTab === 'lotes' && selectedBatches.length > 0 ? getSelectedCapeloes() : filteredCapeloes}
        onExport={handleExport}
      />

      {/* Modal de Atualização de Status de Produção */}
      <ProductionStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        selectedCapeloes={getSelectedCapeloes()}
        onUpdateStatus={handleUpdateProductionStatus}
      />
    </div>
  );
};

export default AdminDashboard;
