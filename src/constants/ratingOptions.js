// Exact rating options from the Dar-e-Arqam M&E Report 2025 document

export const BUILDING_TYPES = ['Residential', 'Purpose built'];

export const AVAILABILITY_OPTIONS = ['Available', 'Not Available', 'Under Process'];

export const SCHOOL_LEVELS = ['ECE', 'Primary', 'Middle', 'Secondary'];

export const YES_NO_OPTIONS = ['Yes', 'No'];

export const CALENDAR_BOOKLIST_STATUS = ['Followed', 'Not Followed'];

export const CANTEEN_PROJECT_STATUS = ['Good', 'Satisfactory', 'Need Improvement'];

export const INVOLVEMENT_OPTIONS = ['Proactive', 'Average', 'Passive'];

export const PRINCIPAL_COMPETENCY_OPTIONS = [
  'Beyond Expectation',
  'Satisfactory',
  'Average',
  'Needs effort',
];

export const PARTICIPATION_OPTIONS = ['Active Participation', 'Passive Participation'];

export const EVALUATION_TIER_OPTIONS = [
  'Beyond Expectation',
  'Satisfactory',
  'Average',
  'None',
];

export const ROUNDS_TAKEN_OPTIONS = ['Satisfactory', 'Average', 'None'];

export const PRINCIPAL_RANKING_OPTIONS = [
  'Beyond Expectation',
  'Satisfactory',
  'Average',
  'Need efforts',
];

export const ASSEMBLY_LAYOUT_OPTIONS = ['Designed', 'Not designed'];

export const OFFICIAL_RECORD_OPTIONS = [
  'Well-Maintained',
  'Average maintained',
  'Not Maintained',
];

export const PRINCIPAL_REPORT_SUBMISSION = [
  'Timely submission with proper filling',
  'Delayed',
  'Not submitted',
];

export const DISPLAY_OPTIONS = ['Good display', 'Smart Display', 'Not Display'];

export const GENERAL_CONDITION_OPTIONS = [
  'Excellent',
  'Good',
  'Average',
  'Needs Improvement',
];

export const NON_ACADEMIC_CONDUCT_OPTIONS = [
  'Excellent',
  'Good',
  'Satisfactory',
  'Needs Improvement',
];

export const DRESS_CODE_OPTIONS = ['Followed', 'Not followed'];

// Exams options
export const EXAM_SCHEDULE_PAPERS_OPTIONS = [
  'Followed',
  'Not followed',
  'Followed to some extent',
];

export const TEACHER_DUTIES_OPTIONS = ['Announced', 'Not announced'];

export const SHUFFLING_OPTIONS = ['Shuffled', 'Not shuffled'];

export const VIGILANCE_OPTIONS = ['Vigilant', 'Not vigilant'];

export const RECHECKING_OPTIONS = ['Available', 'Not available'];

export const WHITEBOARDS_EXAM_OPTIONS = [
  'Updated',
  'Not updated',
  'Updated to some extent',
];

export const RESULT_DAY_OPTIONS = ['Prepared', 'Not prepared'];

export const EXAM_CHANGES_OPTIONS = [
  'Approved from Head office',
  'Not approved from Head office',
];

// Universal 1-5 Ranking Scale
export const UNIVERSAL_RANKING_SCALE = [
  { score: 5, label: 'Highly Effective', shortDesc: 'Exceeds institutional standards' },
  { score: 4, label: 'Effective', shortDesc: 'Meets institutional standards' },
  { score: 3, label: 'Moderately Effective', shortDesc: 'Acceptable with minor gaps' },
  { score: 2, label: 'Less Effective', shortDesc: 'Significant improvement required' },
  { score: 1, label: 'Ineffective', shortDesc: 'Critical deficiency' },
];

export const CLASSES_LIST = [
  'Play Group',
  'Nursery',
  'Prep',
  'Class I',
  'Class II',
  'Class III',
  'Class IV',
  'Class V',
  'Class VI',
  'Class VII',
];

export const HIFZ_LEVELS_LIST = [
  'Level A',
  'Level B',
  'Level C',
  'Level D',
  'Level E',
];

export const LEVELS_OPTIONS = ['ECE', 'Primary', 'Middle', 'Secondary', 'Hifz'];

export const RATING_OPTIONS = {
  FACILITY_STATUS: AVAILABILITY_OPTIONS,
  YES_NO: YES_NO_OPTIONS,
  FOLLOWED_STATUS: CALENDAR_BOOKLIST_STATUS,
  INVOLVEMENT: INVOLVEMENT_OPTIONS,
  PERFORMANCE_STANDARD: PRINCIPAL_COMPETENCY_OPTIONS,
  ASSEMBLY_LAYOUT: ASSEMBLY_LAYOUT_OPTIONS,
  RECORD_STATUS: OFFICIAL_RECORD_OPTIONS,
  PRINCIPAL_REPORT_SUBMISSION: PRINCIPAL_REPORT_SUBMISSION,
  DISPLAY_STATUS: DISPLAY_OPTIONS,
  EXAM_CHANGES: EXAM_CHANGES_OPTIONS,
};

export const ACTION_PLAN_PRIORITIES = ['High', 'Medium', 'Low'];

export const ACTION_PLAN_STATUSES = [
  'Pending',
  'In Progress',
  'Completed',
  'Not Applicable',
];

export default {
  BUILDING_TYPES,
  AVAILABILITY_OPTIONS,
  SCHOOL_LEVELS,
  YES_NO_OPTIONS,
  CALENDAR_BOOKLIST_STATUS,
  CANTEEN_PROJECT_STATUS,
  INVOLVEMENT_OPTIONS,
  PRINCIPAL_COMPETENCY_OPTIONS,
  PARTICIPATION_OPTIONS,
  EVALUATION_TIER_OPTIONS,
  ROUNDS_TAKEN_OPTIONS,
  PRINCIPAL_RANKING_OPTIONS,
  ASSEMBLY_LAYOUT_OPTIONS,
  OFFICIAL_RECORD_OPTIONS,
  PRINCIPAL_REPORT_SUBMISSION,
  DISPLAY_OPTIONS,
  GENERAL_CONDITION_OPTIONS,
  NON_ACADEMIC_CONDUCT_OPTIONS,
  DRESS_CODE_OPTIONS,
  EXAM_SCHEDULE_PAPERS_OPTIONS,
  TEACHER_DUTIES_OPTIONS,
  SHUFFLING_OPTIONS,
  VIGILANCE_OPTIONS,
  RECHECKING_OPTIONS,
  WHITEBOARDS_EXAM_OPTIONS,
  RESULT_DAY_OPTIONS,
  EXAM_CHANGES_OPTIONS,
  UNIVERSAL_RANKING_SCALE,
  CLASSES_LIST,
  HIFZ_LEVELS_LIST,
  ACTION_PLAN_PRIORITIES,
  ACTION_PLAN_STATUSES,
};
