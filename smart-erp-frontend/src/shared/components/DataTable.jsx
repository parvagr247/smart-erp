import React from 'react';
import { useDataTableData } from './services/DataTableService';
import { NavigationManager } from '@shared/keyboard/NavigationManager';
import './styles/DataTable.css';

export default function DataTable(props) {
  const { columns, data, loading = false, emptyMessage = 'No records found.' } = props;
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

  return (
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
  );
}
