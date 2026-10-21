// Schools List Screen: Master Directory of Registered Campuses
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Plus, 
  Search, 
  ExternalLink, 
  ShieldCheck 
} from 'lucide-react';

export const SchoolsListScreen = ({
  schools = [],
  regions = [],
  reports = [],
  onSelectSchoolForInspection,
  onViewReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const filteredSchools = schools.filter((s) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = s.branchName?.toLowerCase().includes(q);
      const matchCity = s.city?.toLowerCase().includes(q);
      const matchPrincipal = s.principalName?.toLowerCase().includes(q);
      const matchCode = s.code?.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchPrincipal && !matchCode) return false;
    }

    if (selectedRegion !== 'ALL' && s.region !== selectedRegion) {
      return false;
    }

    return true;
  });

  return (
    <div className="p-3 sm:p-5 max-w-7xl mx-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#082052] p-4 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#082052] dark:text-[#F8F0E5]">
            Registered Schools & Campuses
          </h2>
          <p className="text-xs text-[#5a677a] dark:text-[#d8cebe]">
            Dar-e-Arqam institutional registry across Central Regions
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-md bg-[#edf3fa] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5] border border-[#c0d4ed] dark:border-[#153675] self-start sm:self-auto font-mono tabular-nums">
          {schools.length} Registered Campuses
        </span>
      </div>

      {/* Search & Region Filters */}
      <div className="bg-white dark:bg-[#082052] p-3 rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5a677a]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by campus name, branch code, principal..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] placeholder:text-[#7f8c9f] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full text-xs py-2 px-3 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
          >
            <option value="ALL">All Regions</option>
            {regions.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of School Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredSchools.map((school) => {
          const schoolReports = reports.filter((r) => r.branchName === school.branchName);
          const latestReport = schoolReports[0];

          return (
            <div
              key={school.id}
              className="bg-white dark:bg-[#082052] rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs hover:border-[#082052]/60 dark:hover:border-[#C59B27] hover:shadow-sm transition-all p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#082052] dark:text-[#F8F0E5] bg-[#edf3fa] dark:bg-[#041029] px-2 py-0.5 rounded border border-[#c0d4ed] dark:border-[#153675]">
                      {school.code || 'DAS-CAMPUS'}
                    </span>
                    <h3 className="text-sm font-bold text-[#082052] dark:text-[#F8F0E5] mt-1 leading-snug">
                      {school.branchName}
                    </h3>
                  </div>
                  {latestReport?.overallScore?.percentage && (
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-[#edf3fa] text-[#082052] dark:bg-[#041029] dark:text-[#F8F0E5] border border-[#c0d4ed] dark:border-[#153675] shrink-0 font-mono tabular-nums">
                      {latestReport.overallScore.percentage}%
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#5a677a] dark:text-[#d8cebe] space-y-1 mb-3">
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#C59B27] shrink-0" />
                    <span className="truncate">{school.city || 'Punjab'}, {school.region}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-3.5 h-3.5 mr-1.5 text-[#C59B27] shrink-0" />
                    <span className="truncate">Principal: {school.principalName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-[#C59B27] shrink-0" />
                    <span>{school.principalContact}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {(school.levels || ['ECE', 'Primary', 'Middle', 'Secondary']).map((lvl) => (
                    <span
                      key={lvl}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f8f0e5] dark:bg-[#041029] text-[#5a677a] dark:text-[#d8cebe] border border-[#e2d5c1] dark:border-[#153675]"
                    >
                      {lvl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#e2d5c1] dark:border-[#153675] flex items-center justify-between">
                {latestReport ? (
                  <button
                    onClick={() => onViewReport(latestReport)}
                    className="text-xs font-bold text-[#082052] dark:text-[#C59B27] hover:underline flex items-center"
                  >
                    <span>View Latest Report</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                ) : (
                  <span className="text-[11px] text-[#7f8c9f] italic">No visit yet</span>
                )}

                <button
                  onClick={() => onSelectSchoolForInspection(school)}
                  className="px-2.5 py-1 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-[#F8F0E5] text-xs font-bold flex items-center space-x-1 shadow-xs transition-all active:scale-98"
                >
                  <Plus className="w-3 h-3 text-[#C59B27]" />
                  <span>Start Inspection</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SchoolsListScreen;
