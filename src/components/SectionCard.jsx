// Collapsible Section Card with Title, Score Badge, and Action Support
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const SectionCard = ({
  title,
  subtitle,
  stepNumber,
  scoreBadge,
  children,
  defaultExpanded = true,
  collapsible = true,
  className = '',
  actionButton = null,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white dark:bg-[#082052] rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs overflow-hidden mb-4 transition-all ${className}`}>
      {/* Header */}
      <div
        onClick={() => collapsible && setExpanded(!expanded)}
        className={`px-4 py-3 bg-[#f8f0e5] dark:bg-[#041029] border-b border-[#e2d5c1] dark:border-[#153675] flex items-center justify-between ${
          collapsible ? 'cursor-pointer hover:bg-[#ede0ce] dark:hover:bg-[#0a2046]' : ''
        }`}
      >
        <div className="flex items-center space-x-3">
          {stepNumber !== undefined && (
            <span className="w-7 h-7 rounded-lg bg-[#082052] text-[#F8F0E5] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs border border-[#C59B27]/50 font-mono">
              {stepNumber}
            </span>
          )}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#082052] dark:text-[#F8F0E5] tracking-tight leading-snug">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#5a677a] dark:text-[#d8cebe] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {scoreBadge && (
            <div className="bg-[#edf3fa] dark:bg-[#041029] border border-[#c0d4ed] dark:border-[#153675] text-[#082052] dark:text-[#F8F0E5] px-2.5 py-0.5 rounded text-xs font-semibold tabular-nums font-mono">
              {scoreBadge}
            </div>
          )}
          {actionButton && (
            <div onClick={(e) => e.stopPropagation()}>
              {actionButton}
            </div>
          )}
          {collapsible && (
            <button className="text-[#5a677a] hover:text-[#082052] dark:hover:text-[#F8F0E5] p-1">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="p-4 sm:p-5">
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionCard;
