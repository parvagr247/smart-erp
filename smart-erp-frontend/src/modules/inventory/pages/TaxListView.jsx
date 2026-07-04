import React, { useState } from 'react';
import { useTaxListViewData } from './services/TaxListViewService';
import TaxCategoryPanel from '../components/TaxCategoryPanel';
import HsnPanel from '../components/HsnPanel';
import './styles/TaxListView.css';

export default function TaxListView() {
  const { taxes, hsns, loading, message, handleCreateTax, handleCreateHsn, handleDeleteTax, handleDeleteHsn } = useTaxListViewData();
  const [activeTab, setActiveTab] = useState('tax');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Tax & HSN Masters</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure global GST schedules and Harmonized Nomenclature mappings.</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex">
          <button onClick={() => setActiveTab('tax')} className={activeTab === 'tax' ? 'tab-btn-active' : 'tab-btn-inactive'}>Tax Categories</button>
          <button onClick={() => setActiveTab('hsn')} className={activeTab === 'hsn' ? 'tab-btn-active' : 'tab-btn-inactive'}>HSN Codes</button>
        </div>
      </div>
      {activeTab === 'tax' ? (
        <TaxCategoryPanel taxes={taxes} submitLoading={loading} message={message} onCreate={handleCreateTax} onDelete={handleDeleteTax} />
      ) : (
        <HsnPanel hsns={hsns} taxes={taxes} submitLoading={loading} message={message} onCreate={handleCreateHsn} onDelete={handleDeleteHsn} />
      )}
    </div>
  );
}
