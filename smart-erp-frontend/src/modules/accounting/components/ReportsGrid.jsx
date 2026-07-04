import React from 'react';
import { Scale, TrendingUp, Layers, DollarSign, FileText, Package, Percent } from 'lucide-react';
import './styles/ReportsGrid.css';

export default function ReportsGrid({ reportsList, onSelectReport }) {
  const iconMap = {
    'trial-balance': <Scale className="text-indigo-600 w-6 h-6" />,
    'profit-loss': <TrendingUp className="text-emerald-500 w-6 h-6" />,
    'balance-sheet': <Layers className="text-blue-500 w-6 h-6" />,
    'cash-bank': <DollarSign className="text-amber-500 w-6 h-6" />,
    'outstanding': <FileText className="text-purple-500 w-6 h-6" />,
    'inventory-valuation': <Package className="text-indigo-500 w-6 h-6" />,
    'stock-register': <Package className="text-orange-500 w-6 h-6" />,
    'gst-summary': <Percent className="text-rose-500 w-6 h-6" />,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-slate-100">Financial Reports & Statements</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">Generate, view, print, and export live corporate accounting and inventory reports.</p>
      </div>
      <div className="reports-grid">
        {reportsList.map(rep => (
          <div key={rep.key} onClick={() => onSelectReport(rep.key)} className="report-card">
            <div>
              <div className="report-card-icon-wrap">{iconMap[rep.iconType]}</div>
              <h3 className="report-card-title dark:text-slate-200">{rep.title}</h3>
              <p className="report-card-desc">{rep.desc}</p>
            </div>
            <div className="report-card-action">Generate Statement &rarr;</div>
          </div>
        ))}
      </div>
    </div>
  );
}
