// Automatic Calculation Engine for Dar-e-Arqam M&E Report
import { getPerformanceCategory, DEFAULT_PERFORMANCE_CATEGORIES } from './performanceCategories';
import { MAX_MARKS } from '../constants/evaluationSections';

/**
 * Safely parse a numeric value, defaulting to 0 if invalid or empty
 */
export const safeNumber = (val, fallback = 0) => {
  if (val === null || val === undefined || val === '') return fallback;
  const num = Number(val);
  return isNaN(num) ? fallback : Math.max(0, num);
};

/**
 * Calculate percentage safely handling zero denominators
 */
export const calculatePercentage = (obtained, total) => {
  const o = safeNumber(obtained);
  const t = safeNumber(total);
  if (t <= 0) return 0;
  const raw = (o / t) * 100;
  return Math.min(100, Math.round(raw * 10) / 10);
};

/**
 * Student growth calculation
 * Current Students - Previous Students
 */
export const calculateStudentGrowth = (current, previous) => {
  const curr = safeNumber(current);
  const prev = safeNumber(previous);
  const growth = curr - prev;
  const growthPct = prev > 0 ? Math.round(((growth / prev) * 100) * 10) / 10 : 0;
  return {
    growth,
    growthPct,
    isNegative: growth < 0,
    isConcern: growth < 0 || (prev > 0 && curr < prev * 0.9),
  };
};

/**
 * Calculate Classroom Environment Marks (Max 20 marks, 4 criteria x 5)
 */
export const calculateClassroomEnvironment = (criteriaScores = {}) => {
  const keys = ['seating', 'environment', 'planningSyllabi', 'cleanliness'];
  let obtained = 0;
  keys.forEach((k) => {
    obtained += Math.min(5, safeNumber(criteriaScores[k]));
  });
  const total = MAX_MARKS.CLASSROOM_ENVIRONMENT; // 20
  const percentage = calculatePercentage(obtained, total);
  return {
    obtained,
    total,
    percentage,
    category: getPerformanceCategory(percentage),
  };
};

/**
 * Calculate Students' Evaluation Marks (Max 25 marks, 5 criteria x 5)
 */
export const calculateStudentsEvaluation = (criteriaScores = {}) => {
  const keys = ['greetings', 'communication', 'activityRecord', 'subjectCompetency', 'notebooksPresentation'];
  let obtained = 0;
  keys.forEach((k) => {
    obtained += Math.min(5, safeNumber(criteriaScores[k]));
  });
  const total = MAX_MARKS.STUDENTS_EVALUATION; // 25
  const percentage = calculatePercentage(obtained, total);
  return {
    obtained,
    total,
    percentage,
    category: getPerformanceCategory(percentage),
  };
};

/**
 * Calculate Teacher's Evaluation Marks (Max 25 marks, 5 criteria x 5)
 */
export const calculateTeacherEvaluation = (criteriaScores = {}) => {
  const keys = ['lessonPlan', 'resources', 'skillsCommand', 'checkingQuality', 'personalityBodyLanguage'];
  let obtained = 0;
  keys.forEach((k) => {
    obtained += Math.min(5, safeNumber(criteriaScores[k]));
  });
  const total = MAX_MARKS.TEACHER_EVALUATION; // 25
  const percentage = calculatePercentage(obtained, total);
  return {
    obtained,
    total,
    percentage,
    category: getPerformanceCategory(percentage),
  };
};

/**
 * Calculate Class-wise Combined Marks (Standard Class Total: 70 marks)
 */
export const calculateClasswiseTotal = (classroomScores, studentScores, teacherScores) => {
  const ce = calculateClassroomEnvironment(classroomScores);
  const se = calculateStudentsEvaluation(studentScores);
  const te = calculateTeacherEvaluation(teacherScores);

  const obtained = ce.obtained + se.obtained + te.obtained;
  const total = MAX_MARKS.REGULAR_CLASS_TOTAL; // 70
  const percentage = calculatePercentage(obtained, total);

  return {
    classroom: ce,
    students: se,
    teacher: te,
    obtained,
    total,
    percentage,
    category: getPerformanceCategory(percentage),
  };
};

/**
 * Calculate Hifz Academics Evaluation (Max 75 marks: 25 + 25 + 25)
 */
export const calculateHifzEvaluation = (hifzClassroom = {}, hifzStudents = {}, hifzTeacher = {}) => {
  // Hifz Classroom: 5 items x 5 = 25
  const cKeys = ['seating', 'whiteboard', 'softboards', 'schedule', 'cleanliness'];
  let cObtained = 0;
  cKeys.forEach((k) => {
    cObtained += Math.min(5, safeNumber(hifzClassroom[k]));
  });

  // Hifz Students: 5 items x 5 = 25
  const sKeys = ['ethics', 'communication', 'conceptsClearance', 'grammar', 'laminations'];
  let sObtained = 0;
  sKeys.forEach((k) => {
    sObtained += Math.min(5, safeNumber(hifzStudents[k]));
  });

  // Hifz Teacher: 5 items x 5 = 25
  const tKeys = ['lessonPlan', 'resources', 'skillsCommand', 'checkingQuality', 'personalityBodyLanguage'];
  let tObtained = 0;
  tKeys.forEach((k) => {
    tObtained += Math.min(5, safeNumber(hifzTeacher[k]));
  });

  const total = MAX_MARKS.HIFZ_TOTAL; // 75
  const obtained = cObtained + sObtained + tObtained;
  const percentage = calculatePercentage(obtained, total);

  return {
    classroom: { obtained: cObtained, total: 25, percentage: calculatePercentage(cObtained, 25) },
    students: { obtained: sObtained, total: 25, percentage: calculatePercentage(sObtained, 25) },
    teacher: { obtained: tObtained, total: 25, percentage: calculatePercentage(tObtained, 25) },
    obtained,
    total,
    percentage,
    category: getPerformanceCategory(percentage),
  };
};

