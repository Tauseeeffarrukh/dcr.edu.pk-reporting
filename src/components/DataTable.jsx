// Responsive Mobile & Desktop Data Table with Search & Pagination
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  keyExtractor = (item, index) => item.id || index,
  searchPlaceholder = 'Search records...',
  pageSize = 10,
  emptyMessage = 'No records found',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Search filtering
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(item).some((val) => {
      if (typeof val === 'string') return val.toLowerCase().includes(term);
      if (typeof val === 'number') return String(val).includes(term);
      return false;
    });
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const displayedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className={`bg-white dark:bg-[#082052] rounded-xl border border-[#e2d5c1] dark:border-[#153675] shadow-xs overflow-hidden ${className}`}>
      {/* Search Header */}
      <div className="p-3 border-b border-[#e2d5c1] dark:border-[#153675] flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5a677a]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] placeholder:text-[#7f8c9f] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
          />
        </div>
        <span className="text-xs text-[#5a677a] dark:text-[#d8cebe] font-mono tabular-nums ml-2">
          {filteredData.length} records
        </span>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#222d3d] dark:text-[#F8F0E5]">
          <thead className="bg-[#f8f0e5] dark:bg-[#041029] text-[#082052] dark:text-[#F8F0E5] font-bold uppercase tracking-wider text-[11px] border-b border-[#e2d5c1] dark:border-[#153675]">
            <tr>
              {columns.map((col, idx) => (
                <th key={col.key || idx} className={`px-3.5 py-2.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2d5c1] dark:divide-[#153675]">
            {displayedData.length > 0 ? (
              displayedData.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  className="hover:bg-[#faf6f0] dark:hover:bg-[#0e2e6e]/60 transition-colors"
                >
                  {columns.map((col, cIdx) => (
                    <td key={col.key || cIdx} className={`px-3.5 py-3 ${col.className || ''}`}>
                      {col.render ? col.render(item, index) : item[col.key] || '—'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-[#7f8c9f]">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-[#e2d5c1] dark:border-[#153675] flex items-center justify-between">
          <span className="text-xs text-[#5a677a] dark:text-[#d8cebe] font-mono tabular-nums">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-[#e2d5c1] dark:border-[#153675] disabled:opacity-40 hover:bg-[#f8f0e5] dark:hover:bg-[#0e2e6e] text-[#082052] dark:text-[#F8F0E5]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-[#e2d5c1] dark:border-[#153675] disabled:opacity-40 hover:bg-[#f8f0e5] dark:hover:bg-[#0e2e6e] text-[#082052] dark:text-[#F8F0E5]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
