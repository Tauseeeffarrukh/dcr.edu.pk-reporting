// Official Report Detail Screen & Institutional Sheet Viewer
// Redesigned with Dusk Contrast Palette: #082052 (Navy), #ffffff (White), #C59B27 (Cyan), #222d3d (Charcoal)
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Edit3, 
  CheckCircle2, 
  RotateCcw,
  Calendar,
  Building2,
  Users,
  Award
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { formatDate, formatTime } from '../utils/dateUtils';
import { calculateTotalScores } from '../utils/scoreCalculator';
import { getPerformanceCategory } from '../utils/performanceCategories';
import { REPORT_STATUSES, USER_ROLES } from '../constants/reportStatuses';
import exportService from '../services/exportService';

export const ReportDetailScreen = ({
  report,
  currentUser,
  onBack,
  onEdit,
  onUpdateStatus,
  settings,
}) => {
  const [returnRemarks, setReturnRemarks] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);

  if (!report) return null;

  // Recalculate live summary scores
  const summary = calculateTotalScores(report);
  const overallCategory = getPerformanceCategory(summary.overall.percentage);

  // Authority check: Can this user approve/return this report?
  const canApprove = [
    USER_ROLES.REGIONAL_DIRECTOR,
    USER_ROLES.HEAD_OFFICE_ADMIN,
    USER_ROLES.CENTRAL_DIRECTORATE,
  ].includes(currentUser.role);

  return (
    <div className="p-3 sm:p-5 max-w-5xl mx-auto space-y-4 pb-20">
      
      {/* Top Bar with Navigation and Export Buttons */}
      <div className="bg-white dark:bg-[#082052] border border-[#e2d5c1] dark:border-[#1a436e] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg border border-[#e2d5c1] dark:border-[#1a436e] hover:bg-[#e8f4fc] dark:hover:bg-[#0e2e50] text-[#222d3d] dark:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-[#082052] dark:text-[#C59B27] bg-[#edf3fa] dark:bg-[#041029] px-2 py-0.5 rounded border border-[#c0d4ed] dark:border-[#1a436e]">
                {report.srNo}
              </span>
              <StatusBadge status={report.status} size="sm" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[#222d3d] dark:text-slate-100 mt-0.5">
              {report.branchName}
            </h2>
          </div>
        </div>

        {/* Action & Export Suite */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onEdit(report)}
            className="px-3 py-1.5 rounded-lg border border-[#e2d5c1] dark:border-[#1a436e] hover:bg-[#f8fafc] dark:hover:bg-[#081d33] text-[#222d3d] dark:text-slate-200 text-xs font-semibold flex items-center space-x-1"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => exportService.triggerBrowserPrint(report, settings)}
            className="px-3 py-1.5 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-white text-xs font-bold flex items-center space-x-1 shadow-xs transition-all"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Print PDF</span>
          </button>

          <button
            onClick={() => exportService.downloadExcelFile(report, settings)}
            className="px-3 py-1.5 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-white text-xs font-bold flex items-center space-x-1 shadow-xs transition-all"
            title="Download Excel Workbook"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => exportService.downloadHTMLFile(report, settings)}
            className="px-3 py-1.5 rounded-lg border border-[#082052] dark:border-[#C59B27] hover:bg-[#e8f4fc] dark:hover:bg-[#0e2e50] text-[#082052] dark:text-[#C59B27] text-xs font-bold flex items-center space-x-1"
            title="Download HTML Document"
          >
            <Download className="w-3.5 h-3.5 text-[#C59B27]" />
            <span className="hidden sm:inline">HTML</span>
          </button>
        </div>
      </div>

      {/* Role-based Workflow Approval Bar */}
      {canApprove && report.status !== REPORT_STATUSES.APPROVED && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
              Administrative Review Action Required
            </div>
            <div className="text-[11px] text-amber-800 dark:text-amber-300">
              As {currentUser.role}, you can approve this report or return it to the Monitoring Officer with corrective instructions.
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowReturnModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-rose-300 text-rose-700 text-xs font-bold flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Return for Edit</span>
            </button>
            <button
              onClick={() => onUpdateStatus(report.id, REPORT_STATUSES.APPROVED)}
              className="px-4 py-1.5 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-white text-xs font-black flex items-center space-x-1 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Approve Report</span>
            </button>
          </div>
        </div>
      )}

      {/* Return Remarks Dialog */}
      {showReturnModal && (
        <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/50 space-y-2">
          <label className="text-xs font-bold text-rose-900 dark:text-rose-200">
            Instructions / Reasons for Returning Report:
          </label>
          <textarea
            value={returnRemarks}
            onChange={(e) => setReturnRemarks(e.target.value)}
            rows={2}
            placeholder="Specify what requires correction..."
            className="w-full text-xs p-2 rounded-lg border border-rose-300 bg-white dark:bg-[#082052] text-[#222d3d] dark:text-slate-100"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowReturnModal(false)}
              className="px-3 py-1 rounded bg-slate-200 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onUpdateStatus(report.id, REPORT_STATUSES.RETURNED, returnRemarks);
                setShowReturnModal(false);
              }}
              className="px-4 py-1 rounded bg-rose-700 text-white text-xs font-bold"
            >
              Confirm Return
            </button>
          </div>
        </div>
      )}

      {/* INSTITUTIONAL REPORT SHEET CONTAINER */}
      <div className="bg-white dark:bg-[#082052] rounded-2xl border border-[#e2d5c1] dark:border-[#1a436e] shadow-md p-4 sm:p-8 space-y-6">
        
        {/* Document Header Banner */}
        <div className="border-b-2 border-[#082052] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-xl bg-[#082052] text-white border border-[#C59B27]/40 flex flex-col items-center justify-center font-black shadow-xs shrink-0">
              <span className="text-base text-[#C59B27] leading-none font-black">DAS</span>
              <span className="text-[8px] text-white tracking-widest mt-0.5 font-bold">CENTRAL</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#082052] dark:text-[#C59B27] tracking-tight leading-none">
                DAR-E-ARQAM SCHOOLS
              </h1>
              <p className="text-xs text-[#5a677a] dark:text-slate-300 font-semibold mt-1">
                Central Regions · "Success in this World & the World Hereafter"
              </p>
              <h3 className="text-sm font-bold text-[#222d3d] dark:text-slate-200 mt-1">
                {report.reportTitle || `Monitoring & Evaluation Report ${report.reportYear || '2025'}`}
              </h3>
            </div>
          </div>

          <div className="text-right text-xs text-[#5a677a] dark:text-slate-400 space-y-0.5">
            <div><strong>Academic Session:</strong> {report.academicSession || '2024-25'}</div>
            <div><strong>Visit Date:</strong> {formatDate(report.visitDate)}</div>
            <div><strong>Timing:</strong> {formatTime(report.visitStartTime)} - {formatTime(report.visitEndTime)}</div>
          </div>
        </div>

        {/* Overall Score Highlight Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#edf3fa] dark:bg-[#041029] border border-[#c0d4ed] dark:border-[#1a436e] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#082052] dark:text-[#C59B27] uppercase tracking-wider">
              Overall Institutional Score
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#082052] dark:text-white font-mono tabular-nums">
                {summary.overall.percentage}%
              </span>
              <span className="text-sm font-bold px-2.5 py-0.5 rounded-md bg-white dark:bg-[#082052] text-[#082052] dark:text-[#C59B27] border border-[#c0d4ed] dark:border-[#1a436e]">
                Category {overallCategory.code} · {overallCategory.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#082052] border border-[#e2d5c1] dark:border-[#1a436e] text-center">
              <div className="text-slate-400 font-medium">Classroom (20)</div>
              <div className="font-extrabold text-[#082052] dark:text-[#C59B27] text-sm mt-0.5 font-mono tabular-nums">
                {summary.classroom.percentage}%
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#082052] border border-[#e2d5c1] dark:border-[#1a436e] text-center">
              <div className="text-slate-400 font-medium">Students (25)</div>
              <div className="font-extrabold text-[#082052] dark:text-[#C59B27] text-sm mt-0.5 font-mono tabular-nums">
                {summary.students.percentage}%
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#082052] border border-[#e2d5c1] dark:border-[#1a436e] text-center">
              <div className="text-slate-400 font-medium">Teachers (25)</div>
              <div className="font-extrabold text-[#082052] dark:text-[#C59B27] text-sm mt-0.5 font-mono tabular-nums">
                {summary.teachers.percentage}%
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#082052] border border-[#e2d5c1] dark:border-[#1a436e] text-center">
              <div className="text-slate-400 font-medium">Activities (25)</div>
              <div className="font-extrabold text-[#082052] dark:text-[#C59B27] text-sm mt-0.5 font-mono tabular-nums">
                {summary.activities.percentage}%
              </div>
            </div>
          </div>
        </div>

        {/* 1. Basic Visit Information */}
        <div>
          <h4 className="text-xs font-bold text-white bg-[#082052] px-3.5 py-1.5 rounded-lg uppercase tracking-wider mb-2">
            1. Basic Visit Information
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs border border-[#e2d5c1] dark:border-[#1a436e] rounded-xl p-3.5 bg-[#f8fafc]/50 dark:bg-[#081d33]">
            <div><span className="text-slate-400">Sr. #:</span> <span className="font-bold font-mono">{report.srNo}</span></div>
            <div><span className="text-slate-400">Region:</span> <span className="font-bold">{report.region}</span></div>
            <div><span className="text-slate-400">Branch:</span> <span className="font-bold">{report.branchName}</span></div>
            <div><span className="text-slate-400">Building:</span> <span className="font-bold">{report.schoolBuilding}</span></div>
            <div><span className="text-slate-400">Principal:</span> <span className="font-bold">{report.principalName}</span></div>
            <div><span className="text-slate-400">Contact:</span> <span>{report.principalContact}</span></div>
            <div><span className="text-slate-400">Director:</span> <span className="font-bold">{report.directorName}</span></div>
            <div><span className="text-slate-400">Contact:</span> <span>{report.directorContact}</span></div>
            <div><span className="text-slate-400">Officer:</span> <span className="font-bold">{report.monitoringOfficerName}</span></div>
            <div><span className="text-slate-400">Officer Contact:</span> <span>{report.monitoringOfficerContact}</span></div>
            <div><span className="text-slate-400">Last Visit:</span> <span>{formatDate(report.lastVisitDate)}</span></div>
            <div><span className="text-slate-400">Status:</span> <span className="font-bold">{report.status}</span></div>
          </div>
        </div>

        {/* 2. Facilities */}
        <div>
          <h4 className="text-xs font-bold text-white bg-[#082052] px-3.5 py-1.5 rounded-lg uppercase tracking-wider mb-2">
            2. School Building and Facilities
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs border border-[#e2d5c1] dark:border-[#1a436e] rounded-xl p-3.5 mb-2 bg-[#f8fafc]/50 dark:bg-[#081d33]">
            <div>Total Area: <strong>{report.facilities?.totalArea || '—'}</strong></div>
            <div>Covered Area: <strong>{report.facilities?.coveredArea || '—'}</strong></div>
            <div>Total Rooms: <strong>{report.facilities?.rooms || '—'}</strong></div>
            <div>Ground Area: <strong>{report.facilities?.groundArea || '—'}</strong></div>
            <div>Admin Office: <strong>{report.facilities?.adminOffice || 'Available'}</strong></div>
            <div>Washrooms: <strong>{report.facilities?.washrooms || '—'}</strong></div>
          </div>

          <table className="w-full text-xs text-left border border-[#e2d5c1] dark:border-[#1a436e] rounded-xl overflow-hidden">
            <thead className="bg-[#f8fafc] dark:bg-[#081d33] text-[#5a677a] dark:text-slate-300 font-bold">
              <tr>
                <th className="p-2.5">Facility</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2d5c1] dark:divide-[#1a436e]">
              {[
                { name: "Director's Office", key: 'directorsOffice' },
                { name: 'Multi-purpose Hall', key: 'hall' },
                { name: 'Science Laboratory', key: 'scienceLab' },
                { name: 'Computer Laboratory', key: 'computerLab' },
                { name: 'Staff Room', key: 'staffRoom' },
                { name: 'Library / Book Corner', key: 'library' },
              ].map((f) => (
                <tr key={f.key}>
                  <td className="p-2.5 font-medium">{f.name}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#C59B27] font-bold">
                      {report.facilities?.[f.key] || 'Available'}
                    </span>
                  </td>
                  <td className="p-2.5 text-[#5a677a] dark:text-slate-400">{report.facilities?.[`${f.key}Remarks`] || 'Equipped as per standard'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. School Profile & Strength */}
        <div>
          <h4 className="text-xs font-bold text-white bg-[#082052] px-3.5 py-1.5 rounded-lg uppercase tracking-wider mb-2">
            3. Student & Staff Strength
          </h4>
          <table className="w-full text-xs text-left border border-[#e2d5c1] dark:border-[#1a436e] rounded-xl overflow-hidden">
            <thead className="bg-[#f8fafc] dark:bg-[#081d33] font-bold text-[#5a677a] dark:text-slate-300">
              <tr>
                <th className="p-2.5">Metric</th>
                <th className="p-2.5 text-center">ECE</th>
                <th className="p-2.5 text-center">Primary</th>
                <th className="p-2.5 text-center">Middle</th>
                <th className="p-2.5 text-center">Secondary</th>
                <th className="p-2.5 text-center">Hifz</th>
                <th className="p-2.5 text-center bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#C59B27] font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2d5c1] dark:divide-[#1a436e] font-mono tabular-nums">
              <tr>
                <td className="p-2.5 font-bold font-sans">Students</td>
                <td className="p-2.5 text-center">{report.strength?.studentsECE || 0}</td>
                <td className="p-2.5 text-center">{report.strength?.studentsPrimary || 0}</td>
                <td className="p-2.5 text-center">{report.strength?.studentsMiddle || 0}</td>
                <td className="p-2.5 text-center">{report.strength?.studentsSecondary || 0}</td>
                <td className="p-2.5 text-center">{report.strength?.studentsHifz || 0}</td>
                <td className="p-2.5 text-center font-bold bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#C59B27]">{report.strength?.totalStudents || 0}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold font-sans">Staff</td>
                <td className="p-2.5 text-center">{report.strength?.staffECE || 0}</td>
                <td className="p-2.5 text-center">{report.strength?.staffPrimary || 0}</td>
                <td className="p-2.5 text-center">{report.strength?.staffMiddle || 0}</td>
                <td className="p-2.5 text-center">{report.strength?.staffSecondary || 0}</td>
                <td className="p-2.5 text-center">{report.strength?.staffHifz || 0}</td>
                <td className="p-2.5 text-center font-bold bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#C59B27]">{report.strength?.totalStaff || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. Class-wise Evaluations */}
        <div>
          <h4 className="text-xs font-bold text-white bg-[#082052] px-3.5 py-1.5 rounded-lg uppercase tracking-wider mb-2">
            4. Class-wise Academic Evaluations (Max 70)
          </h4>
          <div className="space-y-3">
            {(report.classEvaluations || []).map((cls, idx) => {
              const ce = (cls.classroomScores?.seating || 0) + (cls.classroomScores?.environment || 0) + (cls.classroomScores?.planningSyllabi || 0) + (cls.classroomScores?.cleanliness || 0);
              const st = (cls.studentScores?.greetings || 0) + (cls.studentScores?.communication || 0) + (cls.studentScores?.activityRecord || 0) + (cls.studentScores?.subjectCompetency || 0) + (cls.studentScores?.notebooksPresentation || 0);
              const tc = (cls.teacherScores?.lessonPlan || 0) + (cls.teacherScores?.resources || 0) + (cls.teacherScores?.skillsCommand || 0) + (cls.teacherScores?.checkingQuality || 0) + (cls.teacherScores?.personalityBodyLanguage || 0);
              const tot = ce + st + tc;
              const pct = Math.round((tot / 70) * 100);

              return (
                <div key={idx} className="p-3.5 rounded-xl border border-[#e2d5c1] dark:border-[#1a436e] bg-[#f8fafc]/50 dark:bg-[#081d33] text-xs">
                  <div className="flex items-center justify-between font-bold mb-2">
                    <span className="text-[#222d3d] dark:text-slate-100">{cls.className} ({cls.section || 'A'}) · {cls.subject} · Teacher: {cls.teacherName}</span>
                    <span className="text-[#082052] dark:text-[#C59B27] font-mono tabular-nums font-bold">{tot} / 70 ({pct}%)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] mb-2 font-mono tabular-nums">
                    <div>Classroom: <strong>{ce}/20</strong></div>
                    <div>Students: <strong>{st}/25</strong></div>
                    <div>Teachers: <strong>{tc}/25</strong></div>
                  </div>
                  <div className="text-[#5a677a] dark:text-slate-400 italic">
                    Remarks: {cls.recommendations || 'High instructional alignment maintained.'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Corrective Action Plan */}
        <div>
          <h4 className="text-xs font-bold text-white bg-[#082052] px-3.5 py-1.5 rounded-lg uppercase tracking-wider mb-2">
            5. Corrective Action Plan
          </h4>
          <table className="w-full text-xs text-left border border-[#e2d5c1] dark:border-[#1a436e] rounded-xl overflow-hidden">
            <thead className="bg-[#f8fafc] dark:bg-[#081d33] font-bold text-[#5a677a] dark:text-slate-300">
              <tr>
                <th className="p-2.5">#</th>
                <th className="p-2.5">Finding</th>
                <th className="p-2.5">Recommendation</th>
                <th className="p-2.5">Responsible</th>
                <th className="p-2.5">Timeline</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2d5c1] dark:divide-[#1a436e]">
              {(report.findings || []).map((f, i) => (
                <tr key={i}>
                  <td className="p-2.5 font-bold font-mono">{i + 1}</td>
                  <td className="p-2.5">{f.finding}</td>
                  <td className="p-2.5">{f.recommendation}</td>
                  <td className="p-2.5 font-medium">{f.responsiblePerson}</td>
                  <td className="p-2.5 font-mono">{formatDate(f.timeline)}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.currentStatus === 'Completed' ? 'bg-[#edf3fa] text-[#082052] dark:bg-[#041029] dark:text-[#C59B27]' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {f.currentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 6. Endorsements & Verified Signatures */}
        <div>
          <h4 className="text-xs font-bold text-white bg-[#082052] px-3.5 py-1.5 rounded-lg uppercase tracking-wider mb-3">
            6. Endorsements & Digital Signatures
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
            <div className="p-3.5 border border-[#e2d5c1] dark:border-[#1a436e] rounded-xl bg-[#f8fafc]/50 dark:bg-[#081d33]">
              <div className="font-bold text-[#222d3d] dark:text-slate-200">{report.principalName || 'Principal'}</div>
              <div className="text-[10px] text-slate-400">Principal Stamp & Signature</div>
              <div className="mt-2 text-[#082052] dark:text-[#C59B27] font-bold font-mono">[Digitally Verified]</div>
            </div>
            <div className="p-3.5 border border-[#e2d5c1] dark:border-[#1a436e] rounded-xl bg-[#f8fafc]/50 dark:bg-[#081d33]">
              <div className="font-bold text-[#222d3d] dark:text-slate-200">{report.directorName || 'Director'}</div>
              <div className="text-[10px] text-slate-400">Campus Director</div>
              <div className="mt-2 text-[#082052] dark:text-[#C59B27] font-bold font-mono">[Digitally Verified]</div>
            </div>
            <div className="p-3.5 border border-[#e2d5c1] dark:border-[#1a436e] rounded-xl bg-[#f8fafc]/50 dark:bg-[#081d33]">
              <div className="font-bold text-[#222d3d] dark:text-slate-200">{report.monitoringOfficerName || 'Monitoring Officer'}</div>
              <div className="text-[10px] text-slate-400">Monitoring Officer</div>
              <div className="mt-2 text-[#082052] dark:text-[#C59B27] font-bold font-mono">[Digitally Verified]</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReportDetailScreen;
