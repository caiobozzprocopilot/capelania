import React from 'react';
import { Users, UserCheck, AlertTriangle, UserX, TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  const lightColorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(trend)}% vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${lightColorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const StatsGrid = ({ stats }) => {
  const statCards = [
    {
      icon: Users,
      title: 'Total de Capelães',
      value: stats.total,
      color: 'blue',
      subtitle: 'Cadastrados no sistema',
    },
    {
      icon: UserCheck,
      title: 'Ativos',
      value: stats.active,
      color: 'green',
      subtitle: 'Com credencial válida',
    },
    {
      icon: AlertTriangle,
      title: 'Vencendo em Breve',
      value: stats.expiringSoon,
      color: 'yellow',
      subtitle: 'Menos de 6 meses',
    },
    {
      icon: UserX,
      title: 'Expirados',
      value: stats.expired,
      color: 'red',
      subtitle: 'Renovação necessária',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
