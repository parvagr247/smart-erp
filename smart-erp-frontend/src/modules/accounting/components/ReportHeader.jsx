import React from 'react';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import './styles/ReportHeader.css';

export default function ReportHeader({ currentReport, onBack, onPrint, onExport }) {
  return (
    <div className="report-header">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-neutral-100 dark:hover:bg-slate-700 rounded-lg transition">
          <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </button>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-slate-100">{currentReport.title}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{currentReport.desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onPrint} className="report-btn-secondary"><Printer className="w-4 h-4" /> Print</button>
        <button onClick={onExport} className="report-btn-secondary"><Download className="w-4 h-4" /> Export CSV</button>
      </div>
    </div>
  );
}
