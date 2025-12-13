import React from 'react';
import { getProductionStatusConfig } from '../../utils/productionStatus';
import { FileText, Package, Upload, Factory, CheckCircle, Truck, Gift } from 'lucide-react';

const ICON_MAP = {
  'cadastrado': FileText,
  'em_lote': Package,
  'exportado': Upload,
  'em_producao': Factory,
  'produzido': CheckCircle,
  'enviado': Truck,
  'entregue': Gift
};

const ProductionStatusBadge = ({ status, showIcon = true, size = 'md' }) => {
  const config = getProductionStatusConfig(status);
  const Icon = ICON_MAP[status] || FileText;
  
  const sizes = {
    xs: { text: 'px-1.5 py-0.5 text-[10px]', icon: 'w-2.5 h-2.5' },
    sm: { text: 'px-2 py-1 text-xs', icon: 'w-3 h-3' },
    md: { text: 'px-3 py-1 text-sm', icon: 'w-3.5 h-3.5' },
    lg: { text: 'px-4 py-2 text-base', icon: 'w-4 h-4' }
  };
  
  return (
    <span 
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${config.bgColor} ${config.textColor} ${sizes[size].text}`}
      title={config.description}
    >
      {showIcon && <Icon className={sizes[size].icon} />}
      <span>{config.label}</span>
    </span>
  );
};

export default ProductionStatusBadge;
