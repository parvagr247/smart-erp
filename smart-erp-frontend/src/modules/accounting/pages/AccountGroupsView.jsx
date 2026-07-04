import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import AccountGroupNode from '../components/AccountGroupNode';
import { useAccountGroupsViewData } from './services/AccountGroupsViewService';
import { Plus } from 'lucide-react';
import './styles/AccountGroupsView.css';

export default function AccountGroupsView() {
  const state = useAccountGroupsViewData();
  const {
    groups, filteredGroups, expanded, editGroup, showForm, setShowForm, name, setName, nature, setNature, parentId, setParentId,
    searchQuery, setSearchQuery, ledgerCountMap, groupLedgersMap, handleEdit, handleCreateChild, handleDelete, toggleActive, handleSubmit, toggleExpand
  } = state;

  return (
    <PageContainer>
      <PageHeader title="Chart of Accounts" description="Manage hierarchical account classifications and ledger categories">
        <ActionButton label="Create Group" icon={<Plus size={14} />} onClick={() => { setShowForm(true); setName(''); setParentId(''); }} />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        <SectionCard title="Account Groups Tree" description="Hierarchical Chart of Accounts" className="lg:col-span-2 text-left">
          <div className="mb-4">
            <Input placeholder="Search account groups..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="space-y-1 p-2 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-light)] max-h-[600px] overflow-y-auto">
            {filteredGroups.filter(g => !g.parentGroupId).map(node => (
              <AccountGroupNode key={node.id} node={node} groups={groups} expanded={expanded} setExpanded={toggleExpand} onEdit={handleEdit} onDelete={handleDelete} onToggleActive={toggleActive} onCreateChild={handleCreateChild} ledgerCountMap={ledgerCountMap} groupLedgersMap={groupLedgersMap} />
            ))}
          </div>
        </SectionCard>

        {showForm && (
          <SectionCard title={editGroup ? 'Edit Group' : 'Create Group'} description="Specify parent group and nature">
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div><Label htmlFor="name">Group Name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
              <div><Label htmlFor="nature">Nature</Label>
                <select id="nature" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:outline-none" value={nature} onChange={(e) => setNature(e.target.value)} disabled={!!editGroup?.isSystemGenerated}>
                  {['ASSET', 'LIABILITY', 'CAPITAL', 'INCOME', 'EXPENSE'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div><Label htmlFor="parent">Parent Group</Label>
                <select id="parent" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:outline-none" value={parentId} onChange={(e) => setParentId(e.target.value)}>
                  <option value="">-- No Parent (Root Group) --</option>
                  {groups.filter(g => !editGroup || g.id !== editGroup.id).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <ActionButton label="Cancel" variant="outline" type="button" onClick={() => setShowForm(false)} />
                <ActionButton label="Save" type="submit" />
              </div>
            </form>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}
