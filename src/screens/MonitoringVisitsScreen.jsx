// Monitoring Visits Screen: Filterable List of All Institutional Reports
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  FileText, 
  Printer, 
  FileSpreadsheet, 
  Trash2, 
  School
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/dateUtils';
import { REPORT_STATUSES } from '../constants/reportStatuses';
import exportService from '../services/exportService';

export const MonitoringVisitsScreen = ({
  reports = [],
  regions = [],
  currentUser,
  onStartNewVisit,
  onViewReport,
  onEditReport,
  onDeleteReport,
  settings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const filteredReports = reports.filter((r) => {
    // Search match
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchBranch = r.branchName?.toLowerCase().includes(q);
      const matchSr = r.srNo?.toLowerCase().includes(q);
      const matchOfficer = r.monitoringOfficerName?.toLowerCase().includes(q);
      const matchRegion = r.region?.toLowerCase().includes(q);
      if (!matchBranch && !matchSr && !matchOfficer && !matchRegion) return false;
    }

    // Status match
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) {
      return false;
    }

    // Region match
    if (selectedRegion !== 'ALL' && r.region !== selectedRegion) {
      return false;
    }

    return true;
  });

  const statusesList = [
    'ALL',
    REPORT_STATUSES.DRAFT,
    REPORT_STATUSES.IN_PROGRESS,
    REPORT_STATUSES.SUBMITTED,
    REPORT_STATUSES.APPROVED,
    REPORT_STATUSES.RETURNED,
  ];

  return (
    <div className="p-3 sm:p-5 max-w-7xl mx-auto space-y-4">
      {/* Top Header & New Visit CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#082052] p-4 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#082052] dark:text-[#F8F0E5]">
            Monitoring & Evaluation Visits
          </h2>
          <p className="text-xs text-[#5a677a] dark:text-[#d8cebe]">
            Official field reports, evaluations and verified school inspections
          </p>
        </div>

        <button
          onClick={onStartNewVisit}
          className="px-4 py-2 rounded-xl bg-[#082052] hover:bg-[#0e2e6e] text-[#F8F0E5] font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm transition-all active:scale-98"
        >
          <Plus className="w-4 h-4 text-[#C59B27] stroke-[3]" />
          <span>Create Monitoring Visit</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-[#082052] p-3 sm:p-4 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5a677a]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search branch name, Sr. #, region, officer..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] placeholder:text-[#7f8c9f] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
            />
          </div>

          {/* Region Dropdown */}
          <div className="w-full sm:w-56">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
            >
              <option value="ALL">All Regions</option>
              {regions.map((reg) => (
                <option key={reg.name} value={reg.name}>
                  {reg.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-[#e2d5c1] dark:border-[#153675]">
          <span className="text-[11px] font-bold text-[#5a677a] dark:text-[#d8cebe] uppercase tracking-wider mr-1 shrink-0">
            Status:
          </span>
          {statusesList.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 transition-colors whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-[#082052] text-[#F8F0E5] shadow-xs ring-1 ring-[#C59B27]'
                  : 'bg-[#f8f0e5] dark:bg-[#041029] text-[#5a677a] dark:text-[#d8cebe] hover:bg-[#ede0ce] dark:hover:bg-[#0c2a68]'
              }`}
            >
              {st === 'ALL' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-[#082052] rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs hover:border-[#082052]/50 dark:hover:border-[#C59B27] transition-all overflow-hidden"
            >
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left Info */}
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onViewReport(report)}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#082052] dark:text-[#F8F0E5] bg-[#edf3fa] dark:bg-[#041029] px-2 py-0.5 rounded border border-[#c0d4ed] dark:border-[#153675]">
                      {report.srNo}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#082052] dark:text-[#F8F0E5] hover:text-[#C59B27] dark:hover:text-[#C59B27]">
                      {report.branchName}
                    </h3>
                    <StatusBadge status={report.status} size="sm" />
                  </div>

                  <div className="text-xs text-[#5a677a] dark:text-[#d8cebe] flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span className="flex items-center">
                      <School className="w-3.5 h-3.5 mr-1 text-[#C59B27]" />
                      {report.region}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-[#C59B27]" />
                      {formatDate(report.visitDate)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Officer: {report.monitoringOfficerName}</span>
                  </div>
                </div>

                {/* Center / Right Score */}
                <div className="flex items-center space-x-3 shrink-0">
                  {report.overallScore?.percentage !== undefined ? (
                    <div className="text-right">
                      <div className="text-xs text-[#5a677a] dark:text-[#d8cebe] font-medium">Overall Score</div>
                      <div className="flex items-baseline space-x-1 justify-end font-mono tabular-nums">
                        <span className="text-xl font-black text-[#082052] dark:text-[#F8F0E5]">
                          {report.overallScore.percentage}%
                        </span>
                        <span className="text-[10px] font-bold text-[#5a677a] dark:text-[#d8cebe]">
                          ({report.overallScore.category?.code || 'B'})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#7f8c9f] italic">Score pending</div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-1 pl-2 border-l border-[#e2d5c1] dark:border-[#153675]">
                    <button
                      onClick={() => onViewReport(report)}
                      className="p-1.5 rounded-lg text-[#5a677a] dark:text-[#d8cebe] hover:text-[#082052] hover:bg-[#faf6f0] dark:hover:bg-[#0c2a68] transition-colors"
                      title="View Institutional Report"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => exportService.triggerBrowserPrint(report, settings)}
                      className="p-1.5 rounded-lg text-[#5a677a] dark:text-[#d8cebe] hover:text-[#082052] hover:bg-[#faf6f0] dark:hover:bg-[#0c2a68] transition-colors"
                      title="Print / Save as PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => exportService.downloadExcelFile(report, settings)}
                      className="p-1.5 rounded-lg text-[#5a677a] dark:text-[#d8cebe] hover:text-[#082052] hover:bg-[#faf6f0] dark:hover:bg-[#0c2a68] transition-colors"
                      title="Export Excel Workbook"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onEditReport(report)}
                      className="px-2.5 py-1 rounded-lg bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5] hover:bg-[#dce9f8] text-xs font-bold ml-1 border border-[#c0d4ed] dark:border-[#153675] transition-colors"
                    >
                      {report.status === REPORT_STATUSES.APPROVED ? 'Edit' : 'Continue'}
                    </button>

                    {onDeleteReport && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete report for ${report.branchName}?`)) {
                            onDeleteReport(report.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-[#7f8c9f] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center bg-white dark:bg-[#082052] rounded-xl border border-[#e2d5c1] dark:border-[#153675] p-4">
            <Calendar className="w-8 h-8 text-[#7f8c9f] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[#082052] dark:text-[#F8F0E5]">
              No monitoring visits match your criteria
            </h4>
            <p className="text-xs text-[#5a677a] dark:text-[#d8cebe] mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, status filter, or create a brand new monitoring visit.
            </p>
            <button
              onClick={onStartNewVisit}
              className="mt-4 px-4 py-2 rounded-xl bg-[#082052] hover:bg-[#0e2e6e] text-[#F8F0E5] text-xs font-bold shadow-xs"
            >
              Start New Visit Now
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default MonitoringVisitsScreen;
