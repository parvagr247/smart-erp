import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import LedgerFormFields from '../components/LedgerFormFields';
import { useCreateLedgerViewData } from './services/CreateLedgerViewService';
import './styles/CreateLedgerView.css';

export default function CreateLedgerView() {
  const { navigate, groups, loading, error, errors, bind, handleSubmit } = useCreateLedgerViewData();

  return (
    <PageContainer>
      <PageHeader title="Create Ledger" description="Register a new ledger account master inside the active company scope" />
      <SectionCard title="Ledger Details" description="Fill out ledger name, group, opening balances, and contact details">
        {error && <div className="p-3 mb-4 text-sm text-red-500 rounded bg-red-500/10 border border-red-500/20">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-3xl">
          <LedgerFormFields bind={bind} errors={errors} groups={groups} />
          <div className="flex gap-2 justify-end pt-4 border-t border-[var(--border-light)]">
            <ActionButton label="Cancel" variant="outline" type="button" onClick={() => navigate('/accounting/ledgers')} />
            <ActionButton label="Create Ledger" type="submit" disabled={loading} />
          </div>
        </form>
      </SectionCard>
    </PageContainer>
  );
}
