// Report Workflow Statuses & User Roles

export const REPORT_STATUSES = {
  DRAFT: 'Draft',
  IN_PROGRESS: 'In Progress',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  RETURNED: 'Returned for Correction',
  RESUBMITTED: 'Resubmitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
};

export const REPORT_STATUS_LIST = Object.values(REPORT_STATUSES);

export const USER_ROLES = {
  CENTRAL_ADMIN: 'Central Administrator',
  REGIONAL_DIRECTOR: 'Regional Director',
  REGIONAL_MANAGER: 'Regional Manager',
  MONITORING_OFFICER: 'Monitoring Officer',
  PRINCIPAL: 'Principal',
  SCHOOL_DIRECTOR: 'School Director',
  REVIEWER: 'Reviewer',
  VIEWER: 'Read-only Viewer',
};

export const USER_ROLES_LIST = Object.values(USER_ROLES);

export const ALL_ROLES = [
  { role: USER_ROLES.CENTRAL_ADMIN, name: 'Engr. Tariq Mahmood (Central Admin)' },
  { role: USER_ROLES.REGIONAL_DIRECTOR, name: 'Dr. Abdul Qadeer (Regional Director)' },
  { role: USER_ROLES.REGIONAL_MANAGER, name: 'Shahid Mehmood (Regional Manager)' },
  { role: USER_ROLES.MONITORING_OFFICER, name: 'Muhammad Salman Siddiqui (Monitoring Officer)' },
  { role: USER_ROLES.PRINCIPAL, name: 'Prof. Muhammad Aslam (Branch Principal)' },
  { role: USER_ROLES.SCHOOL_DIRECTOR, name: 'Chaudhry Nadeem Akhtar (Campus Director)' },
];

export const ROLE_PERMISSIONS = {
  [USER_ROLES.MONITORING_OFFICER]: {
    canCreateVisit: true,
    canEditForms: true,
    canUploadEvidence: true,
    canSubmitReport: true,
    canApproveReport: false,
    canReturnReport: false,
    canManageSettings: false,
    scope: 'own',
  },
  [USER_ROLES.REGIONAL_MANAGER]: {
    canCreateVisit: true,
    canEditForms: true,
    canUploadEvidence: true,
    canSubmitReport: true,
    canApproveReport: false,
    canReturnReport: true,
    canManageSettings: false,
    scope: 'region',
  },
  [USER_ROLES.REGIONAL_DIRECTOR]: {
    canCreateVisit: false,
    canEditForms: false,
    canUploadEvidence: true,
    canSubmitReport: false,
    canApproveReport: true,
    canReturnReport: true,
    canManageSettings: false,
    scope: 'region',
  },
  [USER_ROLES.CENTRAL_ADMIN]: {
    canCreateVisit: true,
    canEditForms: true,
    canUploadEvidence: true,
    canSubmitReport: true,
    canApproveReport: true,
    canReturnReport: true,
    canManageSettings: true,
    scope: 'all',
  },
  [USER_ROLES.PRINCIPAL]: {
    canCreateVisit: false,
    canEditForms: false,
    canUploadEvidence: true,
    canSubmitReport: false,
    canApproveReport: false,
    canReturnReport: false,
    canRespondFindings: true,
    scope: 'school',
  },
  [USER_ROLES.SCHOOL_DIRECTOR]: {
    canCreateVisit: false,
    canEditForms: false,
    canUploadEvidence: true,
    canSubmitReport: false,
    canApproveReport: false,
    canReturnReport: false,
    canRespondFindings: true,
    scope: 'school',
  },
  [USER_ROLES.REVIEWER]: {
    canCreateVisit: false,
    canEditForms: false,
    canUploadEvidence: false,
    canSubmitReport: false,
    canApproveReport: false,
    canReturnReport: true,
    scope: 'assigned',
  },
  [USER_ROLES.VIEWER]: {
    canCreateVisit: false,
    canEditForms: false,
    canUploadEvidence: false,
    canSubmitReport: false,
    canApproveReport: false,
    canReturnReport: false,
    scope: 'all',
  },
};

export default {
  REPORT_STATUSES,
  REPORT_STATUS_LIST,
  USER_ROLES,
  USER_ROLES_LIST,
  ROLE_PERMISSIONS,
};
