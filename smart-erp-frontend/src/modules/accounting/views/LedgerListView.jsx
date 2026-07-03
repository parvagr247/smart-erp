import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import DataTable from '@shared/components/DataTable';
import ActionButton from '@shared/components/ActionButton';
import StatusBadge from '@shared/components/StatusBadge';
import Pagination from '@shared/components/Pagination';
import { Input } from '@shared/components/ui/input';
import { fetchLedgersList, fetchGroupsList, deleteLedgerApi } from '@modules/accounting/services/accounting.service';
import { Plus, Search, Trash2, Edit2, Info } from 'lucide-react';

export default function LedgerListView() {
  const navigate = useNavigate();
  const [ledgers, setLedgers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [groupId, setGroupId] = useState('');
  const [isActive, setIsActive] = useState('');
  const [balanceType, setBalanceType] = useState('');
  const [gstApplicable, setGstApplicable] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadLedgers = async () => {
    const params = {
      page, size: 10, search: search || null,
      groupId: groupId || null,
      isActive: isActive !== '' ? isActive === 'true' : null,
      balanceType: balanceType || null,
      gstApplicable: gstApplicable !== '' ? gstApplicable === 'true' : null
    };
    const res = await fetchLedgersList(params);
    setLedgers(res.data?.content || []);
    setTotalPages(res.data?.totalPages || 0);
  };

  useEffect(() => { loadLedgers(); }, [page, groupId, isActive, balanceType, gstApplicable]);
  useEffect(() => { fetchGroupsList().then(res => setGroups(res.data || [])); }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this ledger?')) {
      await deleteLedgerApi(id);
      loadLedgers();
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Ledger Master List" description="Configure company ledger files and assign groups">
        <ActionButton label="Create Ledger" icon={<Plus size={14} />} onClick={() => navigate('/accounting/ledgers/create')} />
      </PageHeader>

      <div className="flex flex-wrap gap-4 items-center bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-light)] w-full justify-between">
        <div className="flex items-center gap-2 flex-grow max-w-sm">
          <Input placeholder="Search name, GSTIN, phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <ActionButton label="Search" icon={<Search size={14} />} onClick={loadLedgers} />
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <select className="p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-[var(--text-primary)] cursor-pointer" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            <option value="">-- All Groups --</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <select className="p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-[var(--text-primary)] cursor-pointer" value={isActive} onChange={(e) => setIsActive(e.target.value)}>
            <option value="">-- All Status --</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
          <select className="p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-[var(--text-primary)] cursor-pointer" value={balanceType} onChange={(e) => setBalanceType(e.target.value)}>
            <option value="">-- All Balance Types --</option>
            <option value="DEBIT">Debit (Dr)</option>
            <option value="CREDIT">Credit (Cr)</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Ledger Name' },
          { key: 'groupName', header: 'Group Category' },
          { key: 'openingBalance', header: 'Opening Balance', render: (row) => `₹${row.openingBalance?.toFixed(2) || '0.00'}` },
          { key: 'balanceType', header: 'Type' },
          { key: 'gstNumber', header: 'GSTIN', render: (row) => row.gstNumber || 'N/A' },
          { key: 'isActive', header: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'Active' : 'Inactive'} /> },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate(`/accounting/ledgers/${row.id}`)} className="text-xs text-[var(--primary)] hover:underline flex items-center gap-0.5 cursor-pointer"><Info size={12} /> Details</button>
                <button onClick={() => navigate(`/accounting/ledgers/edit/${row.id}`)} className="text-xs text-amber-500 hover:underline flex items-center gap-0.5 cursor-pointer"><Edit2 size={12} /> Edit</button>
                <button onClick={() => handleDelete(row.id)} className="text-xs text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"><Trash2 size={12} /> Delete</button>
              </div>
            )
          }
        ]}
        data={ledgers}
      />

      <Pagination currentPage={page + 1} totalPages={totalPages} onPageChange={(p) => setPage(p - 1)} />
    </PageContainer>
  );
}
