// Performance categories configuration and helper functions
// Harmonized with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)

export const DEFAULT_PERFORMANCE_CATEGORIES = [
  { min: 90, max: 100, label: 'Highly Effective', code: 'HE', color: '#082052', badgeBg: '#edf3fa', badgeText: '#082052' },
  { min: 80, max: 89.99, label: 'Effective', code: 'EF', color: '#1c499c', badgeBg: '#f1e7d8', badgeText: '#1c499c' },
  { min: 70, max: 79.99, label: 'Moderately Effective', code: 'ME', color: '#C59B27', badgeBg: '#faf3df', badgeText: '#8a680e' },
  { min: 60, max: 69.99, label: 'Less Effective', code: 'LE', color: '#d97706', badgeBg: '#FEF3C7', badgeText: '#92400E' },
  { min: 0, max: 59.99, label: 'Ineffective', code: 'IE', color: '#9e2a2b', badgeBg: '#FEE2E2', badgeText: '#991B1B' },
];

/**
 * Get performance category based on percentage score and custom category ranges
 * @param {number} percentage 
 * @param {Array} customCategories 
 * @returns {Object} Category object
 */
export const getPerformanceCategory = (percentage, customCategories = DEFAULT_PERFORMANCE_CATEGORIES) => {
  const numericScore = typeof percentage === 'number' ? percentage : parseFloat(percentage);
  if (isNaN(numericScore) || numericScore === null || numericScore === undefined) {
    return {
      label: 'Not Evaluated',
      code: 'NE',
      color: '#6B7280',
      badgeBg: '#F3F4F6',
      badgeText: '#374151',
    };
  }

  const found = customCategories.find(
    (cat) => numericScore >= cat.min && (numericScore <= cat.max || (cat.max === 100 && numericScore >= 100))
  );

  return (
    found || {
      label: numericScore < 60 ? 'Ineffective' : 'Evaluated',
      code: numericScore < 60 ? 'IE' : 'EV',
      color: numericScore < 60 ? '#9e2a2b' : '#082052',
      badgeBg: numericScore < 60 ? '#FEE2E2' : '#edf3fa',
      badgeText: numericScore < 60 ? '#991B1B' : '#082052',
    }
  );
};

export default {
  DEFAULT_PERFORMANCE_CATEGORIES,
  getPerformanceCategory,
};
