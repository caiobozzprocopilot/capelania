import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { PRODUCTION_STATUS, PRODUCTION_STATUS_CONFIG } from '../../utils/productionStatus';
import { Package, AlertCircle, FileText, Upload, Factory, CheckCircle, Truck, Gift } from 'lucide-react';

const ICON_COMPONENTS = {
  'FileText': FileText,
  'Package': Package,
  'Upload': Upload,
  'Factory': Factory,
  'CheckCircle': CheckCircle,
  'Truck': Truck,
  'Gift': Gift
};

const ProductionStatusModal = ({ isOpen, onClose, selectedCapeloes, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedStatus) {
      alert('Selecione um status');
      return;
    }

    setLoading(true);
    try {
      await onUpdateStatus(selectedStatus, observation);
      setSelectedStatus('');
      setObservation('');
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus('');
    setObservation('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Atualizar Status de Produção">
      <div className="space-y-6">
        {/* Informação dos selecionados */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">
                {selectedCapeloes.length} capelã{selectedCapeloes.length !== 1 ? 'es' : 'o'} selecionado{selectedCapeloes.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                O status será atualizado para todos os capelães selecionados
              </p>
            </div>
          </div>
        </div>

        {/* Seleção de Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Novo Status <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field"
            disabled={loading}
          >
            <option value="">Selecione o status...</option>
            {Object.entries(PRODUCTION_STATUS).map(([key, value]) => {
              const config = PRODUCTION_STATUS_CONFIG[value];
              return (
                <option key={value} value={value}>
                  {config.label} - {config.description}
                </option>
              );
            })}
          </select>
        </div>

        {/* Observação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observação (Opcional)
          </label>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Ex: Lote enviado para Gráfica XYZ, previsão de entrega: 20/12/2025"
            rows={3}
            className="input-field resize-none"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Esta observação será registrada no histórico
          </p>
        </div>

        {/* Preview do Status Selecionado */}
        {selectedStatus && (() => {
          const IconComponent = ICON_COMPONENTS[PRODUCTION_STATUS_CONFIG[selectedStatus].icon];
          return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold ${PRODUCTION_STATUS_CONFIG[selectedStatus].bgColor} ${PRODUCTION_STATUS_CONFIG[selectedStatus].textColor}`}>
                  <IconComponent className="w-4 h-4" />
                  {PRODUCTION_STATUS_CONFIG[selectedStatus].label}
                </span>
              </div>
            </div>
          );
        })()}

        {/* Aviso */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800">
              Esta ação não pode ser desfeita. O histórico de status será mantido para auditoria.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !selectedStatus}
            className="flex-1"
          >
            {loading ? 'Atualizando...' : 'Atualizar Status'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductionStatusModal;
