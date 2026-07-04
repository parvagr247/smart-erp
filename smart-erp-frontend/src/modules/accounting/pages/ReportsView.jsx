import React from 'react';
import { useReportsViewData, reportsList } from './services/ReportsViewService';
import ReportsGrid from '../components/ReportsGrid';
import ReportHeader from '../components/ReportHeader';
import ReportFilters from '../components/ReportFilters';
import ReportPane from '../components/ReportPane';
import './styles/ReportsView.css';

export default function ReportsView() {
  const state = useReportsViewData();
  const { selectedReport, setSelectedReport, loading, reportData, error, partnerType, navigate, loadReportData, handleExportCsv, handlePrint, setReportData } = state;

  if (!selectedReport) return <ReportsGrid reportsList={reportsList} onSelectReport={setSelectedReport} />;
  const currentReport = reportsList.find(r => r.key === selectedReport);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ReportHeader currentReport={currentReport} onBack={() => { setSelectedReport(null); setReportData(null); }} onPrint={handlePrint} onExport={handleExportCsv} />
      <ReportFilters {...state} onLoad={loadReportData} />
      <ReportPane selectedReport={selectedReport} loading={loading} error={error} reportData={reportData} partnerType={partnerType} navigate={navigate} />
    </div>
  );
}
