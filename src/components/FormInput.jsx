// Text & Standard Form Input with Validation Messages & Helper Text
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React from 'react';

export const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  required = false,
  multiline = false,
  rows = 3,
  type = 'text',
  disabled = false,
  icon: Icon = null,
  className = '',
}) => {
  return (
    <div className={`mb-3.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#082052] dark:text-[#F8F0E5] mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5a677a]">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {multiline ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={`w-full rounded-lg text-sm px-3 py-2 border transition-colors bg-white dark:bg-[#082052] text-[#222d3d] dark:text-[#F8F0E5] placeholder:text-[#7f8c9f] ${
              Icon ? 'pl-9' : ''
            } ${
              error
                ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                : 'border-[#e2d5c1] dark:border-[#153675] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none'
            } ${disabled ? 'bg-[#f8f0e5] dark:bg-[#041029] cursor-not-allowed text-[#7f8c9f]' : ''}`}
          />
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full rounded-lg text-sm px-3 py-2 border transition-colors bg-white dark:bg-[#082052] text-[#222d3d] dark:text-[#F8F0E5] placeholder:text-[#7f8c9f] ${
              Icon ? 'pl-9' : ''
            } ${
              error
                ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                : 'border-[#e2d5c1] dark:border-[#153675] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none'
            } ${disabled ? 'bg-[#f8f0e5] dark:bg-[#041029] cursor-not-allowed text-[#7f8c9f]' : ''}`}
          />
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-[#5a677a] dark:text-[#d8cebe]">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormInput;
