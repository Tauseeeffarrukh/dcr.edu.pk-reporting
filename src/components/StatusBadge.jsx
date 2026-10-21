// StatusBadge Component for Workflow and Performance Badges
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), clean typography
import React from 'react';
import { REPORT_STATUSES } from '../constants/reportStatuses';

export const StatusBadge = ({ status, size = 'md' }) => {
  const getStyle = () => {
    switch (status) {
      case REPORT_STATUSES.APPROVED:
        return 'bg-[#edf3fa] text-[#082052] border-[#c0d4ed] dark:bg-[#0e2e6e]/60 dark:text-[#F8F0E5] dark:border-[#1c499c]';
      case REPORT_STATUSES.SUBMITTED:
        return 'bg-[#faf3df] text-[#8a680e] border-[#e8d59f] dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case REPORT_STATUSES.UNDER_REVIEW:
        return 'bg-indigo-50 text-indigo-900 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800';
      case REPORT_STATUSES.RETURNED:
        return 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      case REPORT_STATUSES.RESUBMITTED:
        return 'bg-[#edf3fa] text-[#153e8a] border-[#b8d1f2] dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
      case REPORT_STATUSES.REJECTED:
        return 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800';
      case REPORT_STATUSES.IN_PROGRESS:
        return 'bg-[#f1e7d8] text-[#082052] border-[#e2d5c1] dark:bg-[#0e2e6e]/40 dark:text-[#F8F0E5] dark:border-[#1c499c]';
      case REPORT_STATUSES.DRAFT:
      default:
        return 'bg-[#F8F0E5] text-[#5a677a] border-[#e2d5c1] dark:bg-[#041029] dark:text-[#d8cebe] dark:border-[#153675]';
    }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wide uppercase font-mono ${sizeClass} ${getStyle()}`}
    >
      {status || 'Draft'}
    </span>
  );
};

export default StatusBadge;
