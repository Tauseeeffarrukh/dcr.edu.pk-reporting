// Numeric Input with +/- Steppers & Range Enforcement
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React from 'react';
import { Plus, Minus } from 'lucide-react';

export const NumericInput = ({
  label,
  value,
  onChangeValue,
  min = 0,
  max = 9999,
  step = 1,
  unit = '',
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
}) => {
  const currentVal = value === '' || value === null || value === undefined ? '' : Number(value);

  const handleIncrement = () => {
    if (disabled) return;
    const num = currentVal === '' ? min : currentVal;
    const next = Math.min(max, num + step);
    onChangeValue(next);
  };

  const handleDecrement = () => {
    if (disabled) return;
    const num = currentVal === '' ? min : currentVal;
    const next = Math.max(min, num - step);
    onChangeValue(next);
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      onChangeValue('');
      return;
    }
    const num = Number(raw);
    if (!isNaN(num)) {
      onChangeValue(Math.max(min, Math.min(max, num)));
    }
  };

  return (
    <div className={`mb-3.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#082052] dark:text-[#F8F0E5] mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="flex items-center space-x-1.5">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || (currentVal !== '' && currentVal <= min)}
          className="w-9 h-9 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5] flex items-center justify-center hover:bg-[#ede0ce] dark:hover:bg-[#0c2a68] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="relative flex-1">
          <input
            type="number"
            value={currentVal}
            onChange={handleChange}
            min={min}
            max={max}
            disabled={disabled}
            className={`w-full text-center font-bold text-sm px-3 py-2 rounded-lg border bg-white dark:bg-[#082052] text-[#082052] dark:text-[#F8F0E5] font-mono tabular-nums ${
              error
                ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'border-[#e2d5c1] dark:border-[#153675] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none'
            }`}
          />
          {unit && (
            <span className="absolute right-2.5 top-2 text-xs text-[#5a677a] font-medium">
              {unit}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (currentVal !== '' && currentVal >= max)}
          className="w-9 h-9 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5] flex items-center justify-center hover:bg-[#ede0ce] dark:hover:bg-[#0c2a68] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-[#5a677a] dark:text-[#d8cebe]">{helperText}</p>
      ) : null}
    </div>
  );
};

export default NumericInput;
