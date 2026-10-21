// Dashboard Metric Summary Card
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React from 'react';

export const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'navy',
  onClick = null,
  badgeText = null,
}) => {
  const getIconStyle = () => {
    switch (color) {
      case 'cyan':
      case 'gold':
        return 'bg-[#faf3df] text-[#C59B27] dark:bg-[#C59B27]/20 dark:text-[#C59B27]';
      case 'amber':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300';
      case 'rose':
        return 'bg-rose-50 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300';
      case 'navy':
      default:
        return 'bg-[#edf3fa] text-[#082052] dark:bg-[#041029] dark:text-[#F8F0E5]';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl bg-white dark:bg-[#082052] border border-[#e2d5c1] dark:border-[#153675] shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-[#082052]/50 hover:shadow-sm dark:hover:border-[#C59B27]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-[#5a677a] dark:text-[#d8cebe] uppercase tracking-wider truncate">
          {title}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconStyle()}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#082052] dark:text-[#F8F0E5] tracking-tight tabular-nums font-mono">
          {value}
        </span>
        {badgeText && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f1e7d8] dark:bg-[#041029] text-[#082052] dark:text-[#C59B27] border border-[#e2d5c1] dark:border-[#153675]">
            {badgeText}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-1.5 flex items-center justify-between text-xs text-[#5a677a] dark:text-[#d8cebe]">
          <span className="truncate">{subtitle}</span>
          {trend && <span className="font-semibold text-[#082052] dark:text-[#C59B27] shrink-0 ml-1">{trend}</span>}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
