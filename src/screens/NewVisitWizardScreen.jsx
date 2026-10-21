// 14-Step Monitoring Visit Evaluation Wizard
import React, { useState, useEffect } from 'react';
import { 
  Save, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  Users, 
  Award, 
  Plus, 
  Trash2,
  Calendar,
  Clock,
  Send,
  Eye
} from 'lucide-react';
import { EVALUATION_STEPS } from '../constants/evaluationSections';
import { 
  BUILDING_TYPES, 
  LEVELS_OPTIONS, 
  RATING_OPTIONS, 
  UNIVERSAL_RANKING_SCALE 
} from '../constants/ratingOptions';
import { REPORT_STATUSES, USER_ROLES } from '../constants/reportStatuses';
import { 
  calculateClassroomScore, 
  calculateStudentsScore, 
  calculateTeacherScore, 
  calculateBranchOverallSummary 
} from '../utils/calculations';
import { getPerformanceCategory } from '../utils/performanceCategories';
import draftStorage from '../storage/draftStorage';

// Component imports
import ProgressBar from '../components/ProgressBar';
import SectionCard from '../components/SectionCard';
import FormInput from '../components/FormInput';
import NumericInput from '../components/NumericInput';
import SelectInput from '../components/SelectInput';
import RatingSelector from '../components/RatingSelector';
import ScoreInput from '../components/ScoreInput';
import EvidenceUploader from '../components/EvidenceUploader';
import SignaturePad from '../components/SignaturePad';
import StatusBadge from '../components/StatusBadge';

