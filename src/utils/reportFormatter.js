// Report display and print formatting helpers
import { formatDate } from './dateUtils';
import { getPerformanceCategory } from './performanceCategories';

export const formatScoreDisplay = (obtained, total, percentage, mode = 'both') => {
  const o = obtained !== undefined && obtained !== null ? obtained : '—';
  const t = total !== undefined && total !== null ? total : '—';
  const p = percentage !== undefined && percentage !== null ? `${percentage}%` : '—';
  const cat = getPerformanceCategory(percentage);

  if (mode === 'numeric') {
    return `${o} / ${t} (${p})`;
  }
  if (mode === 'descriptive') {
    return cat.label;
  }
  return `${o} / ${t} (${p}) • ${cat.label}`;
};

export const sanitizeFilename = (text) => {
  return (text || 'report')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
};

export default {
  formatScoreDisplay,
  sanitizeFilename,
};
