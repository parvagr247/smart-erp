import React from 'react';
import { useNavigate } from 'react-router-dom';
import usePartnerList from './usePartnerList';
import StatusBadge from '@shared/components/StatusBadge';
import ActionButton from '@shared/components/ActionButton';
import { Eye, Edit3, ShieldAlert, CheckCircle, Trash2 } from 'lucide-react';

export function usePartnerListViewData() {
  const navigate = useNavigate();
  const listState = usePartnerList();
  const { handleDelete, handleStatusChange } = listState;

  const columns = [
    { key: 'code', header: 'Partner Code' },
    { key: 'name', header: 'Partner Name' },
    { key: 'type', header: 'Type' },
    { key: 'email', header: 'Email Address' },
    { key: 'phone', header: 'Phone' },
    { 
      key: 'openingBalance', 
      header: 'Opening Balance', 
      render: (row) => `${row.openingBalance || '0.00'} ${row.balanceType || ''}` 
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (row) => <StatusBadge status={row.status} /> 
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <ActionButton label="View" variant="secondary" icon={<Eye size={12} />} onClick={() => navigate(`/inventory/partners/${row.id}`)} />
          <ActionButton label="Edit" variant="secondary" icon={<Edit3 size={12} />} onClick={() => navigate(`/inventory/partners/edit/${row.id}`)} />
          <ActionButton
            label={row.status === 'ACTIVE' ? 'Block' : 'Unblock'}
            variant={row.status === 'ACTIVE' ? 'outline' : 'secondary'}
            icon={row.status === 'ACTIVE' ? <ShieldAlert size={12} /> : <CheckCircle size={12} />}
            onClick={() => handleStatusChange(row.id, row.status)}
          />
          <ActionButton label="Delete" variant="destructive" icon={<Trash2 size={12} />} onClick={() => handleDelete(row.id)} />
        </div>
      )
    }
  ];

  return { navigate, columns, ...listState };
}
