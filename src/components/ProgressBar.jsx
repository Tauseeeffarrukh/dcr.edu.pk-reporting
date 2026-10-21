// Multi-Step Form Wizard Progress Bar with Step Indicators & Status
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React from 'react';
import { EVALUATION_STEPS } from '../constants/evaluationSections';

export const ProgressBar = ({ currentStep = 1, onSelectStep = () => {}, completedSteps = [] }) => {
  const totalSteps = EVALUATION_STEPS.length;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);
  const currentStepMeta = EVALUATION_STEPS.find((s) => s.step === currentStep) || EVALUATION_STEPS[0];

  return (
    <div className="bg-white dark:bg-[#082052] border-b border-[#e2d5c1] dark:border-[#153675] px-3 sm:px-4 py-2.5 shadow-xs sticky top-[57px] z-30">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-2 truncate">
          <span className="bg-[#082052] text-[#F8F0E5] text-[11px] font-bold px-2.5 py-0.5 rounded-md shrink-0 border border-[#C59B27]/40 font-mono">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#082052] dark:text-[#F8F0E5] truncate">
            {currentStepMeta.title}
          </span>
        </div>
        <span className="text-xs font-bold text-[#082052] dark:text-[#C59B27] shrink-0 ml-2 tabular-nums font-mono">
          {progressPercent}% Complete
        </span>
      </div>

      {/* Thin continuous progress track */}
      <div className="w-full bg-[#ede0ce] dark:bg-[#041029] h-1.5 rounded-full overflow-hidden mb-2">
        <div
          className="bg-[#082052] dark:bg-[#C59B27] h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Horizontal step selector scroll for quick jumping between steps */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {EVALUATION_STEPS.map((s) => {
          const isCurrent = s.step === currentStep;
          const isDone = completedSteps.includes(s.step);

          return (
            <button
              key={s.step}
              type="button"
              onClick={() => onSelectStep(s.step)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 flex items-center space-x-1 transition-all ${
                isCurrent
                  ? 'bg-[#082052] text-[#F8F0E5] font-bold shadow-xs ring-1 ring-[#C59B27]'
                  : isDone
                  ? 'bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5] border border-[#c0d4ed] dark:border-[#153675]'
                  : 'bg-[#f8f0e5] dark:bg-[#041029]/60 text-[#5a677a] dark:text-[#d8cebe] hover:bg-[#ede0ce] border border-[#e2d5c1] dark:border-[#153675]'
              }`}
            >
              <span>{s.step}.</span>
              <span className="truncate max-w-[80px] sm:max-w-[110px]">{s.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
