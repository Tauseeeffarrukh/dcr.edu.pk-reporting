// Corrective Action Plan Screen: Cross-Campus Tracking & Accountability Matrix
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Calendar, 
  CheckCircle2
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export const ActionPlanScreen = ({
  reports = [],
  onUpdateActionStatus,
  onViewReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Flatten all findings across reports
  const allActions = [];
  reports.forEach((r) => {
    (r.findings || []).forEach((f, idx) => {
      allActions.push({
        ...f,
        uniqueKey: `${r.id}_${f.id || idx}`,
        reportId: r.id,
        branchName: r.branchName,
        region: r.region,
        findingIndex: idx,
        originalReport: r,
      });
    });
  });

  const filtered = allActions.filter((item) => {
    if (selectedStatus !== 'ALL' && item.currentStatus !== selectedStatus) return false;
    if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.finding?.toLowerCase().includes(q) ||
        item.recommendation?.toLowerCase().includes(q) ||
        item.branchName?.toLowerCase().includes(q) ||
        item.responsiblePerson?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = allActions.filter((a) => a.currentStatus === 'Pending').length;
  const inProgressCount = allActions.filter((a) => a.currentStatus === 'In Progress').length;
  const completedCount = allActions.filter((a) => a.currentStatus === 'Completed').length;

  return (
    <div className="p-3 sm:p-5 max-w-7xl mx-auto space-y-4">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#082052] p-4 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#082052] dark:text-[#F8F0E5] flex items-center">
            <CheckSquare className="w-5 h-5 text-[#C59B27] mr-2" />
            Corrective Action Plan Matrix
          </h2>
          <p className="text-xs text-[#5a677a] dark:text-[#d8cebe]">
            Cross-branch accountability, deficiency remediation, and inspection follow-up
          </p>
        </div>

        {/* Counter Indicators */}
        <div className="flex items-center space-x-2 self-start sm:self-auto font-mono tabular-nums">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            {pendingCount} Pending
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#faf3df] text-[#8a680e] dark:bg-[#C59B27]/20 dark:text-[#C59B27] border border-[#e8d59f] dark:border-[#C59B27]/40">
            {inProgressCount} In Progress
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#edf3fa] text-[#082052] dark:bg-[#041029] dark:text-[#F8F0E5] border border-[#c0d4ed] dark:border-[#153675]">
            {completedCount} Completed
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-[#082052] p-3 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5a677a]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action item, campus, recommendation, assigned staff..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] placeholder:text-[#7f8c9f] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.uniqueKey}
              className={`p-4 rounded-xl border bg-white dark:bg-[#082052] shadow-xs transition-all ${
                item.currentStatus === 'Completed'
                  ? 'border-[#e2d5c1] dark:border-[#153675] opacity-80'
                  : 'border-[#e2d5c1] dark:border-[#153675]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5] bg-[#edf3fa] dark:bg-[#041029] px-2 py-0.5 rounded border border-[#c0d4ed] dark:border-[#153675]">
                    {item.branchName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.priority === 'High' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    item.priority === 'Medium' ? 'bg-[#faf3df] text-[#8a680e] dark:bg-[#C59B27]/20 dark:text-[#C59B27]' :
                    'bg-[#f8f0e5] text-[#5a677a] dark:bg-[#041029] dark:text-[#d8cebe]'
                  }`}>
                    {item.priority} Priority
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-[#5a677a] dark:text-[#d8cebe]">
                  <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Target: {formatDate(item.timeline)}</span>
                </div>
              </div>

              {/* Finding & Recommendation */}
              <div className="space-y-1 my-2 text-xs">
                <div>
                  <span className="font-bold text-[#082052] dark:text-[#F8F0E5]">Finding: </span>
                  <span className="text-[#5a677a] dark:text-[#d8cebe]">{item.finding}</span>
                </div>
                <div>
                  <span className="font-bold text-[#082052] dark:text-[#C59B27]">Action: </span>
                  <span className="text-[#222d3d] dark:text-[#F8F0E5] font-medium">{item.recommendation}</span>
                </div>
              </div>

              {/* Responsible Person & Status Selector */}
              <div className="pt-2 mt-2 border-t border-[#e2d5c1] dark:border-[#153675] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-[#5a677a] dark:text-[#d8cebe]">
                  Assigned to: <strong className="text-[#082052] dark:text-[#F8F0E5]">{item.responsiblePerson}</strong>
                  {item.followUpRemarks && (
                    <span className="block text-[11px] text-[#7f8c9f] italic mt-0.5">
                      Note: {item.followUpRemarks}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <select
                    value={item.currentStatus}
                    onChange={(e) => {
                      onUpdateActionStatus(item.reportId, item.findingIndex, e.target.value);
                    }}
                    className={`text-xs font-bold py-1 px-2.5 rounded-lg border cursor-pointer ${
                      item.currentStatus === 'Completed'
                        ? 'bg-[#edf3fa] text-[#082052] border-[#c0d4ed] dark:bg-[#041029] dark:text-[#F8F0E5]'
                        : item.currentStatus === 'In Progress'
                        ? 'bg-[#faf3df] text-[#8a680e] border-[#e8d59f]'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    onClick={() => onViewReport(item.originalReport)}
                    className="text-xs text-[#082052] dark:text-[#C59B27] hover:underline font-bold"
                  >
                    View Report
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center bg-white dark:bg-[#082052] rounded-xl border border-[#e2d5c1] dark:border-[#153675]">
            <CheckSquare className="w-8 h-8 text-[#7f8c9f] mx-auto mb-2" />
            <p className="text-xs text-[#5a677a] dark:text-[#d8cebe]">No action items matching your filter.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ActionPlanScreen;
