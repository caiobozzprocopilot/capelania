import React from 'react';

const ProgressChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      
      {/* Gráfico de Barras */}
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 15 && (
                    <span className="text-xs text-white font-semibold flex items-center justify-end pr-2 h-full">
                      {percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-700">Total</span>
          <span className="text-lg font-bold text-primary-600">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
