// RatingSelector Component: Renders segmented chips for source rating options
// Redesigned with Etoile Palette: #082052 (Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React from 'react';

export const RatingSelector = ({
  label,
  value,
  onSelect,
  options = [],
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
}) => {
  const getChipStyle = (opt, isSelected) => {
    if (!isSelected) {
      return 'bg-white dark:bg-[#082052] text-[#222d3d] dark:text-[#F8F0E5] border-[#e2d5c1] dark:border-[#153675] hover:bg-[#faf6f0] dark:hover:bg-[#0c2a68]';
    }

    const lower = String(opt).toLowerCase();
    if (
      lower.includes('beyond') ||
      lower.includes('proactive') ||
      lower.includes('excellent') ||
      lower.includes('active') ||
      lower.includes('well-maintained') ||
      lower.includes('good') ||
      lower.includes('available') ||
      lower.includes('yes') ||
      lower.includes('followed') ||
      lower.includes('timely') ||
      lower.includes('approved')
    ) {
      return 'bg-[#082052] text-[#F8F0E5] border-[#082052] shadow-xs ring-1 ring-[#C59B27] font-bold';
    }

    if (
      lower.includes('average') ||
      lower.includes('satisfactory') ||
      lower.includes('under process') ||
      lower.includes('smart display') ||
      lower.includes('some extent')
    ) {
      return 'bg-[#153e8a] text-white border-[#153e8a] shadow-xs font-bold';
    }

    // Negative / Deficiency
    return 'bg-rose-700 text-white border-rose-700 shadow-xs font-bold';
  };

  return (
    <div className={`mb-3.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#082052] dark:text-[#F8F0E5] mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <button
              type="button"
              key={option}
              disabled={disabled}
              onClick={() => onSelect(option)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer select-none active:scale-98 ${getChipStyle(
                option,
                isSelected
              )} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-[#5a677a] dark:text-[#d8cebe]">{helperText}</p>
      ) : null}
    </div>
  );
};

export default RatingSelector;
