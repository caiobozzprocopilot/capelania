import React from 'react';
import { getValidityStatus, formatTimeRemaining } from '../../utils/dateHelpers';

const StatusBadge = ({ expirationDate, size = 'md' }) => {
  const status = getValidityStatus(expirationDate);
  const timeRemaining = formatTimeRemaining(expirationDate);
  
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center justify-center font-semibold rounded-full ${status.bgColor} ${status.textColor} ${sizes[size]}`}>
        {status.label}
      </span>
      {size !== 'sm' && size !== 'xs' && (
        <span className="text-xs text-gray-600 text-center">{timeRemaining}</span>
      )}
    </div>
  );
};

export default StatusBadge;
