// Select Dropdown Input with Search & Filter
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React from 'react';

export const SelectInput = ({
  label,
  value,
  onSelect,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`mb-3.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#082052] dark:text-[#F8F0E5] mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <select
        value={value || ''}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className={`w-full rounded-lg text-sm px-3 py-2 border bg-white dark:bg-[#082052] text-[#222d3d] dark:text-[#F8F0E5] transition-colors ${
          error
            ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
            : 'border-[#e2d5c1] dark:border-[#153675] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none'
        } ${disabled ? 'bg-[#f8f0e5] dark:bg-[#041029] cursor-not-allowed text-[#7f8c9f]' : ''}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>

      {error ? (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-[#5a677a] dark:text-[#d8cebe]">{helperText}</p>
      ) : null}
    </div>
  );
};

export default SelectInput;
