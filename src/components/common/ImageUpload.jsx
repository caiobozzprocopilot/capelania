import React, { useState, useRef } from 'react';
import { validateImageFile } from '../../utils/validators';
import { compressImageFile, stripDataPrefix, addDataPrefix } from '../../utils/imageHelpers';

const ImageUpload = ({ 
  label = 'Foto 3x4',
  value,
  onChange,
  error,
  required = false
}) => {
  const [preview, setPreview] = useState(value ? addDataPrefix(value) : null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setLocalError('');

    try {
      // Valida tipo e tamanho
      const fileValidation = validateImageFile(file);
      if (!fileValidation.valid) {
        setLocalError(fileValidation.error);
        setUploading(false);
        return;
      }

      // Comprime a imagem
      const { dataUrl } = await compressImageFile(file, 800, 0.8);
      const base64 = stripDataPrefix(dataUrl);
      
      // Valida tamanho final
      if (base64.length > 950000) {
        setLocalError('A imagem ficou muito grande. Tente tirar mais perto ou com menor resolução.');
        setUploading(false);
        return;
      }

      // Atualiza preview e chama onChange com base64 puro
      setPreview(dataUrl);
      onChange(base64, 'image/jpeg');
      setUploading(false);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      setLocalError('Não foi possível processar a imagem.');
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setLocalError('');
    onChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = error || localError;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="flex-shrink-0">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-40 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-32 h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors ${
              uploading ? 'opacity-50 cursor-wait' : ''
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {uploading ? 'Processando...' : preview ? 'Alterar Foto' : 'Selecionar Foto'}
          </label>

          <div className="mt-2 text-xs text-gray-500">
            <p>• Formato: JPG ou PNG</p>
            <p>• Tamanho máximo: 2MB</p>
            <p>• Proporção: 3x4 (foto 3x4)</p>
          </div>
        </div>
      </div>

      {displayError && (
        <p className="mt-2 text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
};

export default ImageUpload;
