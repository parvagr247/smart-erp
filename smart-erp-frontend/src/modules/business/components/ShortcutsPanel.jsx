import React from 'react';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import { Plus } from 'lucide-react';
import './styles/ShortcutsPanel.css';

export default function ShortcutsPanel({ navigate }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      <SectionCard title="Shortcuts" description="Instantly open setup forms" className="lg:col-span-2 text-left">
        <div className="db-shortcut-grid">
          <ActionButton label="Create Ledger" icon={<Plus size={14} />} variant="outline" onClick={() => navigate('/accounting/ledgers/create')} className="w-full justify-start py-3" />
          <ActionButton label="Create Partner" icon={<Plus size={14} />} variant="outline" onClick={() => navigate('/inventory/partners/create')} className="w-full justify-start py-3" />
          <ActionButton label="Add Stock Item" icon={<Plus size={14} />} variant="outline" onClick={() => navigate('/inventory/stock-items/create')} className="w-full justify-start py-3" />
          <ActionButton label="Manage Warehouses" icon={<Plus size={14} />} variant="outline" onClick={() => navigate('/inventory/warehouses')} className="w-full justify-start py-3" />
          <ActionButton label="Manage Units" icon={<Plus size={14} />} variant="outline" onClick={() => navigate('/inventory/units')} className="w-full justify-start py-3" />
          <ActionButton label="Manage Tax & HSN" icon={<Plus size={14} />} variant="outline" onClick={() => navigate('/inventory/tax-categories')} className="w-full justify-start py-3" />
        </div>
      </SectionCard>
      
      <SectionCard title="Notifications" description="Updates from system audit logs" className="text-left">
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-3">
          <div className="db-announcement-card">
            <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Welcome!</strong>
            System parameters synced with company database context.
          </div>
          <div className="db-announcement-muted">No new notifications.</div>
        </div>
      </SectionCard>
    </div>
  );
}
