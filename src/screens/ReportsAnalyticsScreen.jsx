// Reports & Analytics Screen: Verified Branch Ranking Table & Regional Insights
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React, { useState } from 'react';
import { 
  Award, 
  FileSpreadsheet, 
  Search, 
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { calculateBranchOverallSummary } from '../utils/calculations';
import { getPerformanceCategory } from '../utils/performanceCategories';
import exportService from '../services/exportService';

export const ReportsAnalyticsScreen = ({
  reports = [],
  regions = [],
  onViewReport,
  settings,
}) => {
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('percentage'); // 'percentage', 'branchName'

  // Build ranking list from reports
  const rankingList = reports.map((r) => {
    const summary = calculateBranchOverallSummary(
      r.classEvaluations || [],
      r.hifzEvaluations || [],
      r.activitiesProjectMarks || 20
    );
    const category = getPerformanceCategory(summary.overall.percentage);

    return {
      id: r.id,
      originalReport: r,
      srNo: r.srNo,
      branchName: r.branchName,
      region: r.region,
      visitDate: r.visitDate,
      status: r.status,
      classroom: summary.classroom,
      students: summary.students,
      teachers: summary.teachers,
      activities: summary.activities,
      overall: summary.overall,
      category,
    };
  });

  // Filter
  const filtered = rankingList.filter((item) => {
    if (selectedRegion !== 'ALL' && item.region !== selectedRegion) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (!item.branchName.toLowerCase().includes(q) && !item.region.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'percentage') {
      return b.overall.percentage - a.overall.percentage;
    }
    return a.branchName.localeCompare(b.branchName);
  });

  // Trigger export of branch ranking to Excel
  const handleExportRankingExcel = () => {
    const primaryReport = reports[0];
    if (primaryReport) {
      exportService.downloadExcelFile(primaryReport, settings);
    }
  };

  return (
    <div className="p-3 sm:p-5 max-w-7xl mx-auto space-y-4">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#082052] p-4 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#082052] dark:text-[#F8F0E5] flex items-center">
            <Award className="w-5 h-5 text-[#C59B27] mr-2" />
            Branch Ranking & Performance Matrix
          </h2>
          <p className="text-xs text-[#5a677a] dark:text-[#d8cebe]">
            Official ranking matrix calculated strictly according to Central M&E Marking Criteria
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportRankingExcel}
            className="px-3.5 py-1.5 rounded-xl bg-[#082052] hover:bg-[#0e2e6e] text-[#F8F0E5] text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all active:scale-98"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#C59B27]" />
            <span>Export Ranking to Excel</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#082052] p-3 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5a677a]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search branch or region..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] placeholder:text-[#7f8c9f] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#5a677a] dark:text-[#d8cebe] shrink-0">Region:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
          >
            <option value="ALL">All Regions</option>
            {regions.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortField(sortField === 'percentage' ? 'branchName' : 'percentage')}
            className="px-2.5 py-1.5 rounded-lg border border-[#e2d5c1] dark:border-[#153675] text-xs font-semibold flex items-center space-x-1 hover:bg-[#f8f0e5] dark:hover:bg-[#0c2a68] text-[#082052] dark:text-[#F8F0E5] transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>{sortField === 'percentage' ? 'By Score' : 'By Name'}</span>
          </button>
        </div>
      </div>

      {/* Main Official Ranking Table */}
      <div className="bg-white dark:bg-[#082052] rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8f0e5] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5] font-bold border-b border-[#e2d5c1] dark:border-[#153675]">
              <tr>
                <th rowSpan="2" className="p-3 text-center w-12 border-r border-[#e2d5c1] dark:border-[#153675]">Rank</th>
                <th rowSpan="2" className="p-3 border-r border-[#e2d5c1] dark:border-[#153675]">Branch Name & Region</th>
                <th colSpan="2" className="p-2 text-center border-r border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#082052]">
                  Classroom (20)
                </th>
                <th colSpan="2" className="p-2 text-center border-r border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#082052]">
                  Students (25)
                </th>
                <th colSpan="2" className="p-2 text-center border-r border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#082052]">
                  Teachers (25)
                </th>
                <th colSpan="2" className="p-2 text-center border-r border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#082052]">
                  Activities (25)
                </th>
                <th colSpan="2" className="p-2 text-center border-r border-[#e2d5c1] dark:border-[#153675] bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5]">
                  Overall Total
                </th>
                <th rowSpan="2" className="p-3 text-center">Category</th>
                <th rowSpan="2" className="p-3 text-center">Action</th>
              </tr>
              <tr className="border-t border-[#e2d5c1] dark:border-[#153675] text-[10px]">
                <th className="p-1 text-center font-medium">Tot</th>
                <th className="p-1 text-center font-bold border-r border-[#e2d5c1] dark:border-[#153675]">Obt</th>
                <th className="p-1 text-center font-medium">Tot</th>
                <th className="p-1 text-center font-bold border-r border-[#e2d5c1] dark:border-[#153675]">Obt</th>
                <th className="p-1 text-center font-medium">Tot</th>
                <th className="p-1 text-center font-bold border-r border-[#e2d5c1] dark:border-[#153675]">Obt</th>
                <th className="p-1 text-center font-medium">Tot</th>
                <th className="p-1 text-center font-bold border-r border-[#e2d5c1] dark:border-[#153675]">Obt</th>
                <th className="p-1 text-center font-bold bg-[#edf3fa] dark:bg-[#041029] text-[#5a677a] dark:text-[#d8cebe]">Tot</th>
                <th className="p-1 text-center font-bold border-r border-[#e2d5c1] dark:border-[#153675] bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5]">Obt</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e2d5c1] dark:divide-[#153675] font-mono tabular-nums">
              {sorted.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#faf6f0] dark:hover:bg-[#0e2e6e]/60 transition-colors"
                >
                  <td className="p-3 text-center font-extrabold border-r border-[#e2d5c1] dark:border-[#153675]">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold ${
                      idx === 0 ? 'bg-[#082052] text-[#F8F0E5] shadow-xs ring-1 ring-[#C59B27]' :
                      idx === 1 ? 'bg-[#1c499c] text-white' :
                      idx === 2 ? 'bg-[#faf3df] text-[#8a680e] border border-[#e8d59f]' :
                      'text-[#5a677a] dark:text-[#d8cebe]'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>

                  <td className="p-3 border-r border-[#e2d5c1] dark:border-[#153675] font-sans">
                    <div className="font-bold text-[#082052] dark:text-[#F8F0E5]">{item.branchName}</div>
                    <div className="text-[10px] text-[#7f8c9f] mt-0.5">{item.region} · {item.srNo}</div>
                  </td>

                  {/* Classroom */}
                  <td className="p-2 text-center text-[#7f8c9f]">{item.classroom.total}</td>
                  <td className="p-2 text-center font-bold border-r border-[#e2d5c1] dark:border-[#153675] text-[#222d3d] dark:text-[#F8F0E5]">{item.classroom.obtained}</td>

                  {/* Students */}
                  <td className="p-2 text-center text-[#7f8c9f]">{item.students.total}</td>
                  <td className="p-2 text-center font-bold border-r border-[#e2d5c1] dark:border-[#153675] text-[#222d3d] dark:text-[#F8F0E5]">{item.students.obtained}</td>

                  {/* Teachers */}
                  <td className="p-2 text-center text-[#7f8c9f]">{item.teachers.total}</td>
                  <td className="p-2 text-center font-bold border-r border-[#e2d5c1] dark:border-[#153675] text-[#222d3d] dark:text-[#F8F0E5]">{item.teachers.obtained}</td>

                  {/* Activities */}
                  <td className="p-2 text-center text-[#7f8c9f]">{item.activities.total}</td>
                  <td className="p-2 text-center font-bold border-r border-[#e2d5c1] dark:border-[#153675] text-[#222d3d] dark:text-[#F8F0E5]">{item.activities.obtained}</td>

                  {/* Overall */}
                  <td className="p-2 text-center font-bold bg-[#edf3fa]/60 dark:bg-[#041029]/40 text-[#5a677a]">{item.overall.total}</td>
                  <td className="p-2 text-center font-black bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5] border-r border-[#e2d5c1] dark:border-[#153675]">
                    {item.overall.obtained}
                  </td>

                  {/* Category */}
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                      item.overall.percentage >= 80 ? 'bg-[#edf3fa] text-[#082052] border-[#c0d4ed] dark:bg-[#041029] dark:text-[#F8F0E5] dark:border-[#153675]' :
                      item.overall.percentage >= 70 ? 'bg-[#faf3df] text-[#8a680e] border-[#e8d59f]' :
                      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {item.overall.percentage}% ({item.category.code})
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-3 text-center font-sans">
                    <button
                      onClick={() => onViewReport(item.originalReport)}
                      className="p-1 text-[#7f8c9f] hover:text-[#082052] dark:hover:text-[#F8F0E5] transition-colors"
                      title="Open Report"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ReportsAnalyticsScreen;
