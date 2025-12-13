import React from 'react';
import { getValidityStatus } from '../../utils/dateHelpers';

const ProgressBar = ({ 
  percentage, 
  expirationDate,
  showLabel = true,
  height = 'h-4'
}) => {
  const status = getValidityStatus(expirationDate);
  
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };
  
  const bgColorClass = colorClasses[status.color] || 'bg-green-500';
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Validade</span>
          <span className={`text-sm font-semibold ${status.textColor}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${bgColorClass} ${height} rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        >
          {percentage > 15 && (
            <span className="text-xs text-white font-semibold">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
