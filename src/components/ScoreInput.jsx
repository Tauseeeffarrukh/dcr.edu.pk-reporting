// ScoreInput Component: Universal 0 to 5 Evaluation Rubric
// Redesigned with Etoile Palette: #082052 (Navy), #F8F0E5 (Alabaster Cream), #C59B27 (Gold)
import React from 'react';
import { UNIVERSAL_RANKING_SCALE } from '../constants/ratingOptions';

export const ScoreInput = ({
  label,
  score,
  onChangeScore,
  observation,
  onChangeObservation,
  recommendation,
  onChangeRecommendation,
  max = 5,
  required = false,
  displayMode = 'both', // 'numeric', 'descriptive', 'both'
  error,
  disabled = false,
  showNotes = true,
  className = '',
}) => {
  const currentNum = score === '' || score === null || score === undefined ? null : Number(score);

  const getButtonClass = (val) => {
    const isSelected = currentNum === val;
    if (!isSelected) {
      return 'bg-white dark:bg-[#082052] text-[#222d3d] dark:text-[#F8F0E5] border-[#e2d5c1] dark:border-[#153675] hover:bg-[#faf6f0] dark:hover:bg-[#0c2a68]';
    }
    if (val >= 4) return 'bg-[#082052] text-[#F8F0E5] border-[#082052] font-bold shadow-xs ring-1 ring-[#C59B27]';
    if (val === 3) return 'bg-[#153e8a] text-white border-[#153e8a] font-bold shadow-xs';
    if (val >= 1) return 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs';
    return 'bg-[#5a677a] text-white border-[#5a677a] font-bold shadow-xs';
  };

  const getScoreDescription = (val) => {
    if (val === null || val === undefined) return 'Not Evaluated';
    const found = UNIVERSAL_RANKING_SCALE.find((s) => s.score === val);
    return found ? found.label : `${val} Marks`;
  };

  return (
    <div className={`p-3.5 rounded-xl border border-[#e2d5c1] dark:border-[#153675] bg-white dark:bg-[#082052] mb-3 ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 pr-2">
          <span className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5]">
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
        </div>

        {/* Selected Score Indicator */}
        <div className="text-right shrink-0">
          <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold tabular-nums font-mono ${
            currentNum >= 4 ? 'bg-[#edf3fa] text-[#082052] dark:bg-[#041029] dark:text-[#F8F0E5] border border-[#c0d4ed] dark:border-[#153675]' :
            currentNum === 3 ? 'bg-[#faf3df] text-[#8a680e] dark:bg-[#C59B27]/20 dark:text-[#C59B27] border border-[#e8d59f] dark:border-[#C59B27]/40' :
            currentNum !== null ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
            'bg-[#F8F0E5] text-[#5a677a] dark:bg-[#041029] dark:text-[#d8cebe] border border-[#e2d5c1] dark:border-[#153675]'
          }`}>
            {displayMode === 'numeric' && `${currentNum !== null ? currentNum : '—'} / ${max}`}
            {displayMode === 'descriptive' && getScoreDescription(currentNum)}
            {displayMode === 'both' && (
              currentNum !== null ? `${currentNum}/${max} · ${getScoreDescription(currentNum)}` : 'Not Scored'
            )}
          </span>
        </div>
      </div>

      {/* Buttons (0 to 5) */}
      <div className="grid grid-cols-6 gap-1.5 mb-2.5">
        {[0, 1, 2, 3, 4, 5].map((val) => (
          <button
            type="button"
            key={val}
            disabled={disabled}
            onClick={() => onChangeScore(val)}
            className={`py-1.5 rounded-lg text-center text-xs border transition-all cursor-pointer font-mono ${getButtonClass(val)} ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {val}
          </button>
        ))}
      </div>

      {/* Mandatory Recommendation if score is low (<= 2) */}
      {currentNum !== null && currentNum <= 2 && (
        <div className="mb-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-700 dark:text-rose-300 font-medium">
          Low rating ({currentNum}/5): Actionable recommendation is mandatory.
        </div>
      )}

      {/* Observations and Recommendations */}
      {showNotes && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#e2d5c1] dark:border-[#153675]">
          {onChangeObservation && (
            <div>
              <input
                type="text"
                value={observation || ''}
                onChange={(e) => onChangeObservation(e.target.value)}
                placeholder="Specific field observation..."
                disabled={disabled}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] placeholder:text-slate-400 focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
              />
            </div>
          )}

          {onChangeRecommendation && (
            <div>
              <input
                type="text"
                value={recommendation || ''}
                onChange={(e) => onChangeRecommendation(e.target.value)}
                placeholder="Actionable corrective recommendation..."
                disabled={disabled}
                className={`w-full text-xs px-2.5 py-1.5 rounded-lg border bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] placeholder:text-slate-400 focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none ${
                  currentNum !== null && currentNum <= 2 && !recommendation
                    ? 'border-rose-400 ring-1 ring-rose-300'
                    : 'border-[#e2d5c1] dark:border-[#153675]'
                }`}
              />
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export default ScoreInput;
