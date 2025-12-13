import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, getUserData } from '../../services/auth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        // Busca dados do usuário para verificar se é admin
        const userDataResult = await getUserData(result.user.uid);
        
        if (userDataResult.success && userDataResult.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Sistema de Capelania
          </h1>
          <p className="text-primary-100">
            Modo Teste - Acesso Simplificado
          </p>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Entrar no Sistema
          </h2>

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              required
            />

            <Input
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
            />

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Entrar
            </Button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Não tem cadastro? Cadastre-se aqui
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
