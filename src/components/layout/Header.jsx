import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, userData, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate(isAdmin() ? '/admin' : '/dashboard')}
              className="text-2xl font-bold text-primary-600 hover:text-primary-700"
            >
              Sistema de Capelania
            </button>
          </div>

          {/* Navigation */}
          {currentUser && (
            <div className="flex items-center gap-6">
              {!isAdmin() && (
                <button
                  onClick={() => navigate('/profile')}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Meu Perfil
                </button>
              )}

              <div className="flex items-center gap-3 border-l pl-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {userData?.nomeCompleto || currentUser.email}
                  </p>
                  <p className="text-xs text-gray-600">
                    {isAdmin() ? 'Administrador' : 'Capelão'}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="text-sm"
                >
                  Sair
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
