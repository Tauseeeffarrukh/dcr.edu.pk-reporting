// Feedback states: Empty, Loading, and Error
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React from 'react';
import { Inbox, AlertTriangle, RefreshCw } from 'lucide-react';

export const EmptyState = ({
  title = 'No items found',
  description = 'There are currently no records available.',
  actionText,
  onAction,
  icon: Icon = Inbox,
}) => (
  <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
    <div className="w-12 h-12 rounded-xl bg-[#faf3df] dark:bg-[#041029] flex items-center justify-center text-[#C59B27] mb-3 border border-[#e8d59f] dark:border-[#153675]">
      <Icon className="w-6 h-6" />
    </div>
    <h4 className="text-sm font-bold text-[#082052] dark:text-[#F8F0E5] mb-1">{title}</h4>
    <p className="text-xs text-[#5a677a] dark:text-[#d8cebe] max-w-sm mb-4">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-[#F8F0E5] text-xs font-bold shadow-xs transition-all active:scale-98"
      >
        {actionText}
      </button>
    )}
  </div>
);

export const LoadingState = ({ message = 'Loading institutional data...' }) => (
  <div className="py-16 text-center flex flex-col items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-[#082052] dark:border-[#C59B27] border-t-transparent animate-spin mb-3" />
    <p className="text-xs font-medium text-[#5a677a] dark:text-[#d8cebe]">{message}</p>
  </div>
);

export const ErrorState = ({
  title = 'Something went wrong',
  error = 'Unable to load information.',
  onRetry,
}) => (
  <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
    <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 mb-3 border border-rose-200 dark:border-rose-800">
      <AlertTriangle className="w-6 h-6" />
    </div>
    <h4 className="text-sm font-bold text-[#082052] dark:text-[#F8F0E5] mb-1">{title}</h4>
    <p className="text-xs text-rose-600 dark:text-rose-400 max-w-sm mb-4">{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-1.5 rounded-lg border border-[#e2d5c1] dark:border-[#153675] hover:bg-[#faf6f0] dark:hover:bg-[#041029] text-xs font-bold text-[#082052] dark:text-[#F8F0E5] flex items-center space-x-1.5"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Retry</span>
      </button>
    )}
  </div>
);

export default {
  EmptyState,
  LoadingState,
  ErrorState,
};
