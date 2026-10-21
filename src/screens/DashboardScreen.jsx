// DashboardScreen: Executive & Operational Dashboard
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React, { useState } from 'react';
import { 
  Plus, 
  ClipboardCheck, 
  Award, 
  Calendar, 
  AlertTriangle, 
  Filter, 
  ArrowRight, 
  TrendingUp, 
  Building2, 
  FileSpreadsheet,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/dateUtils';
import { getPerformanceCategory } from '../utils/performanceCategories';
import { REPORT_STATUSES } from '../constants/reportStatuses';

export const DashboardScreen = ({
  reports = [],
  schools = [],
  regions = [],
  currentUser = {},
  onNavigateToTab = (_tabId) => {},
  onStartNewVisit = () => {},
  onViewReport = (_report) => {},
}) => {
  const [selectedRegion, setSelectedRegion] = useState('All');

  // Filter reports by selected region
  const filteredReports = reports.filter((r) => {
    if (selectedRegion === 'All') return true;
    return r.region === selectedRegion;
  });

  // KPI Calculations
  const totalVisits = filteredReports.length;
  const approvedVisits = filteredReports.filter((r) => r.status === REPORT_STATUSES.APPROVED).length;
  const inProgressVisits = filteredReports.filter((r) => 
    r.status === REPORT_STATUSES.DRAFT || r.status === REPORT_STATUSES.IN_PROGRESS || r.status === REPORT_STATUSES.SUBMITTED
  ).length;

  const scoredReports = filteredReports.filter((r) => r.overallScore && r.overallScore.percentage !== undefined);
  const avgScore = scoredReports.length > 0 
    ? Math.round(scoredReports.reduce((acc, r) => acc + Number(r.overallScore.percentage), 0) / scoredReports.length)
    : 0;
  const avgCategory = getPerformanceCategory(avgScore);

  // Performance category breakdown
  const categoryCounts = {
    A1: 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  scoredReports.forEach((r) => {
    const cat = getPerformanceCategory(r.overallScore.percentage);
    if (categoryCounts[cat.code] !== undefined) {
      categoryCounts[cat.code] += 1;
    }
  });

  // Action items requiring attention
  const urgentActions = [];
  filteredReports.forEach((r) => {
    (r.findings || []).forEach((f) => {
      if (f.currentStatus === 'Pending' || f.currentStatus === 'In Progress') {
        urgentActions.push({
          ...f,
          reportId: r.id,
          branchName: r.branchName,
          srNo: r.srNo,
        });
      }
    });
  });

  return (
    <div className="p-3 sm:p-5 max-w-7xl mx-auto space-y-4">
      
      {/* Top Welcome Banner in Deep Midnight Navy (#082052) */}
      <div className="bg-[#082052] rounded-2xl p-4 sm:p-6 text-[#F8F0E5] shadow-md border border-[#041029] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#F8F0E5]/80 mb-2">
            <span className="font-bold text-[#082052] bg-[#F8F0E5] px-2 py-0.5 rounded text-[11px]">{currentUser.role}</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.region || 'Central Office'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#C59B27] font-semibold">Dar-e-Arqam Central Directorate</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#F8F0E5]">
            Assalam-o-Alaikum, {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#F8F0E5]/80 mt-1 max-w-xl">
            Central Directorate M&E Digital Management Platform. Monitor evaluations, academic standards, and school rankings in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onStartNewVisit}
            className="px-4 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#b0891f] text-[#082052] font-black text-xs sm:text-sm flex items-center space-x-2 shadow-sm transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Monitoring Visit</span>
          </button>
          <button
            onClick={() => onNavigateToTab('reports')}
            className="px-3.5 py-2.5 rounded-xl bg-[#041029] hover:bg-[#0c2a68] border border-[#C59B27]/40 text-[#F8F0E5] font-semibold text-xs sm:text-sm flex items-center space-x-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#C59B27]" />
            <span>Ranking Table</span>
          </button>
        </div>
      </div>

      {/* Region Filter Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-[#082052] p-2.5 sm:p-3 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs">
        <div className="flex items-center space-x-2 shrink-0 pr-2">
          <Filter className="w-4 h-4 text-[#082052] dark:text-[#C59B27]" />
          <span className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5]">Region:</span>
        </div>
        <div className="flex space-x-1 overflow-x-auto no-scrollbar">
          {['All', ...regions.map((r) => r.name)].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 whitespace-nowrap ${
                selectedRegion === reg
                  ? 'bg-[#082052] text-[#F8F0E5] font-bold shadow-xs ring-1 ring-[#C59B27]'
                  : 'bg-[#f8f0e5] dark:bg-[#041029] text-[#5a677a] dark:text-[#d8cebe] hover:bg-[#ede0ce] dark:hover:bg-[#0c2a68]'
              }`}
            >
              {reg === 'All' ? 'All Regions' : reg.replace(' Region', '')}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard
          title="Total Visits"
          value={totalVisits}
          subtitle={`${approvedVisits} approved`}
          icon={ClipboardCheck}
          color="navy"
          onClick={() => onNavigateToTab('visits')}
        />
        <SummaryCard
          title="Average Score"
          value={`${avgScore}%`}
          subtitle={`Grade ${avgCategory.code} · ${avgCategory.label}`}
          icon={Award}
          color="gold"
          trend="+3.2% vs last term"
        />
        <SummaryCard
          title="In Progress"
          value={inProgressVisits}
          subtitle="Draft or review"
          icon={Calendar}
          color="navy"
          onClick={() => onNavigateToTab('visits')}
        />
        <SummaryCard
          title="Action Items"
          value={urgentActions.length}
          subtitle="Corrective tasks pending"
          icon={AlertTriangle}
          color="amber"
          onClick={() => onNavigateToTab('action_plan')}
        />
      </div>

      {/* Performance Distribution & School Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Category Breakdown Bar */}
        <div className="lg:col-span-2 bg-white dark:bg-[#082052] p-4 sm:p-5 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#082052] dark:text-[#F8F0E5]">
                Institutional Performance Categories
              </h3>
              <p className="text-xs text-[#5a677a] dark:text-[#d8cebe]">
                Branch classification based on Central M&E Marking Criteria
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#edf3fa] text-[#082052] dark:bg-[#041029] dark:text-[#F8F0E5] font-mono border border-[#c0d4ed] dark:border-[#153675]">
              Session 2024-25
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-2">
            {[
              { code: 'A1', label: 'Exceptional (90-100%)', count: categoryCounts.A1, color: 'bg-[#082052]', text: 'text-[#082052] dark:text-[#F8F0E5]' },
              { code: 'A', label: 'Very Good (80-89%)', count: categoryCounts.A, color: 'bg-[#1c499c]', text: 'text-[#1c499c] dark:text-sky-300' },
              { code: 'B', label: 'Good (70-79%)', count: categoryCounts.B, color: 'bg-[#C59B27]', text: 'text-[#8a680e] dark:text-[#C59B27]' },
              { code: 'C', label: 'Fair (60-69%)', count: categoryCounts.C, color: 'bg-[#d97706]', text: 'text-amber-700 dark:text-amber-300' },
              { code: 'D', label: 'Needs Effort (<60%)', count: categoryCounts.D, color: 'bg-[#9e2a2b]', text: 'text-rose-700 dark:text-rose-300' },
            ].map((cat) => (
              <div key={cat.code} className="text-center p-2 rounded-lg bg-[#faf6f0] dark:bg-[#041029] border border-[#e2d5c1] dark:border-[#153675]">
                <div className={`text-lg sm:text-xl font-extrabold font-mono tabular-nums ${cat.text}`}>
                  {cat.count}
                </div>
                <div className="text-[11px] font-bold text-[#082052] dark:text-[#F8F0E5] mt-0.5">
                  Cat. {cat.code}
                </div>
                <div className="text-[9px] text-[#5a677a] dark:text-[#d8cebe] hidden sm:block truncate mt-0.5">
                  {cat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Graphical proportion strip in Etoile Colors */}
          <div className="w-full h-3 rounded-full overflow-hidden flex mt-4 bg-[#ede0ce] dark:bg-[#041029]">
            {scoredReports.length > 0 ? (
              <>
                <div style={{ width: `${(categoryCounts.A1 / scoredReports.length) * 100}%` }} className="bg-[#082052]" title="A1 (Exceptional)" />
                <div style={{ width: `${(categoryCounts.A / scoredReports.length) * 100}%` }} className="bg-[#1c499c]" title="A (Very Good)" />
                <div style={{ width: `${(categoryCounts.B / scoredReports.length) * 100}%` }} className="bg-[#C59B27]" title="B (Good)" />
                <div style={{ width: `${(categoryCounts.C / scoredReports.length) * 100}%` }} className="bg-[#d97706]" title="C (Fair)" />
                <div style={{ width: `${(categoryCounts.D / scoredReports.length) * 100}%` }} className="bg-[#9e2a2b]" title="D (Needs Effort)" />
              </>
            ) : (
              <div className="w-full bg-[#ede0ce]" />
            )}
          </div>
        </div>

        {/* Quick Branch Highlights */}
        <div className="bg-white dark:bg-[#082052] p-4 sm:p-5 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#082052] dark:text-[#F8F0E5] mb-1 flex items-center">
              <TrendingUp className="w-4 h-4 text-[#C59B27] mr-1.5" />
              Top Performing Branch
            </h3>
            <p className="text-xs text-[#5a677a] dark:text-[#d8cebe] mb-3">
              Highest scoring branch in Central Regions
            </p>

            <div className="p-3.5 rounded-xl bg-[#f8f0e5] dark:bg-[#041029] border border-[#e2d5c1] dark:border-[#153675]">
              <div className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5]">
                Model Town Campus (Boys & Girls)
              </div>
              <div className="text-[11px] text-[#C59B27] font-semibold mt-0.5">
                Lahore Central Region · Rank #1
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#082052] dark:text-[#F8F0E5] font-mono tabular-nums">
                  89%
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white dark:bg-[#082052] text-[#082052] dark:text-[#F8F0E5] border border-[#e2d5c1] dark:border-[#153675]">
                  Category A
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('reports')}
            className="w-full mt-3 py-2 px-3 rounded-lg border border-[#e2d5c1] dark:border-[#153675] hover:bg-[#f8f0e5] dark:hover:bg-[#0c2a68] text-xs font-bold text-[#082052] dark:text-[#F8F0E5] flex items-center justify-center space-x-1 transition-colors"
          >
            <span>View Full Ranking Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Recent Monitoring Visits */}
      <div className="bg-white dark:bg-[#082052] rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#e2d5c1] dark:border-[#153675] flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#082052] dark:text-[#F8F0E5]">
              Recent Monitoring Visits
            </h3>
            <p className="text-xs text-[#5a677a] dark:text-[#d8cebe]">
              Latest inspections conducted across registered branches
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('visits')}
            className="text-xs font-bold text-[#082052] dark:text-[#C59B27] hover:underline flex items-center space-x-1"
          >
            <span>See All ({reports.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#e2d5c1] dark:divide-[#153675]">
          {filteredReports.slice(0, 4).map((report) => (
            <div
              key={report.id}
              onClick={() => onViewReport(report)}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#faf6f0] dark:hover:bg-[#0e2e6e]/60 cursor-pointer transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#edf3fa] dark:bg-[#041029] border border-[#c0d4ed] dark:border-[#153675] flex items-center justify-center text-[#082052] dark:text-[#F8F0E5] font-black text-xs shrink-0 font-mono tabular-nums">
                  {report.overallScore?.percentage ? `${report.overallScore.percentage}%` : '—'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#082052] dark:text-[#F8F0E5]">
                      {report.branchName}
                    </h4>
                    <span className="text-[10px] text-[#7f8c9f] font-mono">
                      {report.srNo}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5a677a] dark:text-[#d8cebe] mt-0.5 flex flex-wrap gap-x-2 items-center">
                    <span>Region: {report.region}</span>
                    <span aria-hidden="true">·</span>
                    <span>Date: {formatDate(report.visitDate)}</span>
                    <span aria-hidden="true">·</span>
                    <span>Officer: {report.monitoringOfficerName?.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <StatusBadge status={report.status} />
                <span className="text-[#5a677a] hover:text-[#082052] dark:hover:text-[#F8F0E5]">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent Corrective Action Plan Feed */}
      {urgentActions.length > 0 && (
        <div className="bg-white dark:bg-[#082052] rounded-xl border border-rose-300 dark:border-rose-900/50 shadow-xs p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-sm font-bold text-[#082052] dark:text-[#F8F0E5]">
                Action Items Requiring Attention ({urgentActions.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('action_plan')}
              className="text-xs font-bold text-[#082052] dark:text-[#C59B27] hover:underline"
            >
              Open Full Tracker
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {urgentActions.slice(0, 2).map((act, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs"
              >
                <div className="font-bold text-[#082052] dark:text-[#F8F0E5] mb-1 flex items-center justify-between">
                  <span className="truncate pr-2">{act.branchName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200 font-bold shrink-0">
                    {act.priority}
                  </span>
                </div>
                <p className="text-[#5a677a] dark:text-[#d8cebe] line-clamp-2">
                  {act.finding}
                </p>
                <div className="mt-2 text-[10px] text-[#7f8c9f] dark:text-[#a0acbd] flex items-center justify-between">
                  <span>Assigned: {act.responsiblePerson}</span>
                  <span>Target: {formatDate(act.timeline)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardScreen;
