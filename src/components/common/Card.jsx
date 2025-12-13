import React from 'react';

const Card = ({ 
  children, 
  title,
  subtitle,
  className = '',
  padding = true,
  hover = false
}) => {
  const hoverClass = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';
  const paddingClass = padding ? 'p-6' : '';
  
  return (
    <div className={`card ${hoverClass} ${paddingClass} ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
