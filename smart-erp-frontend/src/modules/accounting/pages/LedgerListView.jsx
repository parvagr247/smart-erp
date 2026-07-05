import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import ActionButton from '@shared/components/ActionButton';
import Pagination from '@shared/components/Pagination';
import { Plus } from 'lucide-react';
import { useLedgerListViewData } from './services/LedgerListViewService';
import LedgerFilterPanel from '../components/LedgerFilterPanel';
import LedgerTable from '../components/LedgerTable';
import './styles/LedgerListView.css';

export default function LedgerListView() {
  const navigate = useNavigate();
  const listState = useLedgerListViewData();

  return (
    <PageContainer>
      <div className="ledger-list-wrapper">
        <PageHeader title="Ledger Master List" description="Configure company ledger files and assign groups">
          <ActionButton label="Create Ledger" icon={<Plus size={14} />} onClick={() => navigate('/accounting/ledgers/create')} />
        </PageHeader>
        <LedgerFilterPanel {...listState} onSearch={listState.loadLedgers} />
        <LedgerTable ledgers={listState.ledgers} onNavigate={navigate} onDelete={listState.handleDelete} />
        <Pagination currentPage={listState.page + 1} totalPages={listState.totalPages} onPageChange={(p) => listState.setPage(p - 1)} />
      </div>
    </PageContainer>
  );
}
