import { useState, useEffect } from 'react';
import { Download, CreditCard, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { generateFullCredential, downloadCredential } from '../../services/credentialService';

export default function CredentialViewer({ capelao, isOpen, onClose }) {
  const [credentialImages, setCredentialImages] = useState({ front: null, back: null });
  const [loading, setLoading] = useState(true);
  const [showFront, setShowFront] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && capelao) {
      generateCredentials();
    }
  }, [isOpen, capelao]);

  const generateCredentials = async () => {
    try {
      setLoading(true);
      setError(null);

      const { front, back } = await generateFullCredential(capelao);

      // Converter blobs para URLs
      const frontUrl = URL.createObjectURL(front);
      const backUrl = URL.createObjectURL(back);

      setCredentialImages({ front: frontUrl, back: backUrl });
    } catch (err) {
      console.error('Erro ao gerar credencial:', err);
      setError('Erro ao gerar credencial. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadCredential(capelao);
    } catch (err) {
      console.error('Erro ao baixar credencial:', err);
      alert('Erro ao baixar credencial. Tente novamente.');
    }
  };

  const handleClose = () => {
    // Limpar URLs ao fechar
    if (credentialImages.front) URL.revokeObjectURL(credentialImages.front);
    if (credentialImages.back) URL.revokeObjectURL(credentialImages.back);
    setCredentialImages({ front: null, back: null });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Minha Credencial Ministerial"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Área de visualização */}
        <div className="bg-gray-50 rounded-lg p-6 min-h-[500px] flex items-center justify-center">
          {loading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Gerando sua credencial...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="w-full">
              <img
                src={showFront ? credentialImages.front : credentialImages.back}
                alt={showFront ? 'Frente da Credencial' : 'Verso da Credencial'}
                className="w-full h-auto max-w-3xl mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Controles */}
        {!loading && !error && (
          <div className="flex items-center justify-between">
            {/* Toggle Frente/Verso */}
            <div className="flex gap-2">
              <Button
                variant={showFront ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowFront(true)}
              >
                Frente
              </Button>
              <Button
                variant={!showFront ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowFront(false)}
              >
                Verso
              </Button>
            </div>

            {/* Botão de Download */}
            <Button
              variant="success"
              onClick={handleDownload}
              icon={Download}
            >
              Baixar Credencial
            </Button>
          </div>
        )}

        {/* Informações */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>📋 Instruções:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
            <li>• Use os botões "Frente" e "Verso" para visualizar ambos os lados</li>
            <li>• Clique em "Baixar Credencial" para salvar as imagens no seu dispositivo</li>
            <li>• Imprima em papel fotográfico ou plastifique para melhor durabilidade</li>
            <li>• Esta credencial tem validade internacional conforme Art. 5º, VII da Constituição Federal</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
