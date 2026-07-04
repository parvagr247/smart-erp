import React from 'react';
import { useReportsViewData, reportsList } from './services/ReportsViewService';
import ReportsGrid from '../components/ReportsGrid';
import ReportHeader from '../components/ReportHeader';
import ReportFilters from '../components/ReportFilters';
import ReportPane from '../components/ReportPane';
import { useAuth } from '@shared/context/AuthContext';
import AccessDeniedView from '@shared/components/AccessDeniedView';
import './styles/ReportsView.css';

export default function ReportsView() {
  const state = useReportsViewData();
  const { selectedReport, setSelectedReport, loading, reportData, error, partnerType, navigate, loadReportData, handleExportCsv, handlePrint, setReportData } = state;
  const { hasPermission } = useAuth();

  const permittedReports = reportsList.filter(report => hasPermission(report.requiredPermission));

  if (!selectedReport) {
    if (permittedReports.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl max-w-lg mx-auto mt-20 shadow-xs">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-full mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">No Reports Available</h2>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mb-4 leading-relaxed">
            You currently do not have permission to access any reports. Contact your administrator if additional reporting access is required.
          </p>
        </div>
      );
    }
    return <ReportsGrid reportsList={permittedReports} onSelectReport={setSelectedReport} />;
  }

  const currentReport = reportsList.find(r => r.key === selectedReport);

  if (currentReport && !hasPermission(currentReport.requiredPermission)) {
    return <AccessDeniedView />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ReportHeader currentReport={currentReport} onBack={() => { setSelectedReport(null); setReportData(null); }} onPrint={handlePrint} onExport={handleExportCsv} />
      <ReportFilters {...state} onLoad={loadReportData} />
      <ReportPane selectedReport={selectedReport} loading={loading} error={error} reportData={reportData} partnerType={partnerType} navigate={navigate} />
    </div>
  );
}
