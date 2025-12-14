import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';

/**
 * Cria a imagem cortada
 */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Gera a imagem cortada em base64
 */
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        // Remove o prefixo data:image/...;base64,
        const base64 = base64data.split(',')[1];
        const mimeType = base64data.split(';')[0].split(':')[1];
        resolve({ base64, mimeType });
      };
    }, 'image/jpeg', 0.95);
  });
}

export default function ImageCropModal({ isOpen, onClose, imageSrc, onCropComplete, aspectRatio = 3/4 }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setProcessing(true);
      const { base64, mimeType } = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete(base64, mimeType);
      onClose();
    } catch (error) {
      console.error('Erro ao cortar imagem:', error);
      alert('Erro ao processar a imagem. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajustar Foto" maxWidth="max-w-3xl">
      <div className="space-y-4">
        {/* Área de Crop */}
        <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteCallback}
              objectFit="contain"
            />
          )}
        </div>

        {/* Controles de Zoom */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ZoomOut className="w-5 h-5 text-gray-500" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <ZoomIn className="w-5 h-5 text-gray-500" />
          </div>

          {/* Controle de Rotação */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Rotação: {rotation}°</span>
            <Button
              variant="outline"
              size="sm"
              icon={RotateCw}
              onClick={handleRotate}
            >
              Girar 90°
            </Button>
          </div>
        </div>

        {/* Dica */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 <strong>Dica:</strong> Use os dedos para fazer pinch-to-zoom no celular, ou arraste a imagem para posicionar.
          </p>
        </div>

        {/* Botões */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={processing}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            icon={Check}
            onClick={handleSave}
            disabled={processing}
          >
            {processing ? 'Processando...' : 'Aplicar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
