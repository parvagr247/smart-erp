import React from 'react';
import DataTable from '@shared/components/DataTable';
import StatusBadge from '@shared/components/StatusBadge';
import { Trash2, Edit2, Info } from 'lucide-react';
import './styles/LedgerTable.css';

export default function LedgerTable({ ledgers, onNavigate, onDelete }) {
  const columns = [
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
        <div className="table-actions-container">
          <button onClick={() => onNavigate(`/accounting/ledgers/${row.id}`)} className="table-btn-info"><Info size={12} /> Details</button>
          <button onClick={() => onNavigate(`/accounting/ledgers/edit/${row.id}`)} className="table-btn-warning"><Edit2 size={12} /> Edit</button>
          <button onClick={() => onDelete(row.id)} className="table-btn-danger"><Trash2 size={12} /> Delete</button>
        </div>
      )
    }
  ];

  return <DataTable columns={columns} data={ledgers} />;
}
