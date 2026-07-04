import React from 'react';
import { useDataTableData } from './services/DataTableService';
import { NavigationManager } from '@shared/interaction/NavigationManager';
import { exportToCSV, exportToExcel } from '@shared/utils/exportUtils';
import PrintHeader from './PrintHeader';
import { Download, Printer } from 'lucide-react';
import './styles/DataTable.css';

export default function DataTable(props) {
  const { 
    columns, 
    data, 
    loading = false, 
    emptyMessage = 'No records found.',
    showExport = true,
    exportTitle = "System List",
    exportFilters = ""
  } = props;
  const { getRowKey } = useDataTableData();

  if (loading) {
    return (
      <div className="data-table-wrapper">
        <div className="data-table-scroll">
          <table className="data-table animate-pulse">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={col.className || ''}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((col) => (
                    <td key={col.key} className="data-table-loader-td">
                      <div className="data-table-skeleton-bar"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const handleExportCSV = () => {
    const headers = columns.map(c => c.key);
    const headerLabels = columns.map(c => c.header);
    const rawRows = getRawRows();
    exportToCSV(`${exportTitle.toLowerCase().replace(/\s+/g, '_')}_export`, headers, rawRows, headerLabels);
  };

  const handleExportExcel = () => {
    const headers = columns.map(c => c.key);
    const headerLabels = columns.map(c => c.header);
    const rawRows = getRawRows();
    exportToExcel(`${exportTitle.toLowerCase().replace(/\s+/g, '_')}_export`, headers, rawRows, headerLabels);
  };

  const handlePrint = () => {
    window.print();
  };

  const getRawRows = () => {
    return data.map(row => {
      const obj = {};
      columns.forEach(col => {
        let val = row[col.key];
        if (col.render) {
          try {
            const rendered = col.render(row);
            if (typeof rendered === 'string' || typeof rendered === 'number') {
              val = rendered;
            } else if (rendered && typeof rendered === 'object') {
              if (rendered.props && rendered.props.children) {
                if (typeof rendered.props.children === 'string' || typeof rendered.props.children === 'number') {
                  val = rendered.props.children;
                } else if (Array.isArray(rendered.props.children)) {
                  val = rendered.props.children.filter(x => typeof x === 'string' || typeof x === 'number').join(' ');
                }
              }
            }
          } catch (e) {}
        }
        obj[col.key] = val !== undefined && val !== null ? val : '—';
      });
      return obj;
    });
  };

  return (
    <div className="w-full space-y-3">
      {/* Export Action Bar (hidden in print) */}
      {showExport && data.length > 0 && (
        <div className="print:hidden flex justify-end items-center gap-2 mb-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 border border-[var(--border-light)] hover:bg-[var(--bg-hover)] bg-[var(--bg-surface)] rounded-lg text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Download size={12} /> CSV
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3 py-1.5 border border-[var(--border-light)] hover:bg-[var(--bg-hover)] bg-[var(--bg-surface)] rounded-lg text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Download size={12} /> Excel
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 border border-[var(--border-light)] hover:bg-[var(--bg-hover)] bg-[var(--bg-surface)] rounded-lg text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Printer size={12} /> Print / PDF
          </button>
        </div>
      )}

      {/* Print-only Header (only shown during window.print()) */}
      <PrintHeader title={exportTitle} filtersApplied={exportFilters} />

      <div className="data-table-wrapper">
        <div className="data-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={col.className || ''}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="data-table-empty-row">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr 
                    key={getRowKey(row, idx)}
                    tabIndex={0}
                    onKeyDown={(e) => NavigationManager.handleTableNavigation(e, e.currentTarget)}
                    className="cursor-pointer focus:bg-[var(--bg-input)] focus:outline-none"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={col.cellClassName || ''}>
                        {col.render ? col.render(row) : row[col.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
