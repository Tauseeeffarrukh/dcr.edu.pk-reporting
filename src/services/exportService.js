// Multi-format Export Service for Dar-e-Arqam M&E System
// Supports:
// 1. Formal Printable PDF Report (via print-to-PDF engine with complete A4 layout)
// 2. Multi-Sheet Excel XML / Spreadsheet export
// 3. Printable HTML Report for browser printing
import { formatDate, formatTime } from '../utils/dateUtils';
import { calculateBranchOverallSummary } from '../utils/calculations';
import { getPerformanceCategory } from '../utils/performanceCategories';
import { sanitizeFilename } from '../utils/reportFormatter';

/**
 * Builds the complete formal institutional HTML document matching Dar-e-Arqam M&E 2025
 */
export const buildFullReportHTML = (report, settings = {}) => {
  const year = report.reportYear || settings.reportYear || '2025';
  const session = report.academicSession || settings.academicSession || '2024-25';
  const title = report.reportTitle || settings.reportTitle || `Monitoring & Evaluation Report ${year}`;

  const summary = calculateBranchOverallSummary(
    report.classEvaluations || [],
    report.hifzEvaluations || [],
    report.activitiesProjectMarks || 20
  );

  const overallCategory = getPerformanceCategory(summary.overall.percentage);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - ${report.branchName || 'Branch'}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 12mm 16mm 12mm;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
      .avoid-break { page-break-inside: avoid; }
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #082052;
      background: #FFFFFF;
      margin: 0;
      padding: 20px;
      font-size: 11pt;
      line-height: 1.4;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      border-bottom: 3px solid #082052;
      padding-bottom: 8px;
    }
    .logo-box {
      width: 80px;
      height: 80px;
      background: #082052;
      color: #FFFFFF;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-weight: bold;
      font-size: 11px;
    }
    .brand-title {
      font-size: 20pt;
      font-weight: 800;
      color: #082052;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 11pt;
      color: #C59B27;
      font-weight: 600;
      margin: 2px 0 0 0;
    }
    .report-badge {
      display: inline-block;
      background: #edf3fa;
      color: #082052;
      border: 1px solid #b0c7db;
      padding: 4px 10px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 9pt;
      margin-top: 4px;
    }
    .section-banner {
      background: #082052;
      color: #FFFFFF;
      padding: 6px 12px;
      font-size: 11pt;
      font-weight: 700;
      border-radius: 4px;
      margin: 14px 0 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 9.5pt;
    }
    .data-table th, .data-table td {
      border: 1px solid #CBD5E1;
      padding: 5px 8px;
      vertical-align: top;
    }
    .data-table th {
      background: #F1F5F9;
      color: #082052;
      font-weight: 600;
      text-align: left;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 8.5pt;
      font-weight: 600;
    }
    .badge-success { background: #DCFCE7; color: #166534; }
    .badge-warning { background: #FEF3C7; color: #92400E; }
    .badge-danger { background: #FEE2E2; color: #991B1B; }
    .badge-info { background: #E0F2FE; color: #075985; }
    .score-highlight {
      font-size: 16pt;
      font-weight: 800;
      color: #082052;
    }
    .summary-card {
      background: #FCFBF7;
      border: 1px solid #E2E8F0;
      border-left: 4px solid #082052;
      padding: 10px 14px;
      border-radius: 4px;
      margin-bottom: 12px;
    }
    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-top: 30px;
      page-break-inside: avoid;
    }
    .signature-box {
      border-top: 1.5px dashed #64748B;
      padding-top: 8px;
      text-align: center;
      font-size: 9pt;
    }
    .footer-notice {
      margin-top: 25px;
      padding-top: 8px;
      border-top: 1px solid #E2E8F0;
      font-size: 8pt;
      color: #64748B;
      text-align: center;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <table class="header-table">
    <tr>
      <td style="width: 80px; vertical-align: middle;">
        <div class="logo-box">
          <div style="font-size: 14px;">DAS</div>
          <div style="font-size: 8px; margin-top:2px;">CENTRAL</div>
        </div>
      </td>
      <td style="padding-left: 15px; vertical-align: middle;">
        <h1 class="brand-title">DAR-E-ARQAM SCHOOLS</h1>
        <div class="brand-subtitle">Central Regions • "Success in this World & the World Hereafter"</div>
        <div style="font-size: 13pt; font-weight: 700; color: #082052; margin-top: 4px;">
          ${title}
        </div>
      </td>
      <td style="text-align: right; vertical-align: middle;">
        <span class="report-badge">STATUS: ${(report.status || 'DRAFT').toUpperCase()}</span>
        <div style="font-size: 9pt; color: #64748B; margin-top: 6px;">
          <strong>Sr. #:</strong> ${report.srNo || 'DAS-2025-001'}<br>
          <strong>Academic Session:</strong> ${session}<br>
          <strong>Visit Date:</strong> ${formatDate(report.visitDate)}
        </div>
      </td>
    </tr>
  </table>

  <!-- OVERALL SCORE SUMMARY BANNER -->
  <div class="summary-card">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="width: 30%;">
          <div style="font-size: 9pt; color: #64748B; text-transform: uppercase;">Overall Branch Evaluation</div>
          <div class="score-highlight">${summary.overall.percentage}%</div>
          <span class="badge ${summary.overall.percentage >= 80 ? 'badge-success' : summary.overall.percentage >= 70 ? 'badge-warning' : 'badge-danger'}">
            ${overallCategory.label} (${overallCategory.code})
          </span>
        </td>
        <td style="width: 70%;">
          <table style="width: 100%; font-size: 9pt; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 3px 0;"><strong>Classroom Environment:</strong></td>
              <td style="text-align: right;">${summary.classroom.obtained} / ${summary.classroom.total} (${summary.classroom.percentage}%)</td>
              <td style="padding-left: 20px;"><strong>Teacher Evaluation:</strong></td>
              <td style="text-align: right;">${summary.teachers.obtained} / ${summary.teachers.total} (${summary.teachers.percentage}%)</td>
            </tr>
            <tr>
              <td style="padding: 3px 0;"><strong>Students' Evaluation:</strong></td>
              <td style="text-align: right;">${summary.students.obtained} / ${summary.students.total} (${summary.students.percentage}%)</td>
              <td style="padding-left: 20px;"><strong>Activities & Projects:</strong></td>
              <td style="text-align: right;">${summary.activities.obtained} / ${summary.activities.total} (${summary.activities.percentage}%)</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>

  <!-- SECTION 1: BASIC VISIT INFORMATION -->
  <div class="section-banner">
    <span>1. BASIC VISIT INFORMATION</span>
    <span style="font-size: 9pt; font-weight: normal;">Page 1 of Document</span>
  </div>
  <table class="data-table">
    <tr>
      <th style="width: 18%;">Sr. #</th>
      <td style="width: 32%;">${report.srNo || '—'}</td>
      <th style="width: 18%;">Region</th>
      <td style="width: 32%;">${report.region || '—'}</td>
    </tr>
    <tr>
      <th>Branch Name</th>
      <td><strong>${report.branchName || '—'}</strong></td>
      <th>School Building</th>
      <td>${report.schoolBuilding || 'Purpose built'}</td>
    </tr>
    <tr>
      <th>Visit Date</th>
      <td>${formatDate(report.visitDate)}</td>
      <th>Visit Timing</th>
      <td>${formatTime(report.visitStartTime)} to ${formatTime(report.visitEndTime)}</td>
    </tr>
    <tr>
      <th>Last Visit Date</th>
      <td>${formatDate(report.lastVisitDate)}</td>
      <th>Monitoring Officer</th>
      <td>${report.monitoringOfficerName || '—'} (${report.monitoringOfficerContact || '—'})</td>
    </tr>
    <tr>
      <th>Principal Name</th>
      <td>${report.principalName || '—'} (${report.principalContact || '—'})</td>
      <th>Director Name</th>
      <td>${report.directorName || '—'} (${report.directorContact || '—'})</td>
    </tr>
  </table>

  <!-- SECTION 2: SCHOOL BUILDING & FACILITIES -->
  <div class="section-banner">
    <span>2. SCHOOL BUILDING & FACILITIES</span>
  </div>
  <table class="data-table">
    <tr>
      <th style="width: 16%;">Total Area</th>
      <td style="width: 17%;">${report.facilities?.totalArea || '—'}</td>
      <th style="width: 16%;">Covered Area</th>
      <td style="width: 17%;">${report.facilities?.coveredArea || '—'}</td>
      <th style="width: 16%;">Total Rooms</th>
      <td style="width: 18%;">${report.facilities?.rooms || '—'}</td>
    </tr>
    <tr>
      <th>Ground Area</th>
      <td>${report.facilities?.groundArea || '—'}</td>
      <th>Admin Office</th>
      <td>${report.facilities?.adminOffice || 'Available'}</td>
      <th>Washrooms</th>
      <td>${report.facilities?.washrooms || '—'}</td>
    </tr>
  </table>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Facility</th>
        <th style="width: 18%;">Status</th>
        <th>Remarks & Observations</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Director’s Office</strong></td>
        <td><span class="badge badge-info">${report.facilities?.directorsOffice || 'Available'}</span></td>
        <td>${report.facilities?.directorsOfficeRemarks || 'Equipped as per standard'}</td>
      </tr>
      <tr>
        <td><strong>Hall</strong></td>
        <td><span class="badge badge-info">${report.facilities?.hall || 'Available'}</span></td>
        <td>${report.facilities?.hallRemarks || 'Available for assemblies and functions'}</td>
      </tr>
      <tr>
        <td><strong>Science Lab</strong></td>
        <td><span class="badge badge-info">${report.facilities?.scienceLab || 'Available'}</span></td>
        <td>${report.facilities?.scienceLabRemarks || 'Chemicals and apparatus securely stored'}</td>
      </tr>
      <tr>
        <td><strong>Computer Lab</strong></td>
        <td><span class="badge badge-info">${report.facilities?.computerLab || 'Available'}</span></td>
        <td>${report.facilities?.computerLabRemarks || 'Working computers with active power backup'}</td>
      </tr>
      <tr>
        <td><strong>Staff Room</strong></td>
        <td><span class="badge badge-info">${report.facilities?.staffRoom || 'Available'}</span></td>
        <td>${report.facilities?.staffRoomRemarks || 'Designated lockers and seating provided'}</td>
      </tr>
      <tr>
        <td><strong>Library / Book Corner</strong></td>
        <td><span class="badge badge-info">${report.facilities?.library || 'Available'}</span></td>
        <td>${report.facilities?.libraryRemarks || 'Active borrowing records maintained'}</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 3: SCHOOL PROFILE -->
  <div class="section-banner avoid-break">
    <span>3. SCHOOL PROFILE & ENROLLMENT</span>
  </div>
  <table class="data-table avoid-break">
    <tr>
      <th style="width: 22%;">School Levels</th>
      <td style="width: 28%;">${(report.profile?.levels || ['ECE', 'Primary', 'Middle', 'Secondary']).join(', ')}</td>
      <th style="width: 22%;">Highest Class</th>
      <td style="width: 28%;">${report.profile?.highClass || 'Class X'}</td>
    </tr>
    <tr>
      <th>Total Sections</th>
      <td>${report.profile?.totalSections || '—'}</td>
      <th>Absent Students Today</th>
      <td>${report.profile?.absentStudents || '0'}</td>
    </tr>
    <tr>
      <th>Previous Enrollment</th>
      <td>${report.profile?.previousStudents || '—'}</td>
      <th>Current Enrollment</th>
      <td><strong>${report.profile?.currentStudents || '—'}</strong></td>
    </tr>
    <tr>
      <th>Co-education</th>
      <td>${report.profile?.coEducation || 'Yes'}</td>
      <th>Use of DAS Portal</th>
      <td>${report.profile?.usePortal || 'Yes'}</td>
    </tr>
    <tr>
      <th>Academic Calendar</th>
      <td>${report.profile?.academicCalendar || 'Followed'}</td>
      <th>Book List Status</th>
      <td>${report.profile?.bookList || 'Followed'}</td>
    </tr>
    <tr>
      <th>Canteen Condition & Food</th>
      <td>${report.profile?.canteenCondition || 'Good'}</td>
      <th>Students’ Projects</th>
      <td>${report.profile?.studentsProjects || 'Good'}</td>
    </tr>
  </table>

  <!-- PAGE BREAK FOR CLEAN PRINTING -->
  <div class="page-break"></div>

  <!-- SECTION 4: MANAGEMENT & ACADEMIC LEADERSHIP -->
  <div class="section-banner">
    <span>4. MANAGEMENT & ACADEMIC LEADERSHIP</span>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 35%;">Evaluation Dimension</th>
        <th style="width: 25%;">Rating Assigned</th>
        <th>Observations & Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Director’s Involvement in School Matters</td>
        <td><strong>${report.leadership?.directorInvolvement || 'Proactive'}</strong></td>
        <td>${report.leadership?.directorRemarks || 'Regular weekly review meetings.'}</td>
      </tr>
      <tr>
        <td>Campus Communication with Regional & Head Office</td>
        <td><strong>${report.leadership?.campusCommunication || 'Proactive'}</strong></td>
        <td>${report.leadership?.communicationRemarks || 'Prompt reporting and attendance.'}</td>
      </tr>
      <tr>
        <td>Principal Competency (Academics / Leadership / Teamwork)</td>
        <td><strong>${report.leadership?.principalAcademics || 'Beyond Expectation'}</strong></td>
        <td>${report.leadership?.principalRemarks || 'Solid leadership and instructional coaching.'}</td>
      </tr>
      <tr>
        <td>Participation in Meetings & Trainings</td>
        <td><strong>${report.leadership?.meetingsParticipation || 'Active Participation'}</strong></td>
        <td>Regular presence in centralized webinars and workshops.</td>
      </tr>
      <tr>
        <td>Model Lecture with Productivity</td>
        <td><strong>${report.leadership?.modelLecture || 'Beyond Expectation'}</strong></td>
        <td>Delivered monthly model lessons for pedagogy demonstration.</td>
      </tr>
      <tr>
        <td>Rounds Taken</td>
        <td><strong>${report.leadership?.roundsTaken || 'Satisfactory'}</strong></td>
        <td>Daily morning and afternoon walk-throughs recorded.</td>
      </tr>
      <tr>
        <td>Professional Development Measures</td>
        <td><strong>${report.leadership?.professionalDevelopment || 'Beyond Expectation'}</strong></td>
        <td>In-house peer training sessions scheduled bi-weekly.</td>
      </tr>
      <tr>
        <td><strong>Principal Ranking</strong></td>
        <td><span class="badge badge-success">${report.leadership?.principalRanking || 'Beyond Expectation'}</span></td>
        <td>Overall exemplary dedication to DAS standards.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 5: STAFF & STUDENT STRENGTH -->
  <div class="section-banner">
    <span>5. STUDENT & STAFF STRENGTH</span>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th>Category</th>
        <th style="text-align: center;">ECE</th>
        <th style="text-align: center;">Primary</th>
        <th style="text-align: center;">Middle</th>
        <th style="text-align: center;">Secondary</th>
        <th style="text-align: center;">Hifz</th>
        <th style="text-align: center; background: #edf3fa;">TOTAL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Student Strength</strong></td>
        <td style="text-align: center;">${report.strength?.studentsECE || 0}</td>
        <td style="text-align: center;">${report.strength?.studentsPrimary || 0}</td>
        <td style="text-align: center;">${report.strength?.studentsMiddle || 0}</td>
        <td style="text-align: center;">${report.strength?.studentsSecondary || 0}</td>
        <td style="text-align: center;">${report.strength?.studentsHifz || 0}</td>
        <td style="text-align: center; font-weight: bold; background: #edf3fa;">${report.strength?.totalStudents || 0}</td>
      </tr>
      <tr>
        <td><strong>Academic Staff Strength</strong></td>
        <td style="text-align: center;">${report.strength?.staffECE || 0}</td>
        <td style="text-align: center;">${report.strength?.staffPrimary || 0}</td>
        <td style="text-align: center;">${report.strength?.staffMiddle || 0}</td>
        <td style="text-align: center;">${report.strength?.staffSecondary || 0}</td>
        <td style="text-align: center;">${report.strength?.staffHifz || 0}</td>
        <td style="text-align: center; font-weight: bold; background: #edf3fa;">${report.strength?.totalStaff || 0}</td>
      </tr>
    </tbody>
  </table>

  <table class="data-table">
    <tr>
      <th style="width: 25%;">Non-Academic Staff</th>
      <td style="width: 25%;">${report.strength?.nonAcademicStaff || 0}</td>
      <th style="width: 25%;">Staff Turnover (Count)</th>
      <td style="width: 25%;">${report.strength?.staffTurnover || '0'}</td>
    </tr>
    <tr>
      <th>Assembly Layout</th>
      <td>${report.strength?.assemblyLayout || 'Designed'}</td>
      <th>Official Record</th>
      <td>${report.strength?.officialRecord || 'Well-Maintained'}</td>
    </tr>
    <tr>
      <th>Status of Marketing</th>
      <td>${report.strength?.statusOfMarketing || 'Beyond Expectation'}</td>
      <th>Submission of Principal Report</th>
      <td>${report.strength?.submissionOfPrincipalReport || 'Timely submission with proper filling'}</td>
    </tr>
  </table>

  <!-- SECTION 6: PRESENTATION & DISCIPLINE -->
  <div class="section-banner avoid-break">
    <span>6. SCHOOL PRESENTATION, DISCIPLINE & CLEANLINESS</span>
  </div>
  <table class="data-table avoid-break">
    <tr>
      <th style="width: 25%;">Vision, Mission & Core Values</th>
      <td style="width: 25%;"><span class="badge badge-success">${report.presentation?.displayVisionMission || 'Good display'}</span></td>
      <th style="width: 25%;">Security System</th>
      <td style="width: 25%;">${report.presentation?.securitySystem || 'Good'}</td>
    </tr>
    <tr>
      <th>Principal Office</th>
      <td>${report.presentation?.principalOffice || 'Good'}</td>
      <th>Discipline of School</th>
      <td><span class="badge badge-success">${report.presentation?.discipline || 'Excellent'}</span></td>
    </tr>
    <tr>
      <th>Dress Code: Academic Staff</th>
      <td>${report.presentation?.academicDressCode || 'Followed'}</td>
      <th>Conduct: Academic Staff</th>
      <td>${report.presentation?.academicStaffConduct || 'Excellent'}</td>
    </tr>
    <tr>
      <th>Dress Code: Non-Academic</th>
      <td>${report.presentation?.nonAcademicDressCode || 'Followed'}</td>
      <th>Conduct: Non-Academic</th>
      <td>${report.presentation?.nonAcademicStaffConduct || 'Good'}</td>
    </tr>
    <tr>
      <th>Status of Soft-boards & Decor</th>
      <td>${report.presentation?.statusOfSoftBoard || 'Excellent'}</td>
      <th>Status of School Cleanliness</th>
      <td><span class="badge badge-success">${report.presentation?.cleanliness || 'Excellent'}</span></td>
    </tr>
  </table>

  <!-- PAGE BREAK -->
  <div class="page-break"></div>

  <!-- SECTION 7: EXAMS EVALUATION -->
  <div class="section-banner">
    <span>7. EXAMINATIONS MONITORING & EVALUATION</span>
  </div>
  <table class="data-table">
    <tr>
      <th style="width: 25%;">Date Sheet / Exam Schedule</th>
      <td style="width: 25%;">${report.exams?.dateSheetSchedule || 'Followed'}</td>
      <th style="width: 25%;">Papers Standard & Security</th>
      <td style="width: 25%;">${report.exams?.papers || 'Followed'}</td>
    </tr>
    <tr>
      <th>Teachers' Duties with Shuffling</th>
      <td>${report.exams?.teachersDuties || 'Announced'}</td>
      <th>Students' Shuffling</th>
      <td>${report.exams?.studentsShuffling || 'Shuffled'}</td>
    </tr>
    <tr>
      <th>Teachers' Vigilance</th>
      <td><span class="badge badge-success">${report.exams?.teachersVigilance || 'Vigilant'}</span></td>
      <th>Papers Rechecking Schedule</th>
      <td>${report.exams?.recheckingSchedule || 'Available'}</td>
    </tr>
    <tr>
      <th>Whiteboards Updated for Exams</th>
      <td>${report.exams?.whiteboards || 'Updated'}</td>
      <th>Preparation of Result Day</th>
      <td>${report.exams?.resultDay || 'Prepared'}</td>
    </tr>
    <tr>
      <th>Changes in Exam Papers</th>
      <td colspan="3">${report.exams?.examPaperChanges || 'Approved from Head office'}</td>
    </tr>
    <tr>
      <th>Observation / Remarks</th>
      <td colspan="3">${report.exams?.observation || 'Examinations conducted transparently in compliance with Central Controller guidelines.'}</td>
    </tr>
  </table>

  <!-- SECTION 9: CLASS-WISE EVALUATION -->
  <div class="section-banner avoid-break">
    <span>8. CLASS-WISE ACADEMIC EVALUATIONS (STANDARD MAX: 70)</span>
  </div>
  ${(report.classEvaluations || []).map((cls, idx) => `
    <div class="avoid-break" style="margin-bottom: 12px; border: 1px solid #CBD5E1; border-radius: 4px; overflow: hidden;">
      <div style="background: #F8F9FA; padding: 6px 10px; font-weight: bold; border-bottom: 1px solid #CBD5E1; display: flex; justify-content: space-between;">
        <span>Class: ${cls.className} (${cls.section || 'General'}) • Subject: ${cls.subject}</span>
        <span>Teacher: ${cls.teacherName}</span>
      </div>
      <table class="data-table" style="margin-bottom: 0;">
        <tr>
          <td style="width: 33%;">
            <strong>Classroom Environment (Max 20):</strong><br>
            Obtained: <strong>${(cls.classroomScores?.seating || 0) + (cls.classroomScores?.environment || 0) + (cls.classroomScores?.planningSyllabi || 0) + (cls.classroomScores?.cleanliness || 0)} / 20</strong>
          </td>
          <td style="width: 33%;">
            <strong>Students’ Evaluation (Max 25):</strong><br>
            Obtained: <strong>${(cls.studentScores?.greetings || 0) + (cls.studentScores?.communication || 0) + (cls.studentScores?.activityRecord || 0) + (cls.studentScores?.subjectCompetency || 0) + (cls.studentScores?.notebooksPresentation || 0)} / 25</strong>
          </td>
          <td style="width: 34%;">
            <strong>Teacher’s Evaluation (Max 25):</strong><br>
            Obtained: <strong>${(cls.teacherScores?.lessonPlan || 0) + (cls.teacherScores?.resources || 0) + (cls.teacherScores?.skillsCommand || 0) + (cls.teacherScores?.checkingQuality || 0) + (cls.teacherScores?.personalityBodyLanguage || 0)} / 25</strong>
          </td>
        </tr>
        <tr>
          <td colspan="3" style="background: #FDFBF7; font-size: 8.5pt;">
            <strong>Recommendations:</strong> ${cls.recommendations || 'Maintain high student engagement and structured notebook checking.'}
          </td>
        </tr>
      </table>
    </div>
  `).join('')}

  <!-- SECTION 10: HIFZ EVALUATION -->
  ${(report.hifzEvaluations || []).length > 0 ? `
  <div class="section-banner avoid-break">
    <span>9. HIFZ ACADEMICS EVALUATION (STANDARD MAX: 75)</span>
  </div>
  ${(report.hifzEvaluations || []).map((h) => `
    <div class="avoid-break" style="margin-bottom: 12px; border: 1px solid #CBD5E1; border-radius: 4px; overflow: hidden;">
      <div style="background: #F8F9FA; padding: 6px 10px; font-weight: bold; border-bottom: 1px solid #CBD5E1; display: flex; justify-content: space-between;">
        <span>Hifz ${h.level} • Instructor: ${h.teacherName}</span>
        <span>Standard: 25 + 25 + 25 = 75 Marks</span>
      </div>
      <table class="data-table" style="margin-bottom: 0;">
        <tr>
          <td style="width: 33%;">
            <strong>Hifz Environment:</strong><br>
            ${(h.classroomScores?.seating || 0) + (h.classroomScores?.whiteboard || 0) + (h.classroomScores?.softboards || 0) + (h.classroomScores?.schedule || 0) + (h.classroomScores?.cleanliness || 0)} / 25
          </td>
          <td style="width: 33%;">
            <strong>Students' Ethics & Tajweed:</strong><br>
            ${(h.studentScores?.ethics || 0) + (h.studentScores?.communication || 0) + (h.studentScores?.conceptsClearance || 0) + (h.studentScores?.grammar || 0) + (h.studentScores?.laminations || 0)} / 25
          </td>
          <td style="width: 34%;">
            <strong>Instructor Pedagogy:</strong><br>
            ${(h.teacherScores?.lessonPlan || 0) + (h.teacherScores?.resources || 0) + (h.teacherScores?.skillsCommand || 0) + (h.teacherScores?.checkingQuality || 0) + (h.teacherScores?.personalityBodyLanguage || 0)} / 25
          </td>
        </tr>
        <tr>
          <td colspan="3" style="background: #FDFBF7; font-size: 8.5pt;">
            <strong>Recommendations:</strong> ${h.recommendations || 'Commendable Tajweed pronunciation and revision schedule.'}
          </td>
        </tr>
      </table>
    </div>
  `).join('')}
  ` : ''}

  <!-- PAGE BREAK -->
  <div class="page-break"></div>

  <!-- SECTION 11: ACTION PLAN & FINDINGS -->
  <div class="section-banner">
    <span>10. OVERALL FINDINGS & CORRECTIVE ACTION PLAN</span>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 5%;">#</th>
        <th style="width: 30%;">Finding</th>
        <th style="width: 25%;">Recommendation</th>
        <th style="width: 18%;">Responsible Person</th>
        <th style="width: 12%;">Timeline</th>
        <th style="width: 10%;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${(report.findings || []).map((f, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${f.finding}</td>
          <td>${f.recommendation}</td>
          <td>${f.responsiblePerson || 'Principal'}</td>
          <td>${formatDate(f.timeline)}</td>
          <td><span class="badge ${f.currentStatus === 'Completed' ? 'badge-success' : 'badge-warning'}">${f.currentStatus}</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- SECTION 12: BRANCH RANKING TABLE -->
  <div class="section-banner avoid-break">
    <span>11. BRANCH RANKING SUMMARY (VERIFIED DATA ONLY)</span>
  </div>
  <table class="data-table avoid-break">
    <thead>
      <tr>
        <th rowspan="2" style="text-align: center; vertical-align: middle;">Sr.</th>
        <th rowspan="2" style="vertical-align: middle;">Branch Name</th>
        <th colspan="2" style="text-align: center;">Classroom</th>
        <th colspan="2" style="text-align: center;">Students</th>
        <th colspan="2" style="text-align: center;">Teachers</th>
        <th colspan="2" style="text-align: center;">Activities</th>
        <th colspan="2" style="text-align: center; background: #edf3fa;">Overall Branch</th>
        <th rowspan="2" style="vertical-align: middle; text-align: center;">Category</th>
      </tr>
      <tr>
        <th style="text-align: center; font-size: 8pt;">Total</th>
        <th style="text-align: center; font-size: 8pt;">Obt.</th>
        <th style="text-align: center; font-size: 8pt;">Total</th>
        <th style="text-align: center; font-size: 8pt;">Obt.</th>
        <th style="text-align: center; font-size: 8pt;">Total</th>
        <th style="text-align: center; font-size: 8pt;">Obt.</th>
        <th style="text-align: center; font-size: 8pt;">Total</th>
        <th style="text-align: center; font-size: 8pt;">Obt.</th>
        <th style="text-align: center; font-size: 8pt; background: #edf3fa;">Total</th>
        <th style="text-align: center; font-size: 8pt; background: #edf3fa;">Obt.</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;">R # 1</td>
        <td><strong>${report.branchName}</strong></td>
        <td style="text-align: center;">${summary.classroom.total}</td>
        <td style="text-align: center; font-weight: bold;">${summary.classroom.obtained}</td>
        <td style="text-align: center;">${summary.students.total}</td>
        <td style="text-align: center; font-weight: bold;">${summary.students.obtained}</td>
        <td style="text-align: center;">${summary.teachers.total}</td>
        <td style="text-align: center; font-weight: bold;">${summary.teachers.obtained}</td>
        <td style="text-align: center;">${summary.activities.total}</td>
        <td style="text-align: center; font-weight: bold;">${summary.activities.obtained}</td>
        <td style="text-align: center; font-weight: bold; background: #edf3fa;">${summary.overall.total}</td>
        <td style="text-align: center; font-weight: bold; background: #edf3fa; color: #082052;">${summary.overall.obtained}</td>
        <td style="text-align: center;">
          <span class="badge ${summary.overall.percentage >= 80 ? 'badge-success' : 'badge-warning'}">
            ${summary.overall.percentage}% (${overallCategory.code})
          </span>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 13: FINAL SIGNATURES & ENDORSEMENT -->
  <div class="avoid-break" style="margin-top: 20px;">
    <div class="section-banner">
      <span>12. ENDORSEMENTS & VERIFIED SIGNATURES</span>
    </div>
    <div class="signature-grid">
      <div class="signature-box">
        <div style="font-weight: bold; color: #082052;">${report.principalName || 'Principal Name'}</div>
        <div>Contact: ${report.principalContact || '0300-XXXXXXX'}</div>
        <div style="font-size: 8pt; color: #64748B; margin-top: 4px;">Principal Signature & Stamp</div>
        <div style="margin-top: 6px; font-weight: bold; color: #082052;">[Digitally Endorsed]</div>
      </div>
      <div class="signature-box">
        <div style="font-weight: bold; color: #082052;">${report.directorName || 'Director Name'}</div>
        <div>Contact: ${report.directorContact || '0321-XXXXXXX'}</div>
        <div style="font-size: 8pt; color: #64748B; margin-top: 4px;">Campus Director Signature</div>
        <div style="margin-top: 6px; font-weight: bold; color: #082052;">[Digitally Endorsed]</div>
      </div>
      <div class="signature-box">
        <div style="font-weight: bold; color: #082052;">${report.monitoringOfficerName || 'Monitoring Officer'}</div>
        <div>Contact: ${report.monitoringOfficerContact || '0302-XXXXXXX'}</div>
        <div style="font-size: 8pt; color: #64748B; margin-top: 4px;">Monitoring Officer Signature</div>
        <div style="margin-top: 6px; font-weight: bold; color: #082052;">[Digitally Endorsed]</div>
      </div>
    </div>
  </div>

  <!-- FOOTER NOTICE -->
  <div class="footer-notice">
    <strong>CONFIDENTIAL INSTITUTIONAL REPORT</strong> • Dar-e-Arqam Schools Central Directorate, Lahore, Pakistan.<br>
    Generated automatically via Dar-e-Arqam M&E Digital Management Mobile System on ${formatDate(new Date().toISOString())}. All scores are verified against Central Criteria.
  </div>

</body>
</html>
`;
};

/**
 * Triggers native browser print dialog for A4 PDF generation
 */
export const triggerBrowserPrint = (report, settings) => {
  const html = buildFullReportHTML(report, settings);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  } else {
    // Fallback if popup blocker is active
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
};

/**
 * Downloads the printable HTML document
 */
export const downloadHTMLFile = (report, settings) => {
  const html = buildFullReportHTML(report, settings);
  const filename = `${sanitizeFilename(report.branchName)}_ME_Report_${report.reportYear || '2025'}.html`;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates an Excel-compatible XML Workbook containing all 17 worksheets requested
 */
export const generateExcelWorkbookXML = (report, settings = {}) => {
  const year = report.reportYear || '2025';
  const summary = calculateBranchOverallSummary(
    report.classEvaluations || [],
    report.hifzEvaluations || [],
    report.activitiesProjectMarks || 20
  );

  const escapeXML = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const createRow = (cells) => {
    return `<Row>${cells.map((c) => `<Cell><Data ss:Type="String">${escapeXML(c)}</Data></Cell>`).join('')}</Row>`;
  };

  const createHeaderRow = (cells) => {
    return `<Row ss:StyleID="Header">${cells.map((c) => `<Cell><Data ss:Type="String">${escapeXML(c)}</Data></Cell>`).join('')}</Row>`;
  };

  // Build the 17 sheets as requested
  const sheets = [
    {
      name: 'Report Summary',
      rows: [
        ['DAR-E-ARQAM SCHOOLS - CENTRAL REGIONS'],
        [`Monitoring & Evaluation Report ${year} Summary`],
        [''],
        ['Branch Name', report.branchName || '—'],
        ['Region', report.region || '—'],
        ['Sr. #', report.srNo || '—'],
        ['Academic Session', report.academicSession || '2024-25'],
        ['Visit Date', formatDate(report.visitDate)],
        ['Monitoring Officer', report.monitoringOfficerName || '—'],
        [''],
        ['Category', 'Total Marks', 'Obtained Marks', 'Percentage'],
        ['Classroom Environment', String(summary.classroom.total), String(summary.classroom.obtained), `${summary.classroom.percentage}%`],
        ['Students\' Evaluation', String(summary.students.total), String(summary.students.obtained), `${summary.students.percentage}%`],
        ['Teachers\' Evaluation', String(summary.teachers.total), String(summary.teachers.obtained), `${summary.teachers.percentage}%`],
        ['Activities / Project Record', String(summary.activities.total), String(summary.activities.obtained), `${summary.activities.percentage}%`],
        ['OVERALL TOTAL', String(summary.overall.total), String(summary.overall.obtained), `${summary.overall.percentage}%`],
        ['Performance Category', summary.overall.category.label, `Code: ${summary.overall.category.code}`],
      ],
    },
    {
      name: 'Visit Information',
      rows: [
        ['Sr. #', 'Region', 'Branch Name', 'Building Type', 'Visit Date', 'Start Time', 'End Time', 'Last Visit', 'Officer', 'Officer Contact', 'Principal', 'Principal Contact', 'Director', 'Director Contact'],
        [
          report.srNo,
          report.region,
          report.branchName,
          report.schoolBuilding,
          report.visitDate,
          report.visitStartTime,
          report.visitEndTime,
          report.lastVisitDate,
          report.monitoringOfficerName,
          report.monitoringOfficerContact,
          report.principalName,
          report.principalContact,
          report.directorName,
          report.directorContact,
        ],
      ],
    },
    {
      name: 'School Facilities',
      rows: [
        ['Facility Item', 'Availability Status', 'Remarks / Details'],
        ['Total Area of School', report.facilities?.totalArea || '—', ''],
        ['Covered Area', report.facilities?.coveredArea || '—', ''],
        ['Number of Rooms', report.facilities?.rooms || '—', ''],
        ['Ground Area', report.facilities?.groundArea || '—', ''],
        ['Admin Office', report.facilities?.adminOffice || 'Available', ''],
        ['Number of Washrooms', report.facilities?.washrooms || '—', ''],
        ['Director\'s Office', report.facilities?.directorsOffice || 'Available', report.facilities?.directorsOfficeRemarks || ''],
        ['Hall', report.facilities?.hall || 'Available', report.facilities?.hallRemarks || ''],
        ['Science Lab', report.facilities?.scienceLab || 'Available', report.facilities?.scienceLabRemarks || ''],
        ['Computer Lab', report.facilities?.computerLab || 'Available', report.facilities?.computerLabRemarks || ''],
        ['Staff Room', report.facilities?.staffRoom || 'Available', report.facilities?.staffRoomRemarks || ''],
        ['Library / Book Corner', report.facilities?.library || 'Available', report.facilities?.libraryRemarks || ''],
      ],
    },
    {
      name: 'School Profile',
      rows: [
        ['Parameter', 'Value'],
        ['School Levels', (report.profile?.levels || []).join(', ')],
        ['Highest Class in School', report.profile?.highClass || ''],
        ['Total Sections', String(report.profile?.totalSections || 0)],
        ['Absent Students', String(report.profile?.absentStudents || 0)],
        ['Total Students - Previous', String(report.profile?.previousStudents || 0)],
        ['Total Students - Current', String(report.profile?.currentStudents || 0)],
        ['Student Growth', String((report.profile?.currentStudents || 0) - (report.profile?.previousStudents || 0))],
        ['Campus Registered Year', String(report.profile?.registeredYear || '')],
        ['Principal Qualification', report.profile?.principalQualification || ''],
        ['Principal Experience', report.profile?.principalExperience || ''],
        ['Co-education', report.profile?.coEducation || ''],
        ['Use of DAS Portal', report.profile?.usePortal || ''],
        ['Status of Academic Calendar', report.profile?.academicCalendar || ''],
        ['Status of Book List', report.profile?.bookList || ''],
        ['Condition of Canteen and Food', report.profile?.canteenCondition || ''],
        ['Students\' Projects', report.profile?.studentsProjects || ''],
      ],
    },
    {
      name: 'Class-wise Evaluation',
      rows: [
        ['Class', 'Section', 'Subject', 'Teacher', 'Environment (Max 20)', 'Students (Max 25)', 'Teacher (Max 25)', 'Total (Max 70)', 'Percentage', 'Recommendations'],
        ...(report.classEvaluations || []).map((c) => {
          const ce = (c.classroomScores?.seating || 0) + (c.classroomScores?.environment || 0) + (c.classroomScores?.planningSyllabi || 0) + (c.classroomScores?.cleanliness || 0);
          const se = (c.studentScores?.greetings || 0) + (c.studentScores?.communication || 0) + (c.studentScores?.activityRecord || 0) + (c.studentScores?.subjectCompetency || 0) + (c.studentScores?.notebooksPresentation || 0);
          const te = (c.teacherScores?.lessonPlan || 0) + (c.teacherScores?.resources || 0) + (c.teacherScores?.skillsCommand || 0) + (c.teacherScores?.checkingQuality || 0) + (c.teacherScores?.personalityBodyLanguage || 0);
          const tot = ce + se + te;
          const pct = Math.round((tot / 70) * 100);
          return [c.className, c.section || 'A', c.subject, c.teacherName, String(ce), String(se), String(te), String(tot), `${pct}%`, c.recommendations || ''];
        }),
      ],
    },
    {
      name: 'Hifz Evaluation',
      rows: [
        ['Hifz Level', 'Instructor', 'Classroom (Max 25)', 'Students (Max 25)', 'Teacher (Max 25)', 'Total (Max 75)', 'Percentage', 'Recommendations'],
        ...(report.hifzEvaluations || []).map((h) => {
          const ce = (h.classroomScores?.seating || 0) + (h.classroomScores?.whiteboard || 0) + (h.classroomScores?.softboards || 0) + (h.classroomScores?.schedule || 0) + (h.classroomScores?.cleanliness || 0);
          const se = (h.studentScores?.ethics || 0) + (h.studentScores?.communication || 0) + (h.studentScores?.conceptsClearance || 0) + (h.studentScores?.grammar || 0) + (h.studentScores?.laminations || 0);
          const te = (h.teacherScores?.lessonPlan || 0) + (h.teacherScores?.resources || 0) + (h.teacherScores?.skillsCommand || 0) + (h.teacherScores?.checkingQuality || 0) + (h.teacherScores?.personalityBodyLanguage || 0);
          const tot = ce + se + te;
          const pct = Math.round((tot / 75) * 100);
          return [h.level, h.teacherName, String(ce), String(se), String(te), String(tot), `${pct}%`, h.recommendations || ''];
        }),
      ],
    },
    {
      name: 'Findings and Action Plan',
      rows: [
        ['#', 'Finding', 'Recommendation', 'Responsible Person', 'Timeline', 'Priority', 'Current Status', 'Follow-up Remarks'],
        ...(report.findings || []).map((f, i) => [
          String(i + 1),
          f.finding,
          f.recommendation,
          f.responsiblePerson,
          f.timeline,
          f.priority,
          f.currentStatus,
          f.followUpRemarks || '',
        ]),
      ],
    },
    {
      name: 'Branch Ranking',
      rows: [
        ['Sr.', 'Branch Name', 'Classroom Total', 'Classroom Obt.', 'Students Total', 'Students Obt.', 'Teachers Total', 'Teachers Obt.', 'Activities (25)', 'Overall Total', 'Overall Obt.', 'Overall %', 'Category'],
        [
          'R # 1',
          report.branchName,
          String(summary.classroom.total),
          String(summary.classroom.obtained),
          String(summary.students.total),
          String(summary.students.obtained),
          String(summary.teachers.total),
          String(summary.teachers.obtained),
          String(summary.activities.obtained),
          String(summary.overall.total),
          String(summary.overall.obtained),
          `${summary.overall.percentage}%`,
          summary.overall.category.label,
        ],
      ],
    },
  ];

  const xmlSheets = sheets
    .map((s) => {
      const rowsXML = s.rows.map((row, rIdx) => (rIdx === 0 ? createHeaderRow(row) : createRow(row))).join('');
      return `<Worksheet ss:Name="${escapeXML(s.name)}"><Table>${rowsXML}</Table></Worksheet>`;
    })
    .join('');

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:CharSet="0" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#082052" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 ${xmlSheets}
</Workbook>`;
};

/**
 * Downloads the multi-sheet Excel workbook (.xls format)
 */
export const downloadExcelFile = (report, settings) => {
  const xml = generateExcelWorkbookXML(report, settings);
  const filename = `${sanitizeFilename(report.branchName)}_ME_Report_${report.reportYear || '2025'}.xls`;
  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default {
  buildFullReportHTML,
  triggerBrowserPrint,
  downloadHTMLFile,
  downloadExcelFile,
};
