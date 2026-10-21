// Form Validation Utilities for Dar-e-Arqam M&E System

/**
 * Validates Pakistani phone numbers:
 * Supports +92 3XX XXXXXXX, 03XXXXXXXXX, 03XX-XXXXXXX, 042-XXXXXXX
 */
export const isValidPakistaniPhone = (phone) => {
  if (!phone) return false;
  const clean = String(phone).replace(/[\s\-\(\)]/g, '');
  // Pakistani mobile (+923... or 03...) or PTCL landline (042..., etc.)
  const pakistaniMobileRegex = /^(\+92|0092|92|0)?3[0-9]{9}$/;
  const pakistaniLandlineRegex = /^(\+92|0092|92|0)?[2-9][0-9]{8,9}$/;
  return pakistaniMobileRegex.test(clean) || pakistaniLandlineRegex.test(clean);
};

/**
 * Validates that visit end time is after visit start time
 */
export const isValidTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return true; // not both filled yet
  const [sHours, sMinutes] = startTime.split(':').map(Number);
  const [eHours, eMinutes] = endTime.split(':').map(Number);
  
  if (isNaN(sHours) || isNaN(eHours)) return true;
  
  const startTotal = sHours * 60 + (sMinutes || 0);
  const endTotal = eHours * 60 + (eMinutes || 0);
  
  return endTotal > startTotal;
};

/**
 * Validates score is within permitted 0 to max bounds
 */
export const isValidScore = (score, max = 5) => {
  if (score === null || score === undefined || score === '') return false;
  const num = Number(score);
  return !isNaN(num) && num >= 0 && num <= max;
};

/**
 * Validates step 1: Basic Visit Information
 */
export const validateStep1BasicInfo = (data) => {
  const errors = {};
  if (!data.srNo) errors.srNo = 'Serial Number is required';
  if (!data.region) errors.region = 'Region is required';
  if (!data.branchName) errors.branchName = 'Branch Name is required';
  if (!data.schoolBuilding) errors.schoolBuilding = 'Building type is required';
  if (!data.visitDate) errors.visitDate = 'Visit Date is required';
  if (!data.visitStartTime) errors.visitStartTime = 'Visit start time is required';
  if (!data.visitEndTime) errors.visitEndTime = 'Visit end time is required';
  if (data.visitStartTime && data.visitEndTime && !isValidTimeRange(data.visitStartTime, data.visitEndTime)) {
    errors.visitEndTime = 'Visit end time cannot be earlier than start time';
  }
  if (!data.monitoringOfficerName) errors.monitoringOfficerName = 'Monitoring Officer Name is required';
  if (data.monitoringOfficerContact && !isValidPakistaniPhone(data.monitoringOfficerContact)) {
    errors.monitoringOfficerContact = 'Please enter a valid Pakistani contact number (e.g. 0300-1234567)';
  }
  if (data.principalContact && !isValidPakistaniPhone(data.principalContact)) {
    errors.principalContact = 'Please enter a valid Pakistani contact number';
  }
  if (data.directorContact && !isValidPakistaniPhone(data.directorContact)) {
    errors.directorContact = 'Please enter a valid Pakistani contact number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Check if a low rating requires a recommendation/observation
 */
export const requiresRecommendation = (rating) => {
  if (typeof rating === 'number') {
    return rating <= 2;
  }
  const lowRatings = [
    'Needs Improvement',
    'Need Improvement',
    'Needs effort',
    'Need efforts',
    'Less Effective',
    'Ineffective',
    'Not Maintained',
    'Passive',
    'None',
    'Not Display',
    'Not followed',
    'Delayed',
    'Not submitted',
    'Not available',
  ];
  return lowRatings.includes(rating);
};

export default {
  isValidPakistaniPhone,
  isValidTimeRange,
  isValidScore,
  validateStep1BasicInfo,
  requiresRecommendation,
};
