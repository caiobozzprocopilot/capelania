import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Download, FileSpreadsheet, Package } from 'lucide-react';

const ExportModal = ({ isOpen, onClose, capeloes, onExport }) => {
  const [exportType, setExportType] = useState('withPhotos');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    await onExport(exportType);
    setExporting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exportar Dados para Gráfica">
      <div className="space-y-6">
        {/* Informação */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Total de registros selecionados:</strong> {capeloes.length}
          </p>
        </div>

        {/* Opções de Exportação */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Escolha o formato:</h3>

          {/* Opção 1: ZIP com Excel + Fotos */}
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="exportType"
              value="withPhotos"
              checked={exportType === 'withPhotos'}
              onChange={(e) => setExportType(e.target.value)}
              className="mt-1 mr-3"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-gray-900">
                  ZIP com Excel + Fotos
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Recomendado
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Arquivo ZIP contendo Excel com os dados e pasta com todas as fotos em JPG.
                Formato ideal para gráficas.
              </p>
              <div className="mt-2 text-xs text-gray-500">
                <strong>Inclui:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>credenciais_para_grafica.xlsx</li>
                  <li>Pasta "fotos/" com {capeloes.filter(c => c.fotoB64).length} imagens JPG</li>
                </ul>
              </div>
            </div>
          </label>

          {/* Opção 2: Apenas Excel */}
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="exportType"
              value="excelOnly"
              checked={exportType === 'excelOnly'}
              onChange={(e) => setExportType(e.target.value)}
              className="mt-1 mr-3"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">
                  Apenas Excel (sem fotos)
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Apenas a planilha Excel com os dados dos capelões.
                Útil para relatórios e análises.
              </p>
              <div className="mt-2 text-xs text-gray-500">
                <strong>Inclui:</strong> Apenas arquivo Excel com dados tabulados
              </div>
            </div>
          </label>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 font-semibold mb-2">
            📋 Dados incluídos na exportação:
          </p>
          <ul className="text-xs text-yellow-700 list-disc list-inside space-y-1">
            <li>Nome completo, CPF, RG</li>
            <li>Data de nascimento e idade</li>
            <li>Nome dos pais</li>
            <li>Cargo eclesiástico e igreja</li>
            <li>Cidades (natal e atual)</li>
            <li>Endereço completo</li>
            <li>Contatos (telefone e email)</li>
            <li>Data de validade da credencial</li>
            {exportType === 'withPhotos' && <li>Fotos 3x4 em formato JPG</li>}
          </ul>
        </div>

        {/* Botões */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={exporting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            loading={exporting}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exportando...' : 'Exportar Agora'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