/**
 * Aggregates all class evaluations and Hifz evaluations to compute Branch Overall Summary
 * Exactly as detailed in Page 7 of the document:
 * Columns:
 * - Classroom Evaluation Total & Obtained Marks
 * - Students Evaluation Total & Obtained Marks
 * - Teachers Evaluations Total & Obtained Marks
 * - Activities / Project Record Marks (Standard: 25)
 * - Overall Total Marks & Obtained Marks
 * - Overall Percentage of Branch
 * - Performance Category & Remarks
 */
export const calculateBranchOverallSummary = (
  classEvaluations = [],
  hifzEvaluations = [],
  activitiesProjectMarks = 20, // out of 25
  customCategories = DEFAULT_PERFORMANCE_CATEGORIES
) => {
  let classroomTotal = 0;
  let classroomObtained = 0;

  let studentsTotal = 0;
  let studentsObtained = 0;

  let teachersTotal = 0;
  let teachersObtained = 0;

  // Aggregate regular class evaluations
  classEvaluations.forEach((item) => {
    const ce = calculateClassroomEnvironment(item.classroomScores);
    const se = calculateStudentsEvaluation(item.studentScores);
    const te = calculateTeacherEvaluation(item.teacherScores);

    classroomTotal += ce.total;
    classroomObtained += ce.obtained;

    studentsTotal += se.total;
    studentsObtained += se.obtained;

    teachersTotal += te.total;
    teachersObtained += te.obtained;
  });

  // Aggregate Hifz evaluations
  hifzEvaluations.forEach((item) => {
    const h = calculateHifzEvaluation(item.classroomScores, item.studentScores, item.teacherScores);
    classroomTotal += h.classroom.total;
    classroomObtained += h.classroom.obtained;

    studentsTotal += h.students.total;
    studentsObtained += h.students.obtained;

    teachersTotal += h.teacher.total;
    teachersObtained += h.teacher.obtained;
  });

  // Activities / Project Record
  const activitiesTotal = MAX_MARKS.ACTIVITIES_PROJECT_RECORD; // 25
  const activitiesObtained = Math.min(activitiesTotal, safeNumber(activitiesProjectMarks, 20));

  // If no classes entered yet, provide standard benchmark totals
  if (classroomTotal === 0 && studentsTotal === 0 && teachersTotal === 0) {
    classroomTotal = 20;
    studentsTotal = 25;
    teachersTotal = 25;
  }

  const overallTotal = classroomTotal + studentsTotal + teachersTotal + activitiesTotal;
  const overallObtained = classroomObtained + studentsObtained + teachersObtained + activitiesObtained;
  const overallPercentage = calculatePercentage(overallObtained, overallTotal);
  const category = getPerformanceCategory(overallPercentage, customCategories);

  return {
    classroom: {
      total: classroomTotal,
      obtained: classroomObtained,
      percentage: calculatePercentage(classroomObtained, classroomTotal),
    },
    students: {
      total: studentsTotal,
      obtained: studentsObtained,
      percentage: calculatePercentage(studentsObtained, studentsTotal),
    },
    teachers: {
      total: teachersTotal,
      obtained: teachersObtained,
      percentage: calculatePercentage(teachersObtained, teachersTotal),
    },
    activities: {
      total: activitiesTotal,
      obtained: activitiesObtained,
      percentage: calculatePercentage(activitiesObtained, activitiesTotal),
    },
    overall: {
      total: overallTotal,
      obtained: overallObtained,
      percentage: overallPercentage,
      category,
    },
  };
};

export const calculateClassroomScore = calculateClassroomEnvironment;
export const calculateStudentsScore = calculateStudentsEvaluation;
export const calculateTeacherScore = calculateTeacherEvaluation;

export const calculateTotalScores = (report) => {
  if (!report) {
    return {
      classroom: { total: 20, obtained: 0, percentage: 0 },
      students: { total: 25, obtained: 0, percentage: 0 },
      teachers: { total: 25, obtained: 0, percentage: 0 },
      activities: { total: 25, obtained: 0, percentage: 0 },
      overall: { total: 95, obtained: 0, percentage: 0 },
    };
  }
  return calculateBranchOverallSummary(
    report.classEvaluations || [],
    report.hifzEvaluations || [],
    report.activitiesProjectMarks || report.activities?.obtained || 20
  );
};

export default {
  safeNumber,
  calculatePercentage,
  calculateStudentGrowth,
  calculateClassroomEnvironment,
  calculateStudentsEvaluation,
  calculateTeacherEvaluation,
  calculateClasswiseTotal,
  calculateHifzEvaluation,
  calculateBranchOverallSummary,
};
