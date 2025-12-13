import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import ImageUpload from '../common/ImageUpload';
import Card from '../common/Card';
import { 
  validateCPF, 
  validateEmail, 
  validatePhone, 
  validateFullName, 
  validateAge,
  validateCEP 
} from '../../utils/validators';
import { 
  formatCPF, 
  formatPhone, 
  formatCEP, 
  formatRG,
  formatDateForInput 
} from '../../utils/formatters';
import { calculateAge } from '../../utils/dateHelpers';

const RegistrationForm = ({ onSubmit, initialData = null, isUpdate = false, isEditing = false }) => {
  const [formData, setFormData] = useState({
    nomeCompleto: initialData?.nomeCompleto || '',
    dataNascimento: initialData?.dataNascimento || '',
    nomeMae: initialData?.nomeMae || '',
    nomePai: initialData?.nomePai || '',
    cpf: initialData?.cpf || '',
    rg: initialData?.rg || '',
    cargoEclesiastico: initialData?.cargoEclesiastico || '',
    igreja: initialData?.igreja || '',
    cidadeNatal: initialData?.cidadeNatal || '',
    cidadeAtual: initialData?.cidadeAtual || '',
    endereco: {
      rua: initialData?.endereco?.rua || '',
      numero: initialData?.endereco?.numero || '',
      complemento: initialData?.endereco?.complemento || '',
      bairro: initialData?.endereco?.bairro || '',
      cep: initialData?.endereco?.cep || '',
    },
    telefone: initialData?.telefone || '',
    email: initialData?.email || '',
    senha: '',
    confirmarSenha: '',
    fotoB64: initialData?.fotoB64 || null,
    fotoMime: initialData?.fotoMime || 'image/jpeg',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatação automática
    let formattedValue = value;
    
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    } else if (name === 'rg') {
      formattedValue = formatRG(value);
    } else if (name.startsWith('endereco.')) {
      const field = name.split('.')[1];
      if (field === 'cep') {
        formattedValue = formatCEP(value);
      }
    }
    
    // Atualiza estado
    if (name.startsWith('endereco.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [field]: formattedValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
    
    // Limpa erro do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (base64, mimeType) => {
    setFormData(prev => ({
      ...prev,
      fotoB64: base64,
      fotoMime: mimeType
    }));
    
    if (errors.foto) {
      setErrors(prev => ({
        ...prev,
        foto: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Nome completo
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    } else if (!validateFullName(formData.nomeCompleto)) {
      newErrors.nomeCompleto = 'Digite o nome completo (nome e sobrenome)';
    }

    // Data de nascimento
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else if (!validateAge(formData.dataNascimento, 18)) {
      newErrors.dataNascimento = 'É necessário ter no mínimo 18 anos';
    }

    // Nome da mãe
    if (!formData.nomeMae.trim()) {
      newErrors.nomeMae = 'Nome da mãe é obrigatório';
    }

    // Nome do pai
    if (!formData.nomePai.trim()) {
      newErrors.nomePai = 'Nome do pai é obrigatório';
    }

    // CPF
    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    // RG
    if (!formData.rg) {
      newErrors.rg = 'RG é obrigatório';
    }

    // Cargo eclesiástico
    if (!formData.cargoEclesiastico.trim()) {
      newErrors.cargoEclesiastico = 'Cargo eclesiástico é obrigatório';
    }

    // Igreja
    if (!formData.igreja.trim()) {
      newErrors.igreja = 'Igreja é obrigatória';
    }

    // Cidade natal
    if (!formData.cidadeNatal.trim()) {
      newErrors.cidadeNatal = 'Cidade natal é obrigatória';
    }

    // Cidade atual
    if (!formData.cidadeAtual.trim()) {
      newErrors.cidadeAtual = 'Cidade atual é obrigatória';
    }

    // Endereço
    if (!formData.endereco.rua.trim()) {
      newErrors['endereco.rua'] = 'Rua é obrigatória';
    }
    if (!formData.endereco.numero.trim()) {
      newErrors['endereco.numero'] = 'Número é obrigatório';
    }
    if (!formData.endereco.bairro.trim()) {
      newErrors['endereco.bairro'] = 'Bairro é obrigatório';
    }
    if (!formData.endereco.cep) {
      newErrors['endereco.cep'] = 'CEP é obrigatório';
    } else if (!validateCEP(formData.endereco.cep)) {
      newErrors['endereco.cep'] = 'CEP inválido';
    }

    // Telefone
    if (!formData.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Senha (apenas para novos cadastros)
    if (!isUpdate) {
      if (!formData.senha) {
        newErrors.senha = 'Senha é obrigatória';
      } else if (formData.senha.length < 6) {
        newErrors.senha = 'A senha deve ter no mínimo 6 caracteres';
      }

      if (!formData.confirmarSenha) {
        newErrors.confirmarSenha = 'Confirme sua senha';
      } else if (formData.senha !== formData.confirmarSenha) {
        newErrors.confirmarSenha = 'As senhas não coincidem';
      }
    }

    // Foto
    if (!isUpdate && !formData.fotoB64) {
      newErrors.foto = 'Foto 3x4 é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const idade = calculateAge(formData.dataNascimento);
      const dataToSubmit = {
        ...formData,
        idade,
        cpf: formData.cpf.replace(/[^\d]/g, ''),
        telefone: formData.telefone.replace(/[^\d]/g, ''),
        endereco: {
          ...formData.endereco,
          cep: formData.endereco.cep.replace(/[^\d]/g, '')
        }
      };

      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <Card title={isUpdate ? "Atualizar Cadastro" : "Cadastro de Capelão"} className="mb-6">
        
        {/* Dados Pessoais */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Dados Pessoais
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Nome Completo"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleChange}
                error={errors.nomeCompleto}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <Input
              label="Data de Nascimento"
              name="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={handleChange}
              error={errors.dataNascimento}
              max={formatDateForInput(new Date())}
              required
            />

            <div className="flex items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade
                </label>
                <div className="input-field bg-gray-50">
                  {formData.dataNascimento ? calculateAge(formData.dataNascimento) : '-'} anos
                </div>
              </div>
            </div>

            <Input
              label="Nome da Mãe"
              name="nomeMae"
              value={formData.nomeMae}
              onChange={handleChange}
              error={errors.nomeMae}
              placeholder="Digite o nome completo da mãe"
              required
            />

            <Input
              label="Nome do Pai"
              name="nomePai"
              value={formData.nomePai}
              onChange={handleChange}
              error={errors.nomePai}
              placeholder="Digite o nome completo do pai"
              required
            />

            <Input
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              error={errors.cpf}
              placeholder="123.321.123-12"
              maxLength={14}
              required
            />

            <Input
              label="RG"
              name="rg"
              value={formData.rg}
              onChange={handleChange}
              error={errors.rg}
              placeholder="12.321.432-01"
              maxLength={13}
              required
            />
          </div>
        </div>

        {/* Informações Eclesiásticas */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Informações Eclesiásticas
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo Eclesiástico
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="cargoEclesiastico"
                value={formData.cargoEclesiastico}
                onChange={handleChange}
                className={`input-field ${errors.cargoEclesiastico ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              >
                <option value="">Selecione o cargo</option>
                <option value="membro">Membro</option>
                <option value="cooperador">Cooperador</option>
                <option value="diacono">Diácono</option>
                <option value="presbitero">Presbítero</option>
                <option value="evangelista">Evangelista</option>
                <option value="pastor">Pastor</option>
              </select>
              {errors.cargoEclesiastico && (
                <p className="mt-1 text-sm text-red-600">{errors.cargoEclesiastico}</p>
              )}
            </div>

            <Input
              label="Igreja"
              name="igreja"
              value={formData.igreja}
              onChange={handleChange}
              error={errors.igreja}
              placeholder="Nome completo da congregação"
              required
            />
          </div>
        </div>

        {/* Localização */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Localização
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Cidade Natal"
              name="cidadeNatal"
              value={formData.cidadeNatal}
              onChange={handleChange}
              error={errors.cidadeNatal}
              placeholder="Cidade onde nasceu"
              required
            />

            <Input
              label="Cidade Atual"
              name="cidadeAtual"
              value={formData.cidadeAtual}
              onChange={handleChange}
              error={errors.cidadeAtual}
              placeholder="Cidade onde reside atualmente"
              required
            />
          </div>
        </div>

        {/* Informação sobre Credencial */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Credencial
          </h4>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h5 className="font-semibold text-blue-900 mb-1">Validade Automática</h5>
                <p className="text-sm text-blue-800">
                  Sua credencial será válida por <strong>4 anos</strong> a partir da data de cadastro.
                  A data de expiração será calculada automaticamente pelo sistema.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Endereço
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <Input
                label="Rua/Avenida"
                name="endereco.rua"
                value={formData.endereco.rua}
                onChange={handleChange}
                error={errors['endereco.rua']}
                placeholder="Nome da rua ou avenida"
                required
              />
            </div>

            <Input
              label="Número"
              name="endereco.numero"
              value={formData.endereco.numero}
              onChange={handleChange}
              error={errors['endereco.numero']}
              placeholder="Nº"
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Complemento"
                name="endereco.complemento"
                value={formData.endereco.complemento}
                onChange={handleChange}
                placeholder="Apto, bloco, etc. (opcional)"
              />
            </div>

            <Input
              label="Bairro"
              name="endereco.bairro"
              value={formData.endereco.bairro}
              onChange={handleChange}
              error={errors['endereco.bairro']}
              placeholder="Nome do bairro"
              required
            />

            <Input
              label="CEP"
              name="endereco.cep"
              value={formData.endereco.cep}
              onChange={handleChange}
              error={errors['endereco.cep']}
              placeholder="00000-000"
              maxLength={9}
              required
            />
          </div>
        </div>

        {/* Contato */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Contato
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              error={errors.telefone}
              placeholder="(00) 00000-0000"
              maxLength={15}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        {/* Senha - Apenas para novos cadastros */}
        {!isUpdate && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Senha de Acesso
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                error={errors.senha}
                placeholder="Mínimo 6 caracteres"
                required
              />

              <Input
                label="Confirmar Senha"
                name="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={handleChange}
                error={errors.confirmarSenha}
                placeholder="Digite a senha novamente"
                required
              />
            </div>

            <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <p className="font-medium mb-1">Requisitos da senha:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mínimo de 6 caracteres</li>
                <li>Recomendamos usar letras, números e símbolos para maior segurança</li>
              </ul>
            </div>
          </div>
        )}

        {/* Foto */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Foto 3x4
          </h4>
          
          <ImageUpload
            value={formData.fotoB64}
            onChange={handleImageChange}
            error={errors.foto}
            required={!isUpdate}
          />
        </div>

        {/* Botões */}
        <div className="flex gap-4 justify-end pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {isUpdate ? 'Atualizar Cadastro' : 'Cadastrar'}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default RegistrationForm;
