// All 14 Steps of the Dar-e-Arqam M&E Report 2025 Form Wizard

export const EVALUATION_STEPS = [
  {
    step: 1,
    id: 'basic_info',
    title: 'Basic Visit Information',
    subtitle: 'Branch details, timings, and contacts',
    icon: 'Building2',
  },
  {
    step: 2,
    id: 'facilities',
    title: 'School Building & Facilities',
    subtitle: 'Area, rooms, offices, labs, and washrooms',
    icon: 'Landmark',
  },
  {
    step: 3,
    id: 'profile',
    title: 'School Profile & Enrollment',
    subtitle: 'Sections, attendance, growth, and calendar',
    icon: 'Users',
  },
  {
    step: 4,
    id: 'leadership',
    title: 'Management & Academic Leadership',
    subtitle: 'Director involvement, principal competencies, and rounds',
    icon: 'Award',
  },
  {
    step: 5,
    id: 'strength',
    title: 'Staff & Academic Strength',
    subtitle: 'ECE to Secondary, Hifz, staff records, and reports',
    icon: 'GraduationCap',
  },
  {
    step: 6,
    id: 'presentation',
    title: 'Presentation, Discipline & Cleanliness',
    subtitle: 'Mission/vision, security, dress codes, soft-boards',
    icon: 'Sparkles',
  },
  {
    step: 7,
    id: 'exams',
    title: 'Exams Evaluation',
    subtitle: 'Datesheets, vigilance, shuffling, whiteboards',
    icon: 'ClipboardCheck',
  },
  {
    step: 8,
    id: 'ranking_scale',
    title: 'Universal Ranking Scale',
    subtitle: 'Standardized 5-tier evaluation rubric',
    icon: 'BarChart2',
  },
  {
    step: 9,
    id: 'class_eval',
    title: 'Class-wise Academic Evaluation',
    subtitle: 'Environment (20), Students (25), Teachers (25) = 70 Marks',
    icon: 'BookOpen',
  },
  {
    step: 10,
    id: 'hifz_eval',
    title: 'Hifz Academics Evaluation',
    subtitle: 'Level A to E: Environment (25), Students (25), Teacher (25) = 75 Marks',
    icon: 'BookMarked',
  },
  {
    step: 11,
    id: 'teacher_performance',
    title: 'Teacher Performance Appraisal',
    subtitle: 'Individual teacher strengths, improvements, and trainings',
    icon: 'UserCheck',
  },
  {
    step: 12,
    id: 'action_plan',
    title: 'Findings & Action Plan',
    subtitle: 'Repeatable corrective matrix with timelines and responsibilities',
    icon: 'CheckSquare',
  },
  {
    step: 13,
    id: 'branch_ranking',
    title: 'Branch Ranking & Performance Summary',
    subtitle: 'Verified category scores, activities marks, and overall %',
    icon: 'TrendingUp',
  },
  {
    step: 14,
    id: 'signatures',
    title: 'Final Signatures & Verification',
    subtitle: 'Principal, Director, and Monitoring Officer endorsements',
    icon: 'PenTool',
  },
];

export const MAX_MARKS = {
  CLASSROOM_ENVIRONMENT: 20,
  STUDENTS_EVALUATION: 25,
  TEACHER_EVALUATION: 25,
  REGULAR_CLASS_TOTAL: 70,

  HIFZ_CLASSROOM_ENVIRONMENT: 25,
  HIFZ_STUDENTS_EVALUATION: 25,
  HIFZ_TEACHER_EVALUATION: 25,
  HIFZ_TOTAL: 75,

  ACTIVITIES_PROJECT_RECORD: 25,
};

export default {
  EVALUATION_STEPS,
  MAX_MARKS,
};
