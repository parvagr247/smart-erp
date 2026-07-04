import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import { useLedgerDetailsViewData } from './services/LedgerDetailsViewService';
import LedgerProfileCard from '../components/LedgerProfileCard';
import LedgerTaxCard from '../components/LedgerTaxCard';
import LedgerContactCard from '../components/LedgerContactCard';
import { ArrowLeft, Edit, Landmark } from 'lucide-react';
import './styles/LedgerDetailsView.css';

export default function LedgerDetailsView() {
  const { navigate, ledger, loading, copiedField, copyToClipboard } = useLedgerDetailsViewData();

  if (loading) return <div className="p-12 text-center animate-pulse text-[var(--primary)] font-semibold">Loading details...</div>;
  if (!ledger) return <div className="p-12 text-center text-rose-500 font-semibold">Ledger not found.</div>;

  return (
    <PageContainer>
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-[var(--border-light)]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-indigo-600 text-white flex items-center justify-center shadow-md"><Landmark size={20} /></div>
          <div className="text-left">
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">{ledger.name}</h1>
            <p className="text-xs text-[var(--text-secondary)] font-medium">Inspect company ledger configuration parameters and tax status</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => navigate('/accounting/ledgers')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] transition-all text-xs font-semibold cursor-pointer w-full md:w-auto justify-center"><ArrowLeft size={14} />Back</button>
          <button onClick={() => navigate(`/accounting/ledgers/edit/${ledger.id}`)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-indigo-600 hover:opacity-90 text-white font-semibold text-xs shadow-md transition-all cursor-pointer w-full md:w-auto justify-center"><Edit size={14} />Edit Ledger</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        <LedgerProfileCard ledger={ledger} />
        <LedgerTaxCard ledger={ledger} copiedField={copiedField} onCopy={copyToClipboard} />
        <LedgerContactCard ledger={ledger} />
      </div>
    </PageContainer>
  );
}
