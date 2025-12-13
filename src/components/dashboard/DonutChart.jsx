import React from 'react';

const DonutChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calcula os ângulos para o gráfico de rosca
  let currentAngle = 0;
  const segments = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const segment = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      
      <div className="flex items-center justify-center mb-6">
        {/* Gráfico de Rosca Simplificado */}
        <div className="relative w-48 h-48">
          {/* Círculo externo */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {segments.map((segment, index) => {
              const radius = 40;
              const innerRadius = 25;
              const startAngle = (segment.startAngle * Math.PI) / 180;
              const endAngle = (segment.endAngle * Math.PI) / 180;
              
              const x1 = 50 + radius * Math.cos(startAngle);
              const y1 = 50 + radius * Math.sin(startAngle);
              const x2 = 50 + radius * Math.cos(endAngle);
              const y2 = 50 + radius * Math.sin(endAngle);
              
              const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={pathData}
                  className={segment.colorClass}
                  strokeWidth="0"
                />
              );
            })}
            {/* Círculo branco central */}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          
          {/* Total no centro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{total}</span>
            <span className="text-xs text-gray-600">Total</span>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="space-y-2">
        {segments.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.bgColor}`}></div>
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{item.value}</span>
              <span className="text-xs text-gray-500">({item.percentage.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