export const NewVisitWizardScreen = ({
  initialData = null,
  schools = [],
  regions = [],
  currentUser,
  onSaveReport,
  onCancel,
  onPreviewReport,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [autosaveNotice, setAutosaveNotice] = useState(false);

  // Form State initialized from initialData or new draft
  const [formData, setFormData] = useState(() => {
    if (initialData) return initialData;

    const savedDraft = draftStorage.getDraft();
    if (savedDraft?.formData) return savedDraft.formData;

    // Fresh inspection template
    return {
      id: `rep_${Date.now()}`,
      srNo: `DAS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      reportYear: '2025',
      academicSession: '2024-25',
      reportTitle: 'Monitoring & Evaluation Report 2025',
      branchName: '',
      region: regions[0]?.name || 'Lahore Central Region',
      schoolBuilding: BUILDING_TYPES[0],
      visitDate: new Date().toISOString().split('T')[0],
      visitStartTime: '08:00',
      visitEndTime: '14:00',
      lastVisitDate: '2024-03-15',
      monitoringOfficerName: currentUser?.name || 'Muhammad Salman Siddiqui',
      monitoringOfficerContact: currentUser?.phone || '0302-8877665',
      principalName: '',
      principalContact: '',
      directorName: '',
      directorContact: '',
      status: REPORT_STATUSES.DRAFT,

      // Facilities (Step 2)
      facilities: {
        totalArea: '16 Kanals',
        coveredArea: '32,000 sq ft',
        rooms: 24,
        groundArea: '8 Kanals',
        adminOffice: 'Available',
        washrooms: 16,
        directorsOffice: 'Available',
        directorsOfficeRemarks: 'Fully equipped',
        hall: 'Available',
        hallRemarks: 'Multi-purpose auditorium with 300 seating',
        scienceLab: 'Available',
        scienceLabRemarks: 'Apparatus available for Physics, Chemistry, Biology',
        computerLab: 'Available',
        computerLabRemarks: '28 Core i5 PCs connected to LAN',
        staffRoom: 'Available',
        staffRoomRemarks: 'Separate lockers and seating for faculty',
        library: 'Available',
        libraryRemarks: 'Over 1,200 catalogued Islamic and contemporary books',
      },

      // Profile (Step 3)
      profile: {
        levels: ['ECE', 'Primary', 'Middle', 'Secondary', 'Hifz'],
        highClass: 'Class X (Matric)',
        totalSections: 18,
        absentStudents: 12,
        previousStudents: 620,
        currentStudents: 695,
        registeredYear: 2012,
        principalQualification: 'M.Phil Education / M.Sc Physics',
        principalExperience: '14 Years in Educational Leadership',
        coEducation: 'Yes',
        usePortal: 'Yes',
        academicCalendar: 'Followed',
        bookList: 'Followed',
        canteenCondition: 'Good',
        studentsProjects: 'Good',
      },

      // Leadership (Step 4)
      leadership: {
        directorInvolvement: 'Proactive',
        directorRemarks: 'Actively reviews academic milestones and infrastructure',
        campusCommunication: 'Proactive',
        communicationRemarks: 'Timely portal updates and circular compliance',
        principalAcademics: 'Beyond Expectation',
        principalRemarks: 'Strong pedagogy coaching and team alignment',
        meetingsParticipation: 'Active Participation',
        modelLecture: 'Beyond Expectation',
        roundsTaken: 'Satisfactory',
        professionalDevelopment: 'Beyond Expectation',
        principalRanking: 'Beyond Expectation',
      },

      // Strength (Step 5)
      strength: {
        studentsECE: 130,
        studentsPrimary: 260,
        studentsMiddle: 185,
        studentsSecondary: 90,
        studentsHifz: 30,
        totalStudents: 695,
        staffECE: 8,
        staffPrimary: 12,
        staffMiddle: 9,
        staffSecondary: 6,
        staffHifz: 2,
        totalStaff: 37,
        nonAcademicStaff: 9,
        staffTurnover: '2 (Low)',
        assemblyLayout: 'Designed',
        officialRecord: 'Well-Maintained',
        statusOfMarketing: 'Beyond Expectation',
        submissionOfPrincipalReport: 'Timely submission with proper filling',
      },

      // Presentation (Step 6)
      presentation: {
        displayVisionMission: 'Good display',
        securitySystem: 'Good',
        principalOffice: 'Good',
        discipline: 'Excellent',
        academicDressCode: 'Followed',
        academicStaffConduct: 'Excellent',
        nonAcademicDressCode: 'Followed',
        nonAcademicStaffConduct: 'Good',
        statusOfSoftBoard: 'Excellent',
        cleanliness: 'Excellent',
      },

      // Exams (Step 7)
      exams: {
        dateSheetSchedule: 'Followed',
        papers: 'Followed',
        teachersDuties: 'Announced',
        studentsShuffling: 'Shuffled',
        teachersVigilance: 'Vigilant',
        recheckingSchedule: 'Available',
        whiteboards: 'Updated',
        resultDay: 'Prepared',
        examPaperChanges: 'Approved from Head office',
        observation: 'Exams conducted in strict compliance with Central Controller guidelines.',
      },

      // Class Evaluations (Step 8)
      classEvaluations: [
        {
          id: 'cls_1',
          className: 'Class VII',
          section: 'Boys A',
          subject: 'General Science',
          teacherName: 'Sir Rizwan Ali',
          classroomScores: { seating: 5, environment: 5, planningSyllabi: 4, cleanliness: 5 },
          studentScores: { greetings: 5, communication: 4, activityRecord: 5, subjectCompetency: 4, notebooksPresentation: 5 },
          teacherScores: { lessonPlan: 5, resources: 5, skillsCommand: 5, checkingQuality: 4, personalityBodyLanguage: 5 },
          recommendations: 'Encourage inquiry-driven student questioning during experiments.',
        },
        {
          id: 'cls_2',
          className: 'Class IV',
          section: 'Girls',
          subject: 'English Grammar',
          teacherName: 'Ms. Ayesha Siddiqa',
          classroomScores: { seating: 5, environment: 4, planningSyllabi: 5, cleanliness: 5 },
          studentScores: { greetings: 5, communication: 5, activityRecord: 4, subjectCompetency: 5, notebooksPresentation: 4 },
          teacherScores: { lessonPlan: 5, resources: 4, skillsCommand: 5, checkingQuality: 5, personalityBodyLanguage: 5 },
          recommendations: 'Maintain uniform index signing and correction frequency.',
        },
      ],

      // Hifz Evaluations (Step 9)
      hifzEvaluations: [
        {
          id: 'hfz_1',
          level: 'Hifz Section II',
          teacherName: 'Qari Hafiz Abdul Rehman',
          classroomScores: { seating: 5, whiteboard: 5, softboards: 5, schedule: 5, cleanliness: 5 },
          studentScores: { ethics: 5, communication: 5, conceptsClearance: 5, grammar: 5, laminations: 5 },
          teacherScores: { lessonPlan: 5, resources: 5, skillsCommand: 5, checkingQuality: 5, personalityBodyLanguage: 5 },
          recommendations: 'Exemplary Tajweed pronunciation and revision discipline.',
        },
      ],

      // Findings & Actions (Step 11 & 12)
      findings: [
        {
          id: 'fnd_1',
          finding: 'Science lab needs 4 additional digital microscopes for Senior sections.',
          recommendation: 'Procure approved digital microscopes before second term assessments.',
          responsiblePerson: 'Campus Director & Admin Incharge',
          timeline: '2025-05-15',
          priority: 'Medium',
          currentStatus: 'In Progress',
          followUpRemarks: 'Vendor quotation submitted for approval.',
        },
        {
          id: 'fnd_2',
          finding: 'Morning assembly PA audio system has slight feedback in outer corridors.',
          recommendation: 'Install 2 auxiliary weather-proof speakers on boundary walls.',
          responsiblePerson: 'Admin Officer',
          timeline: '2025-04-30',
          priority: 'High',
          currentStatus: 'Pending',
          followUpRemarks: '',
        },
      ],

      // Evidence & Attachments (Step 13)
      evidence: [],

      // Signatures (Step 14)
      signatures: {
        principal: null,
        director: null,
        monitoringOfficer: null,
      },

      activitiesProjectMarks: 20,
    };
  });

  // Autosave periodically
  useEffect(() => {
    const timer = setInterval(() => {
      draftStorage.saveDraft(formData, currentStep);
      setAutosaveNotice(true);
      setTimeout(() => setAutosaveNotice(false), 2000);
    }, 15000);

    return () => clearInterval(timer);
  }, [formData, currentStep]);

  // When branch name is chosen from school list, prefill data if matched
  const handleSchoolSelect = (schoolName) => {
    const matchedSchool = schools.find((s) => s.branchName === schoolName);
    if (matchedSchool) {
      setFormData((prev) => ({
        ...prev,
        branchName: matchedSchool.branchName,
        region: matchedSchool.region || prev.region,
        principalName: matchedSchool.principalName || prev.principalName,
        principalContact: matchedSchool.principalContact || prev.principalContact,
        directorName: matchedSchool.directorName || prev.directorName,
        directorContact: matchedSchool.directorContact || prev.directorContact,
        schoolBuilding: matchedSchool.schoolBuilding || prev.schoolBuilding,
      }));
    } else {
      setFormData((prev) => ({ ...prev, branchName: schoolName }));
    }
  };

  // Real-time Overall Score calculation
  const overallSummary = calculateBranchOverallSummary(
    formData.classEvaluations || [],
    formData.hifzEvaluations || [],
    formData.activitiesProjectMarks || 20
  );

  const overallCategory = getPerformanceCategory(overallSummary.overall.percentage);

  // Step navigation
  const goToNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < 14) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Manual Save Draft
  const handleManualSave = () => {
    draftStorage.saveDraft(formData, currentStep);
    const updated = {
      ...formData,
      status: REPORT_STATUSES.DRAFT,
      overallScore: overallSummary.overall,
      updatedAt: new Date().toISOString(),
    };
    onSaveReport(updated);
    setAutosaveNotice(true);
    setTimeout(() => setAutosaveNotice(false), 2000);
  };

  // Final Submit to Regional Director / Admin
  const handleFinalSubmit = () => {
    const finalized = {
      ...formData,
      status: REPORT_STATUSES.SUBMITTED,
      overallScore: overallSummary.overall,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    draftStorage.clearDraft();
    onSaveReport(finalized);
  };

  return (
    <div className="pb-16">
      
      {/* Top Fixed Bar with Action Buttons */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Cancel and return"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-md">
              {formData.branchName || 'New Monitoring Visit'}
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">
              {formData.srNo}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Live Score Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-[#edf3fa] dark:bg-[#041029] border border-[#c0d4ed] dark:border-[#1a436e] px-2.5 py-1 rounded-lg">
            <span className="text-xs text-[#5a677a] dark:text-slate-300">Live Score:</span>
            <span className="text-sm font-extrabold text-[#082052] dark:text-[#C59B27] font-mono tabular-nums">
              {overallSummary.overall.percentage}%
            </span>
            <span className="text-[10px] font-bold text-[#C59B27] dark:text-[#64b5f6]">
              ({overallCategory.code})
            </span>
          </div>

          <button
            type="button"
            onClick={handleManualSave}
            className="px-3 py-1.5 rounded-lg border border-[#e2d5c1] dark:border-[#1a436e] bg-white dark:bg-[#082052] hover:bg-[#f8fafc] dark:hover:bg-[#081d33] text-[#222d3d] dark:text-slate-200 text-xs font-semibold flex items-center space-x-1"
          >
            <Save className="w-3.5 h-3.5 text-[#C59B27]" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => onPreviewReport(formData)}
            className="px-3 py-1.5 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-white text-xs font-bold flex items-center space-x-1 shadow-xs transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#C59B27]" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        completedSteps={completedSteps}
      />

      {/* Autosave Alert Toast */}
      {autosaveNotice && (
        <div className="fixed bottom-14 right-4 z-50 bg-[#082052] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center space-x-1.5 animate-in fade-in border border-[#C59B27]/40">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>Draft autosaved to device</span>
        </div>
      )}

      {/* Step Content Container */}
      <div className="max-w-4xl mx-auto p-3 sm:p-5">

        {/* STEP 1: BASIC VISIT INFORMATION */}
        {currentStep === 1 && (
          <SectionCard
            stepNumber={1}
            title="Basic Visit Information"
            subtitle="Branch identification, administrative contacts and inspection timing"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput
                label="Sr. #"
                value={formData.srNo}
                onChangeText={(val) => setFormData({ ...formData, srNo: val })}
                required
              />

              <SelectInput
                label="Region"
                value={formData.region}
                onSelect={(val) => setFormData({ ...formData, region: val })}
                options={regions.map((r) => r.name)}
                required
              />

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Branch Name <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    placeholder="Enter or select registered branch..."
                    className="flex-1 rounded-lg text-sm px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] focus:outline-none"
                  />
                  <select
                    onChange={(e) => handleSchoolSelect(e.target.value)}
                    value=""
                    className="w-36 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    <option value="" disabled>Choose Existing</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.branchName}>
                        {s.branchName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <SelectInput
                label="School Building"
                value={formData.schoolBuilding}
                onSelect={(val) => setFormData({ ...formData, schoolBuilding: val })}
                options={BUILDING_TYPES}
                required
              />

              <FormInput
                label="Visit Date"
                type="date"
                value={formData.visitDate}
                onChangeText={(val) => setFormData({ ...formData, visitDate: val })}
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <FormInput
                  label="Start Timing"
                  type="time"
                  value={formData.visitStartTime}
                  onChangeText={(val) => setFormData({ ...formData, visitStartTime: val })}
                />
                <FormInput
                  label="End Timing"
                  type="time"
                  value={formData.visitEndTime}
                  onChangeText={(val) => setFormData({ ...formData, visitEndTime: val })}
                />
              </div>

              <FormInput
                label="Last Visit Date"
                type="date"
                value={formData.lastVisitDate}
                onChangeText={(val) => setFormData({ ...formData, lastVisitDate: val })}
              />

              <FormInput
                label="Monitoring Officer Name"
                value={formData.monitoringOfficerName}
                onChangeText={(val) => setFormData({ ...formData, monitoringOfficerName: val })}
                required
              />

              <FormInput
                label="Monitoring Officer Contact"
                value={formData.monitoringOfficerContact}
                onChangeText={(val) => setFormData({ ...formData, monitoringOfficerContact: val })}
                placeholder="0300-XXXXXXX"
              />

              <FormInput
                label="Principal Name"
                value={formData.principalName}
                onChangeText={(val) => setFormData({ ...formData, principalName: val })}
                required
              />

              <FormInput
                label="Principal Contact"
                value={formData.principalContact}
                onChangeText={(val) => setFormData({ ...formData, principalContact: val })}
                placeholder="0300-XXXXXXX"
              />

              <FormInput
                label="Campus Director Name"
                value={formData.directorName}
                onChangeText={(val) => setFormData({ ...formData, directorName: val })}
                required
              />

              <FormInput
                label="Campus Director Contact"
                value={formData.directorContact}
                onChangeText={(val) => setFormData({ ...formData, directorContact: val })}
                placeholder="0321-XXXXXXX"
              />
            </div>
          </SectionCard>
        )}

        {/* STEP 2: SCHOOL BUILDING AND FACILITIES */}
        {currentStep === 2 && (
          <SectionCard
            stepNumber={2}
            title="School Building and Facilities"
            subtitle="Campus infrastructure, covered areas, laboratories and support facilities"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <FormInput
                label="Total Area of School"
                value={formData.facilities.totalArea}
                onChangeText={(val) => setFormData({ ...formData, facilities: { ...formData.facilities, totalArea: val } })}
                placeholder="e.g. 12 Kanals"
              />
              <FormInput
                label="Covered Area"
                value={formData.facilities.coveredArea}
                onChangeText={(val) => setFormData({ ...formData, facilities: { ...formData.facilities, coveredArea: val } })}
                placeholder="e.g. 24,000 sq ft"
              />
              <NumericInput
                label="Total Rooms"
                value={formData.facilities.rooms}
                onChangeValue={(val) => setFormData({ ...formData, facilities: { ...formData.facilities, rooms: val } })}
              />
              <FormInput
                label="Ground Area"
                value={formData.facilities.groundArea}
                onChangeText={(val) => setFormData({ ...formData, facilities: { ...formData.facilities, groundArea: val } })}
                placeholder="e.g. 6 Kanals"
              />
              <SelectInput
                label="Admin Office"
                value={formData.facilities.adminOffice}
                onSelect={(val) => setFormData({ ...formData, facilities: { ...formData.facilities, adminOffice: val } })}
                options={['Available', 'Not Available']}
              />
              <NumericInput
                label="Total Washrooms"
                value={formData.facilities.washrooms}
                onChangeValue={(val) => setFormData({ ...formData, facilities: { ...formData.facilities, washrooms: val } })}
              />
            </div>

            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 mt-4">
              Specialized Facilities Assessment
            </h4>

            <div className="space-y-3">
              {[
                { key: 'directorsOffice', label: "Director's Office" },
                { key: 'hall', label: 'Multi-purpose Hall' },
                { key: 'scienceLab', label: 'Science Laboratory' },
                { key: 'computerLab', label: 'Computer Laboratory' },
                { key: 'staffRoom', label: 'Staff Room' },
                { key: 'library', label: 'Library / Book Corner' },
              ].map((fac) => (
                <div key={fac.key} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-850">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {fac.label}
                    </span>
                    <RatingSelector
                      value={formData.facilities[fac.key]}
                      onSelect={(val) => setFormData({
                        ...formData,
                        facilities: { ...formData.facilities, [fac.key]: val },
                      })}
                      options={RATING_OPTIONS.FACILITY_STATUS}
                      className="mb-0"
                    />
                  </div>
                  <FormInput
                    placeholder={`Remarks regarding ${fac.label.toLowerCase()}...`}
                    value={formData.facilities[`${fac.key}Remarks`]}
                    onChangeText={(val) => setFormData({
                      ...formData,
                      facilities: { ...formData.facilities, [`${fac.key}Remarks`]: val },
                    })}
                    className="mb-0"
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* STEP 3: SCHOOL PROFILE */}
        {currentStep === 3 && (
          <SectionCard
            stepNumber={3}
            title="School Profile & Enrollment"
            subtitle="Academic levels, student strength comparison, and institutional compliance"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  School Levels Offered
                </label>
                <div className="flex flex-wrap gap-2">
                  {LEVELS_OPTIONS.map((lvl) => {
                    const isSelected = (formData.profile.levels || []).includes(lvl);
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => {
                          const nextLevels = isSelected
                            ? formData.profile.levels.filter((l) => l !== lvl)
                            : [...(formData.profile.levels || []), lvl];
                          setFormData({ ...formData, profile: { ...formData.profile, levels: nextLevels } });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'bg-[#082052] text-white border-[#082052] ring-1 ring-[#C59B27]'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              <FormInput
                label="Highest Class in School"
                value={formData.profile.highClass}
                onChangeText={(val) => setFormData({ ...formData, profile: { ...formData.profile, highClass: val } })}
                placeholder="e.g. Class X (Matric)"
              />

              <NumericInput
                label="Total Sections"
                value={formData.profile.totalSections}
                onChangeValue={(val) => setFormData({ ...formData, profile: { ...formData.profile, totalSections: val } })}
              />

              <NumericInput
                label="Total Students - Previous Year"
                value={formData.profile.previousStudents}
                onChangeValue={(val) => setFormData({ ...formData, profile: { ...formData.profile, previousStudents: val } })}
              />

              <NumericInput
                label="Total Students - Current Year"
                value={formData.profile.currentStudents}
                onChangeValue={(val) => setFormData({ ...formData, profile: { ...formData.profile, currentStudents: val } })}
              />

              <NumericInput
                label="Absent Students Today"
                value={formData.profile.absentStudents}
                onChangeValue={(val) => setFormData({ ...formData, profile: { ...formData.profile, absentStudents: val } })}
              />

              <FormInput
                label="Principal's Qualification"
                value={formData.profile.principalQualification}
                onChangeText={(val) => setFormData({ ...formData, profile: { ...formData.profile, principalQualification: val } })}
              />

              <FormInput
                label="Principal's Experience"
                value={formData.profile.principalExperience}
                onChangeText={(val) => setFormData({ ...formData, profile: { ...formData.profile, principalExperience: val } })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <RatingSelector
                label="Co-education Policy"
                value={formData.profile.coEducation}
                onSelect={(val) => setFormData({ ...formData, profile: { ...formData.profile, coEducation: val } })}
                options={RATING_OPTIONS.YES_NO}
              />
              <RatingSelector
                label="Use of DAS Portal"
                value={formData.profile.usePortal}
                onSelect={(val) => setFormData({ ...formData, profile: { ...formData.profile, usePortal: val } })}
                options={RATING_OPTIONS.YES_NO}
              />
              <RatingSelector
                label="Status of Academic Calendar"
                value={formData.profile.academicCalendar}
                onSelect={(val) => setFormData({ ...formData, profile: { ...formData.profile, academicCalendar: val } })}
                options={RATING_OPTIONS.FOLLOWED_STATUS}
              />
              <RatingSelector
                label="Status of Book List"
                value={formData.profile.bookList}
                onSelect={(val) => setFormData({ ...formData, profile: { ...formData.profile, bookList: val } })}
                options={RATING_OPTIONS.FOLLOWED_STATUS}
              />
              <RatingSelector
                label="Condition of Canteen and Food"
                value={formData.profile.canteenCondition}
                onSelect={(val) => setFormData({ ...formData, profile: { ...formData.profile, canteenCondition: val } })}
                options={['Good', 'Average', 'Unsatisfactory']}
              />
              <RatingSelector
                label="Students' Projects Quality"
                value={formData.profile.studentsProjects}
                onSelect={(val) => setFormData({ ...formData, profile: { ...formData.profile, studentsProjects: val } })}
                options={['Good', 'Average', 'Poor']}
              />
            </div>
          </SectionCard>
        )}

        {/* STEP 4: MANAGEMENT AND ACADEMIC LEADERSHIP */}
        {currentStep === 4 && (
          <SectionCard
            stepNumber={4}
            title="Management & Academic Leadership"
            subtitle="Campus director involvement, principal instructional competence and leadership ranking"
          >
            <RatingSelector
              label="Director’s Involvement in School Matters"
              value={formData.leadership.directorInvolvement}
              onSelect={(val) => setFormData({ ...formData, leadership: { ...formData.leadership, directorInvolvement: val } })}
              options={RATING_OPTIONS.INVOLVEMENT}
            />
            <FormInput
              placeholder="Remarks regarding director involvement..."
              value={formData.leadership.directorRemarks}
              onChangeText={(val) => setFormData({ ...formData, leadership: { ...formData.leadership, directorRemarks: val } })}
            />

            <RatingSelector
              label="Campus Communication with Regional & Head Office"
              value={formData.leadership.campusCommunication}
              onSelect={(val) => setFormData({ ...formData, leadership: { ...formData.leadership, campusCommunication: val } })}
              options={RATING_OPTIONS.INVOLVEMENT}
            />

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                Principal Competencies & Performance
              </h4>
              <RatingSelector
                label="Principal Competency (Academics / Leadership / Teamwork)"
                value={formData.leadership.principalAcademics}
                onSelect={(val) => setFormData({ ...formData, leadership: { ...formData.leadership, principalAcademics: val } })}
                options={RATING_OPTIONS.PERFORMANCE_STANDARD}
              />
              <RatingSelector
                label="Participation in Central Meetings & Trainings"
                value={formData.leadership.meetingsParticipation}
                onSelect={(val) => setFormData({ ...formData, leadership: { ...formData.leadership, meetingsParticipation: val } })}
                options={['Active Participation', 'Satisfactory', 'Poor']}
              />
              <RatingSelector
                label="Model Lecture with Productivity"
                value={formData.leadership.modelLecture}
                onSelect={(val) => setFormData({ ...formData, leadership: { ...formData.leadership, modelLecture: val } })}
                options={RATING_OPTIONS.PERFORMANCE_STANDARD}
              />
              <RatingSelector
                label="Rounds Taken by Principal"
                value={formData.leadership.roundsTaken}
                onSelect={(val) => setFormData({ ...formData, leadership: { ...formData.leadership, roundsTaken: val } })}
                options={['Satisfactory', 'Need effort']}
              />
              <RatingSelector
                label="Measures for Professional Development"
                value={formData.leadership.professionalDevelopment}
                onSelect={(val) => setFormData({ ...formData, leadership: { ...formData.leadership, professionalDevelopment: val } })}
                options={RATING_OPTIONS.PERFORMANCE_STANDARD}
              />
              <RatingSelector
                label="Overall Principal Ranking"
                value={formData.leadership.principalRanking}
                onSelect={(val) => setFormData({ ...formData, leadership: { ...formData.leadership, principalRanking: val } })}
                options={RATING_OPTIONS.PERFORMANCE_STANDARD}
              />
            </div>
          </SectionCard>
        )}

        {/* STEP 5: STUDENT AND STAFF STRENGTH */}
        {currentStep === 5 && (
          <SectionCard
            stepNumber={5}
            title="Student & Staff Strength"
            subtitle="Section-wise student enrollments and academic faculty distribution"
          >
            <div className="overflow-x-auto mb-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold">
                  <tr>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-center">ECE</th>
                    <th className="p-2.5 text-center">Primary</th>
                    <th className="p-2.5 text-center">Middle</th>
                    <th className="p-2.5 text-center">Secondary</th>
                    <th className="p-2.5 text-center">Hifz</th>
                    <th className="p-2.5 text-center bg-[#edf3fa] text-[#082052] dark:bg-[#041029] dark:text-[#C59B27]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr>
                    <td className="p-2.5 font-bold">Students</td>
                    {['ECE', 'Primary', 'Middle', 'Secondary', 'Hifz'].map((lvl) => (
                      <td key={lvl} className="p-1 text-center">
                        <input
                          type="number"
                          value={formData.strength[`students${lvl}`] || 0}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            const next = { ...formData.strength, [`students${lvl}`]: val };
                            next.totalStudents = (next.studentsECE || 0) + (next.studentsPrimary || 0) + (next.studentsMiddle || 0) + (next.studentsSecondary || 0) + (next.studentsHifz || 0);
                            setFormData({ ...formData, strength: next });
                          }}
                          className="w-14 text-center font-bold py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        />
                      </td>
                    ))}
                    <td className="p-2.5 text-center font-black bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#C59B27] font-mono tabular-nums">
                      {formData.strength.totalStudents}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Academic Staff</td>
                    {['ECE', 'Primary', 'Middle', 'Secondary', 'Hifz'].map((lvl) => (
                      <td key={lvl} className="p-1 text-center">
                        <input
                          type="number"
                          value={formData.strength[`staff${lvl}`] || 0}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            const next = { ...formData.strength, [`staff${lvl}`]: val };
                            next.totalStaff = (next.staffECE || 0) + (next.staffPrimary || 0) + (next.staffMiddle || 0) + (next.staffSecondary || 0) + (next.staffHifz || 0);
                            setFormData({ ...formData, strength: next });
                          }}
                          className="w-14 text-center font-bold py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        />
                      </td>
                    ))}
                    <td className="p-2.5 text-center font-black bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#C59B27] font-mono tabular-nums">
                      {formData.strength.totalStaff}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumericInput
                label="Non-Academic Staff"
                value={formData.strength.nonAcademicStaff}
                onChangeValue={(val) => setFormData({ ...formData, strength: { ...formData.strength, nonAcademicStaff: val } })}
              />
              <FormInput
                label="Staff Turnover (Count & Reason)"
                value={formData.strength.staffTurnover}
                onChangeText={(val) => setFormData({ ...formData, strength: { ...formData.strength, staffTurnover: val } })}
                placeholder="e.g. 2 (Low)"
              />
              <RatingSelector
                label="Assembly Layout"
                value={formData.strength.assemblyLayout}
                onSelect={(val) => setFormData({ ...formData, strength: { ...formData.strength, assemblyLayout: val } })}
                options={RATING_OPTIONS.ASSEMBLY_LAYOUT}
              />
              <RatingSelector
                label="Official Records Maintenance"
                value={formData.strength.officialRecord}
                onSelect={(val) => setFormData({ ...formData, strength: { ...formData.strength, officialRecord: val } })}
                options={RATING_OPTIONS.RECORD_STATUS}
              />
              <RatingSelector
                label="Status of Marketing & Admissions"
                value={formData.strength.statusOfMarketing}
                onSelect={(val) => setFormData({ ...formData, strength: { ...formData.strength, statusOfMarketing: val } })}
                options={RATING_OPTIONS.PERFORMANCE_STANDARD}
              />
              <RatingSelector
                label="Submission of Principal Report"
                value={formData.strength.submissionOfPrincipalReport}
                onSelect={(val) => setFormData({ ...formData, strength: { ...formData.strength, submissionOfPrincipalReport: val } })}
                options={RATING_OPTIONS.PRINCIPAL_REPORT_SUBMISSION}
              />
            </div>
          </SectionCard>
        )}

        {/* STEP 6: PRESENTATION, DISCIPLINE & CLEANLINESS */}
        {currentStep === 6 && (
          <SectionCard
            stepNumber={6}
            title="School Presentation, Discipline & Cleanliness"
            subtitle="Institutional decorum, student manners, uniform codes, and hygiene"
          >
            <div className="space-y-3">
              <RatingSelector
                label="Vision, Mission & Core Values Display"
                value={formData.presentation.displayVisionMission}
                onSelect={(val) => setFormData({ ...formData, presentation: { ...formData.presentation, displayVisionMission: val } })}
                options={RATING_OPTIONS.DISPLAY_STATUS}
              />
              <RatingSelector
                label="Security System & Guards"
                value={formData.presentation.securitySystem}
                onSelect={(val) => setFormData({ ...formData, presentation: { ...formData.presentation, securitySystem: val } })}
                options={['Good', 'Average', 'Poor']}
              />
              <RatingSelector
                label="Principal Office Setup"
                value={formData.presentation.principalOffice}
                onSelect={(val) => setFormData({ ...formData, presentation: { ...formData.presentation, principalOffice: val } })}
                options={['Good', 'Average', 'Poor']}
              />
              <RatingSelector
                label="Discipline of School (Assembly, Corridors, Break)"
                value={formData.presentation.discipline}
                onSelect={(val) => setFormData({ ...formData, presentation: { ...formData.presentation, discipline: val } })}
                options={['Excellent', 'Good', 'Average', 'Unsatisfactory']}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <RatingSelector
                  label="Dress Code: Academic Staff"
                  value={formData.presentation.academicDressCode}
                  onSelect={(val) => setFormData({ ...formData, presentation: { ...formData.presentation, academicDressCode: val } })}
                  options={RATING_OPTIONS.FOLLOWED_STATUS}
                />
                <RatingSelector
                  label="Conduct: Academic Staff"
                  value={formData.presentation.academicStaffConduct}
                  onSelect={(val) => setFormData({ ...formData, presentation: { ...formData.presentation, academicStaffConduct: val } })}
                  options={['Excellent', 'Good', 'Average']}
                />
                <RatingSelector
                  label="Dress Code: Non-Academic Staff"
                  value={formData.presentation.nonAcademicDressCode}
                  onSelect={(val) => setFormData({ ...formData, presentation: { ...formData.presentation, nonAcademicDressCode: val } })}
                  options={RATING_OPTIONS.FOLLOWED_STATUS}
                />
                <RatingSelector
                  label="Conduct: Non-Academic Staff"
                  value={formData.presentation.nonAcademicStaffConduct}
                  onSelect={(val) => setFormData({ ...formData, presentation: { ...formData.presentation, nonAcademicStaffConduct: val } })}
                  options={['Excellent', 'Good', 'Average']}
                />
              </div>
              <RatingSelector
                label="Status of Soft-Boards & Classroom Decoration"
                value={formData.presentation.statusOfSoftBoard}
                onSelect={(val) => setFormData({ ...formData, presentation: { ...formData.presentation, statusOfSoftBoard: val } })}
                options={['Excellent', 'Good', 'Average', 'Needs effort']}
              />
              <RatingSelector
                label="Status of Overall School Cleanliness"
                value={formData.presentation.cleanliness}
                onSelect={(val) => setFormData({ ...formData, presentation: { ...formData.presentation, cleanliness: val } })}
                options={['Excellent', 'Good', 'Average', 'Poor']}
              />
            </div>
          </SectionCard>
        )}

        {/* STEP 7: EXAMS EVALUATION */}
        {currentStep === 7 && (
          <SectionCard
            stepNumber={7}
            title="Examinations Evaluation"
            subtitle="Central date sheet adherence, paper transparency, vigilance and result prep"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RatingSelector
                label="Date Sheet / Exam Schedule"
                value={formData.exams.dateSheetSchedule}
                onSelect={(val) => setFormData({ ...formData, exams: { ...formData.exams, dateSheetSchedule: val } })}
                options={RATING_OPTIONS.FOLLOWED_STATUS}
              />
              <RatingSelector
                label="Papers Standard & Confidentiality"
                value={formData.exams.papers}
                onSelect={(val) => setFormData({ ...formData, exams: { ...formData.exams, papers: val } })}
                options={RATING_OPTIONS.FOLLOWED_STATUS}
              />
              <RatingSelector
                label="Teachers' Duties with Shuffling"
                value={formData.exams.teachersDuties}
                onSelect={(val) => setFormData({ ...formData, exams: { ...formData.exams, teachersDuties: val } })}
                options={['Announced', 'Not announced']}
              />
              <RatingSelector
                label="Students' Seating Shuffling"
                value={formData.exams.studentsShuffling}
                onSelect={(val) => setFormData({ ...formData, exams: { ...formData.exams, studentsShuffling: val } })}
                options={['Shuffled', 'Not shuffled']}
              />
              <RatingSelector
                label="Teachers' Vigilance in Exam Halls"
                value={formData.exams.teachersVigilance}
                onSelect={(val) => setFormData({ ...formData, exams: { ...formData.exams, teachersVigilance: val } })}
                options={['Vigilant', 'Average', 'Casual']}
              />
              <RatingSelector
                label="Papers Rechecking Schedule"
                value={formData.exams.recheckingSchedule}
                onSelect={(val) => setFormData({ ...formData, exams: { ...formData.exams, recheckingSchedule: val } })}
                options={['Available', 'Not Available']}
              />
              <RatingSelector
                label="Whiteboards Updated for Exams"
                value={formData.exams.whiteboards}
                onSelect={(val) => setFormData({ ...formData, exams: { ...formData.exams, whiteboards: val } })}
                options={['Updated', 'Not updated']}
              />
              <RatingSelector
                label="Preparation of Result Day"
                value={formData.exams.resultDay}
                onSelect={(val) => setFormData({ ...formData, exams: { ...formData.exams, resultDay: val } })}
                options={['Prepared', 'Under Process', 'Not prepared']}
              />
              <div className="sm:col-span-2">
                <RatingSelector
                  label="Changes in Exam Papers"
                  value={formData.exams.examPaperChanges}
                  onSelect={(val) => setFormData({ ...formData, exams: { ...formData.exams, examPaperChanges: val } })}
                  options={RATING_OPTIONS.EXAM_CHANGES}
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput
                  label="Examinations Observation & Notes"
                  multiline
                  rows={2}
                  value={formData.exams.observation}
                  onChangeText={(val) => setFormData({ ...formData, exams: { ...formData.exams, observation: val } })}
                />
              </div>
            </div>
          </SectionCard>
        )}

        {/* STEP 8: CLASS-WISE EVALUATION (CORE 70 MARKS SCORING ENGINE) */}
        {currentStep === 8 && (
          <SectionCard
            stepNumber={8}
            title="Class-wise Academic Evaluation"
            subtitle="Standard 70-Mark Rubric: Classroom (20) + Students (25) + Teacher (25)"
            actionButton={
              <button
                type="button"
                onClick={() => {
                  const newCls = {
                    id: `cls_${Date.now()}`,
                    className: 'Class V',
                    section: 'A',
                    subject: 'Mathematics',
                    teacherName: 'Teacher Name',
                    classroomScores: { seating: 4, environment: 4, planningSyllabi: 4, cleanliness: 4 },
                    studentScores: { greetings: 4, communication: 4, activityRecord: 4, subjectCompetency: 4, notebooksPresentation: 4 },
                    teacherScores: { lessonPlan: 4, resources: 4, skillsCommand: 4, checkingQuality: 4, personalityBodyLanguage: 4 },
                    recommendations: '',
                  };
                  setFormData({
                    ...formData,
                    classEvaluations: [...(formData.classEvaluations || []), newCls],
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-white text-xs font-bold flex items-center space-x-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Add Class</span>
              </button>
            }
          >
            {(formData.classEvaluations || []).map((cls, idx) => {
              const ceScore = calculateClassroomScore(cls.classroomScores || {});
              const stScore = calculateStudentsScore(cls.studentScores || {});
              const tcScore = calculateTeacherScore(cls.teacherScores || {});
              const totalObtained = ceScore.obtained + stScore.obtained + tcScore.obtained;
              const pct = Math.round((totalObtained / 70) * 100);

              return (
                <div
                  key={cls.id}
                  className="mb-5 p-4 rounded-xl border border-[#e2d5c1] dark:border-[#1a436e] bg-white dark:bg-[#082052] shadow-xs"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e2d5c1] dark:border-[#1a436e]">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-[#082052] text-white font-bold text-xs flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-[#222d3d] dark:text-slate-100 text-sm">
                        {cls.className} ({cls.section || 'General'}) · {cls.subject}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#C59B27] font-mono tabular-nums border border-[#c0d4ed] dark:border-[#1a436e]">
                        {totalObtained} / 70 ({pct}%)
                      </span>
                      {formData.classEvaluations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              classEvaluations: formData.classEvaluations.filter((c) => c.id !== cls.id),
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Header info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    <FormInput
                      label="Class"
                      value={cls.className}
                      onChangeText={(val) => {
                        const updated = [...formData.classEvaluations];
                        updated[idx].className = val;
                        setFormData({ ...formData, classEvaluations: updated });
                      }}
                      className="mb-0"
                    />
                    <FormInput
                      label="Section"
                      value={cls.section}
                      onChangeText={(val) => {
                        const updated = [...formData.classEvaluations];
                        updated[idx].section = val;
                        setFormData({ ...formData, classEvaluations: updated });
                      }}
                      className="mb-0"
                    />
                    <FormInput
                      label="Subject"
                      value={cls.subject}
                      onChangeText={(val) => {
                        const updated = [...formData.classEvaluations];
                        updated[idx].subject = val;
                        setFormData({ ...formData, classEvaluations: updated });
                      }}
                      className="mb-0"
                    />
                    <FormInput
                      label="Teacher Name"
                      value={cls.teacherName}
                      onChangeText={(val) => {
                        const updated = [...formData.classEvaluations];
                        updated[idx].teacherName = val;
                        setFormData({ ...formData, classEvaluations: updated });
                      }}
                      className="mb-0"
                    />
                  </div>

                  {/* 1. Classroom Environment (Max 20) */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#082052] dark:text-[#C59B27] uppercase tracking-wide">
                        1. Classroom Environment ({ceScore.obtained} / 20)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <ScoreInput
                        label="Seating arrangement with labels"
                        score={cls.classroomScores?.seating}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].classroomScores = { ...updated[idx].classroomScores, seating: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                      <ScoreInput
                        label="Environment (Lights, Soft-boards)"
                        score={cls.classroomScores?.environment}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].classroomScores = { ...updated[idx].classroomScores, environment: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                      <ScoreInput
                        label="Planning, Syllabi & Attendance"
                        score={cls.classroomScores?.planningSyllabi}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].classroomScores = { ...updated[idx].classroomScores, planningSyllabi: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                      <ScoreInput
                        label="Cleanliness of Class"
                        score={cls.classroomScores?.cleanliness}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].classroomScores = { ...updated[idx].classroomScores, cleanliness: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                    </div>
                  </div>

                  {/* 2. Students Evaluation (Max 25) */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#082052] dark:text-[#C59B27] uppercase tracking-wide">
                        2. Students' Evaluation ({stScore.obtained} / 25)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <ScoreInput
                        label="Islamic Greetings & Manners"
                        score={cls.studentScores?.greetings}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].studentScores = { ...updated[idx].studentScores, greetings: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                      <ScoreInput
                        label="Communication & Confidence"
                        score={cls.studentScores?.communication}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].studentScores = { ...updated[idx].studentScores, communication: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                      <ScoreInput
                        label="Activity / Project Record"
                        score={cls.studentScores?.activityRecord}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].studentScores = { ...updated[idx].studentScores, activityRecord: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                      <ScoreInput
                        label="Subject Competency & Concepts"
                        score={cls.studentScores?.subjectCompetency}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].studentScores = { ...updated[idx].studentScores, subjectCompetency: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                      <div className="sm:col-span-2">
                        <ScoreInput
                          label="Notebooks Presentation & Quality of Checking"
                          score={cls.studentScores?.notebooksPresentation}
                          onChangeScore={(val) => {
                            const updated = [...formData.classEvaluations];
                            updated[idx].studentScores = { ...updated[idx].studentScores, notebooksPresentation: val };
                            setFormData({ ...formData, classEvaluations: updated });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Teacher Evaluation (Max 25) */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#082052] dark:text-[#C59B27] uppercase tracking-wide">
                        3. Teacher's Evaluation ({tcScore.obtained} / 25)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <ScoreInput
                        label="Lesson Plan Preparation"
                        score={cls.teacherScores?.lessonPlan}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].teacherScores = { ...updated[idx].teacherScores, lessonPlan: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                      <ScoreInput
                        label="Use of Resources & Whiteboard"
                        score={cls.teacherScores?.resources}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].teacherScores = { ...updated[idx].teacherScores, resources: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                      <ScoreInput
                        label="Teaching Skills & Subject Command"
                        score={cls.teacherScores?.skillsCommand}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].teacherScores = { ...updated[idx].teacherScores, skillsCommand: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                      <ScoreInput
                        label="Checking Quality & Follow-up"
                        score={cls.teacherScores?.checkingQuality}
                        onChangeScore={(val) => {
                          const updated = [...formData.classEvaluations];
                          updated[idx].teacherScores = { ...updated[idx].teacherScores, checkingQuality: val };
                          setFormData({ ...formData, classEvaluations: updated });
                        }}
                      />
                      <div className="sm:col-span-2">
                        <ScoreInput
                          label="Personality, Tone & Body Language"
                          score={cls.teacherScores?.personalityBodyLanguage}
                          onChangeScore={(val) => {
                            const updated = [...formData.classEvaluations];
                            updated[idx].teacherScores = { ...updated[idx].teacherScores, personalityBodyLanguage: val };
                            setFormData({ ...formData, classEvaluations: updated });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <FormInput
                    label="Specific Observations & Recommendations for this Class"
                    value={cls.recommendations}
                    onChangeText={(val) => {
                      const updated = [...formData.classEvaluations];
                      updated[idx].recommendations = val;
                      setFormData({ ...formData, classEvaluations: updated });
                    }}
                    placeholder="Provide specific, actionable instructional feedback..."
                    className="mb-0"
                  />
                </div>
              );
            })}
          </SectionCard>
        )}

        {/* STEP 9: HIFZ ACADEMICS EVALUATION (75 MARKS RUBRIC) */}
        {currentStep === 9 && (
          <SectionCard
            stepNumber={9}
            title="Hifz Academics Evaluation"
            subtitle="Standard 75-Mark Rubric: Classroom (25) + Ethics/Tajweed (25) + Instructor (25)"
            actionButton={
              <button
                type="button"
                onClick={() => {
                  const newHfz = {
                    id: `hfz_${Date.now()}`,
                    level: 'Hifz Section',
                    teacherName: 'Hafiz Sahab',
                    classroomScores: { seating: 5, whiteboard: 5, softboards: 5, schedule: 5, cleanliness: 5 },
                    studentScores: { ethics: 5, communication: 5, conceptsClearance: 5, grammar: 5, laminations: 5 },
                    teacherScores: { lessonPlan: 5, resources: 5, skillsCommand: 5, checkingQuality: 5, personalityBodyLanguage: 5 },
                    recommendations: '',
                  };
                  setFormData({
                    ...formData,
                    hifzEvaluations: [...(formData.hifzEvaluations || []), newHfz],
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-white text-xs font-bold flex items-center space-x-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Add Hifz Class</span>
              </button>
            }
          >
            {(formData.hifzEvaluations || []).map((h, idx) => (
              <div
                key={h.id}
                className="mb-5 p-4 rounded-xl border border-[#e2d5c1] dark:border-[#1a436e] bg-white dark:bg-[#082052] shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e2d5c1] dark:border-[#1a436e]">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-md bg-[#082052] text-white font-bold text-xs flex items-center justify-center font-mono">
                      H{idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {h.level} • {h.teacherName}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        hifzEvaluations: formData.hifzEvaluations.filter((hf) => hf.id !== h.id),
                      });
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <FormInput
                    label="Hifz Level / Section"
                    value={h.level}
                    onChangeText={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].level = val;
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                    className="mb-0"
                  />
                  <FormInput
                    label="Instructor / Qari Name"
                    value={h.teacherName}
                    onChangeText={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].teacherName = val;
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                    className="mb-0"
                  />
                </div>

                {/* Environment max 25 */}
                <h5 className="text-xs font-bold text-[#082052] dark:text-[#C59B27] uppercase mt-3 mb-2">
                  1. Hifz Classroom Environment (Max 25)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ScoreInput
                    label="Seating arrangement / Rihels"
                    score={h.classroomScores?.seating}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].classroomScores = { ...updated[idx].classroomScores, seating: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <ScoreInput
                    label="Whiteboard Updated with Targets"
                    score={h.classroomScores?.whiteboard}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].classroomScores = { ...updated[idx].classroomScores, whiteboard: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <ScoreInput
                    label="Soft-boards & Motivational Verses"
                    score={h.classroomScores?.softboards}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].classroomScores = { ...updated[idx].classroomScores, softboards: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <ScoreInput
                    label="Schedule Followed (Sabaq, Sabqi, Manzil)"
                    score={h.classroomScores?.schedule}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].classroomScores = { ...updated[idx].classroomScores, schedule: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <div className="sm:col-span-2">
                    <ScoreInput
                      label="Cleanliness & Taharah of Hifz Room"
                      score={h.classroomScores?.cleanliness}
                      onChangeScore={(val) => {
                        const updated = [...formData.hifzEvaluations];
                        updated[idx].classroomScores = { ...updated[idx].classroomScores, cleanliness: val };
                        setFormData({ ...formData, hifzEvaluations: updated });
                      }}
                    />
                  </div>
                </div>

                {/* Ethics & Tajweed max 25 */}
                <h5 className="text-xs font-bold text-[#082052] dark:text-[#C59B27] uppercase mt-4 mb-2">
                  2. Students' Ethics, Tajweed & Fluency (Max 25)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ScoreInput
                    label="Islamic Ethics & Adab-ul-Quran"
                    score={h.studentScores?.ethics}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].studentScores = { ...updated[idx].studentScores, ethics: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <ScoreInput
                    label="Communication & Pronunciation"
                    score={h.studentScores?.communication}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].studentScores = { ...updated[idx].studentScores, communication: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <ScoreInput
                    label="Concepts & Makharij Clearance"
                    score={h.studentScores?.conceptsClearance}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].studentScores = { ...updated[idx].studentScores, conceptsClearance: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <ScoreInput
                    label="Quranic Grammar & Meaning Understanding"
                    score={h.studentScores?.grammar}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].studentScores = { ...updated[idx].studentScores, grammar: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <div className="sm:col-span-2">
                    <ScoreInput
                      label="Tajweed Rules, Laminations & Surah Cards"
                      score={h.studentScores?.laminations}
                      onChangeScore={(val) => {
                        const updated = [...formData.hifzEvaluations];
                        updated[idx].studentScores = { ...updated[idx].studentScores, laminations: val };
                        setFormData({ ...formData, hifzEvaluations: updated });
                      }}
                    />
                  </div>
                </div>

                {/* Instructor Evaluation max 25 */}
                <h5 className="text-xs font-bold text-[#082052] dark:text-[#C59B27] uppercase mt-4 mb-2">
                  3. Instructor Evaluation (Max 25)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ScoreInput
                    label="Sabaq Planning & Daily Logs"
                    score={h.teacherScores?.lessonPlan}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].teacherScores = { ...updated[idx].teacherScores, lessonPlan: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <ScoreInput
                    label="Tajweed Resources & Listening Patience"
                    score={h.teacherScores?.resources}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].teacherScores = { ...updated[idx].teacherScores, resources: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <ScoreInput
                    label="Qirat Command & Qira'at Fluency"
                    score={h.teacherScores?.skillsCommand}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].teacherScores = { ...updated[idx].teacherScores, skillsCommand: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <ScoreInput
                    label="Daily Diary Checking & Marking"
                    score={h.teacherScores?.checkingQuality}
                    onChangeScore={(val) => {
                      const updated = [...formData.hifzEvaluations];
                      updated[idx].teacherScores = { ...updated[idx].teacherScores, checkingQuality: val };
                      setFormData({ ...formData, hifzEvaluations: updated });
                    }}
                  />
                  <div className="sm:col-span-2">
                    <ScoreInput
                      label="Teacher Personality, Sunnah Adherence & Tone"
                      score={h.teacherScores?.personalityBodyLanguage}
                      onChangeScore={(val) => {
                        const updated = [...formData.hifzEvaluations];
                        updated[idx].teacherScores = { ...updated[idx].teacherScores, personalityBodyLanguage: val };
                        setFormData({ ...formData, hifzEvaluations: updated });
                      }}
                    />
                  </div>
                </div>

                <FormInput
                  label="Hifz Section Observations & Next Term Milestones"
                  value={h.recommendations}
                  onChangeText={(val) => {
                    const updated = [...formData.hifzEvaluations];
                    updated[idx].recommendations = val;
                    setFormData({ ...formData, hifzEvaluations: updated });
                  }}
                  className="mb-0 mt-3"
                />
              </div>
            ))}
          </SectionCard>
        )}

        {/* STEP 10: TEACHER PERFORMANCE SUMMARY */}
        {currentStep === 10 && (
          <SectionCard
            stepNumber={10}
            title="Teacher Performance Evaluation Summary"
            subtitle="Aggregated instructional performance across inspected classes"
          >
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl mb-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-750 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Teacher</th>
                    <th className="p-3">Class & Subject</th>
                    <th className="p-3 text-center">Score (Max 25)</th>
                    <th className="p-3 text-center">Performance Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {(formData.classEvaluations || []).map((c, i) => {
                    const score = calculateTeacherScore(c.teacherScores || {}).obtained;
                    const pct = Math.round((score / 25) * 100);
                    return (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{c.teacherName}</td>
                        <td className="p-3 text-slate-500">{c.className} · {c.subject}</td>
                        <td className="p-3 text-center font-extrabold text-[#082052] dark:text-[#C59B27] font-mono tabular-nums">
                          {score} / 25 ({pct}%)
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                            pct >= 80 ? 'bg-[#edf3fa] text-[#082052] border-[#c0d4ed] dark:bg-[#041029] dark:text-[#C59B27]' :
                            pct >= 70 ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}>
                            {pct >= 90 ? 'Exceptional' : pct >= 80 ? 'Very Good' : pct >= 70 ? 'Good' : 'Needs Support'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <NumericInput
              label="Activities / School Project Record Marks (Max 25)"
              value={formData.activitiesProjectMarks}
              onChangeValue={(val) => setFormData({ ...formData, activitiesProjectMarks: val })}
              max={25}
              helperText="Campus-wide student science exhibition, Quran club, and sports project records"
            />
          </SectionCard>
        )}

        {/* STEP 11: FINDINGS AND RECOMMENDATIONS */}
        {currentStep === 11 && (
          <SectionCard
            stepNumber={11}
            title="Overall Findings & Recommendations"
            subtitle="Qualitative synthesis of campus strengths, compliance gaps, and strategic feedback"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter key findings identified during the visit. These will automatically populate the corrective action plan.
            </p>

            {(formData.findings || []).map((f, idx) => (
              <div key={f.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Finding #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        findings: formData.findings.filter((_, i) => i !== idx),
                      });
                    }}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <FormInput
                  label="Finding / Defect Description"
                  multiline
                  rows={2}
                  value={f.finding}
                  onChangeText={(val) => {
                    const updated = [...formData.findings];
                    updated[idx].finding = val;
                    setFormData({ ...formData, findings: updated });
                  }}
                />
                <FormInput
                  label="Actionable Recommendation"
                  multiline
                  rows={2}
                  value={f.recommendation}
                  onChangeText={(val) => {
                    const updated = [...formData.findings];
                    updated[idx].recommendation = val;
                    setFormData({ ...formData, findings: updated });
                  }}
                  className="mb-0"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newF = {
                  id: `fnd_${Date.now()}`,
                  finding: '',
                  recommendation: '',
                  responsiblePerson: 'Principal',
                  timeline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                  priority: 'Medium',
                  currentStatus: 'Pending',
                  followUpRemarks: '',
                };
                setFormData({ ...formData, findings: [...(formData.findings || []), newF] });
              }}
              className="mt-2 px-3 py-1.5 rounded-lg border border-dashed border-[#C59B27] text-[#082052] dark:text-[#C59B27] hover:bg-[#e8f4fc] dark:hover:bg-[#041029] text-xs font-bold flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Add Another Finding</span>
            </button>
          </SectionCard>
        )}

        {/* STEP 12: CORRECTIVE ACTION PLAN */}
        {currentStep === 12 && (
          <SectionCard
            stepNumber={12}
            title="Corrective Action Plan"
            subtitle="Accountability matrix: Assign responsible personnel, target timelines and priorities"
          >
            <div className="space-y-4">
              {(formData.findings || []).map((f, idx) => (
                <div key={f.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">
                    Action Item #{idx + 1}: {f.finding || 'Pending finding description'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Recommendation: {f.recommendation || 'Specify recommendation'}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    <FormInput
                      label="Responsible Person"
                      value={f.responsiblePerson}
                      onChangeText={(val) => {
                        const updated = [...formData.findings];
                        updated[idx].responsiblePerson = val;
                        setFormData({ ...formData, findings: updated });
                      }}
                      className="mb-0"
                    />

                    <FormInput
                      label="Target Timeline"
                      type="date"
                      value={f.timeline}
                      onChangeText={(val) => {
                        const updated = [...formData.findings];
                        updated[idx].timeline = val;
                        setFormData({ ...formData, findings: updated });
                      }}
                      className="mb-0"
                    />

                    <SelectInput
                      label="Priority Level"
                      value={f.priority}
                      onSelect={(val) => {
                        const updated = [...formData.findings];
                        updated[idx].priority = val;
                        setFormData({ ...formData, findings: updated });
                      }}
                      options={['High', 'Medium', 'Low']}
                      className="mb-0"
                    />

                    <SelectInput
                      label="Current Status"
                      value={f.currentStatus}
                      onSelect={(val) => {
                        const updated = [...formData.findings];
                        updated[idx].currentStatus = val;
                        setFormData({ ...formData, findings: updated });
                      }}
                      options={['Pending', 'In Progress', 'Completed']}
                      className="mb-0"
                    />
                  </div>

                  <div className="mt-3">
                    <FormInput
                      placeholder="Follow-up remarks or verification notes..."
                      value={f.followUpRemarks}
                      onChangeText={(val) => {
                        const updated = [...formData.findings];
                        updated[idx].followUpRemarks = val;
                        setFormData({ ...formData, findings: updated });
                      }}
                      className="mb-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* STEP 13: EVIDENCE GALLERY */}
        {currentStep === 13 && (
          <SectionCard
            stepNumber={13}
            title="Photographic & Documentary Evidence"
            subtitle="Attach photos of laboratories, morning assembly, classroom softboards and official registers"
          >
            <EvidenceUploader
              evidenceList={formData.evidence || []}
              onAddEvidence={(item) => {
                setFormData({
                  ...formData,
                  evidence: [...(formData.evidence || []), item],
                });
              }}
              onRemoveEvidence={(id) => {
                setFormData({
                  ...formData,
                  evidence: (formData.evidence || []).filter((e) => e.id !== id),
                });
              }}
              section="General M&E Inspection"
            />
          </SectionCard>
        )}

        {/* STEP 14: SIGNATURES AND SUBMISSION */}
        {currentStep === 14 && (
          <SectionCard
            stepNumber={14}
            title="Signatures, Verification & Final Submission"
            subtitle="Digital endorsements and official submission to Regional Directorate"
          >
            {/* Final Overall Score Confirmation Banner */}
            <div className="p-4 rounded-xl bg-[#edf3fa] dark:bg-[#041029] border border-[#c0d4ed] dark:border-[#1a436e] mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#082052] dark:text-[#C59B27] font-bold">
                    Official Branch Score Calculation
                  </span>
                  <div className="text-3xl font-black text-[#082052] dark:text-white mt-1 font-mono tabular-nums">
                    {overallSummary.overall.percentage}%
                  </div>
                  <div className="text-xs font-semibold text-[#C59B27] dark:text-[#64b5f6] mt-0.5">
                    Category: {overallCategory.label} ({overallCategory.code})
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 sm:text-right space-y-1">
                  <div>Classroom: <strong>{overallSummary.classroom.obtained} / {overallSummary.classroom.total}</strong></div>
                  <div>Students: <strong>{overallSummary.students.obtained} / {overallSummary.students.total}</strong></div>
                  <div>Teachers: <strong>{overallSummary.teachers.obtained} / {overallSummary.teachers.total}</strong></div>
                  <div>Activities: <strong>{overallSummary.activities.obtained} / {overallSummary.activities.total}</strong></div>
                </div>
              </div>
            </div>

            {/* Signature Canvas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <SignaturePad
                signatoryTitle="Principal Endorsement"
                signatoryName={formData.principalName || 'Principal'}
                initialDataUrl={formData.signatures?.principal}
                onSaveSignature={(sig) => setFormData({
                  ...formData,
                  signatures: { ...formData.signatures, principal: sig },
                })}
              />

              <SignaturePad
                signatoryTitle="Campus Director Endorsement"
                signatoryName={formData.directorName || 'Director'}
                initialDataUrl={formData.signatures?.director}
                onSaveSignature={(sig) => setFormData({
                  ...formData,
                  signatures: { ...formData.signatures, director: sig },
                })}
              />

              <SignaturePad
                signatoryTitle="Monitoring Officer Endorsement"
                signatoryName={formData.monitoringOfficerName || 'Monitoring Officer'}
                initialDataUrl={formData.signatures?.monitoringOfficer}
                onSaveSignature={(sig) => setFormData({
                  ...formData,
                  signatures: { ...formData.signatures, monitoringOfficer: sig },
                })}
              />
            </div>

            {/* Submission CTA */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Ready to Submit Report?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Submitting transitions the report to <strong>Submitted</strong> status for Regional Manager and Director review.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                >
                  Keep as Draft
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-5 py-2 rounded-xl bg-[#082052] hover:bg-[#0e2e6e] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md active:scale-98"
                >
                  <Send className="w-4 h-4 text-[#C59B27]" />
                  <span>Submit to Directorate</span>
                </button>
              </div>
            </div>
          </SectionCard>
        )}

        {/* Wizard Navigation Footer */}
        <div className="mt-6 flex items-center justify-between bg-white dark:bg-[#082052] p-3 rounded-xl border border-[#e2d5c1] dark:border-[#1a436e] shadow-xs">
          <button
            type="button"
            onClick={goToPrevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-lg border border-[#e2d5c1] dark:border-[#1a436e] hover:bg-[#f8fafc] dark:hover:bg-[#081d33] text-xs font-bold text-[#222d3d] dark:text-slate-200 flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-[#5a677a] dark:text-slate-400 font-mono tabular-nums">
            Step {currentStep} of 14
          </span>

          {currentStep < 14 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="px-4 py-2 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-5 py-2 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C59B27]" />
              <span>Finalize & Submit</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default NewVisitWizardScreen;
