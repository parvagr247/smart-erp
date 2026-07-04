import React from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import AccountGroupNode from '../components/AccountGroupNode';
import { useAccountGroupsViewData } from './services/AccountGroupsViewService';
import { Plus, Search, FolderOpen, FolderClosed } from 'lucide-react';
import './styles/AccountGroupsView.css';

export default function AccountGroupsView() {
  const state = useAccountGroupsViewData();
  const {
    groups, allGroups, expanded, editGroup, showForm, setShowForm, name, setName, nature, setNature, parentId, setParentId,
    search, setSearch, handleEdit, handleCreateChild, handleDelete, handleToggleActive, handleSubmit, toggleExpand,
    handleExpandAll, handleCollapseAll, ledgerCounts
  } = state;

  const isSearching = search.trim() !== '';

  return (
    <PageContainer>
      <PageHeader title="Chart of Accounts" description="Manage hierarchical account groups, natures, status, and ledger mappings">
        <ActionButton label="Create Group" icon={<Plus size={14} />} onClick={() => { setShowForm(true); setEditGroup(null); setName(''); setParentId(''); }} />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        <SectionCard title="Account Groups Tree" description="Hierarchical folder structure of your chart of accounts" className="lg:col-span-2 text-left">
          
          {/* Tree Toolbar Controls */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4 border-b border-[var(--border-light)] pb-4">
            <div className="relative w-full sm:w-72">
              <Input 
                placeholder="Search groups by name or nature..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
              <Search size={14} className="absolute left-2.5 top-3 text-[var(--text-muted)]" />
            </div>
            {!isSearching && (
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <ActionButton label="Expand All" variant="outline" icon={<FolderOpen size={12} />} onClick={handleExpandAll} className="py-1 px-3 text-xs font-semibold" />
                <ActionButton label="Collapse All" variant="outline" icon={<FolderClosed size={12} />} onClick={handleCollapseAll} className="py-1 px-3 text-xs font-semibold" />
              </div>
            )}
          </div>

          <div className="space-y-1 p-2 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-light)] max-h-[60vh] overflow-y-auto">
            {isSearching ? (
              /* Flat Search Results List */
              groups.length === 0 ? (
                <div className="text-center p-6 text-xs text-[var(--text-muted)]">No matching groups found.</div>
              ) : (
                <div className="space-y-1">
                  {groups.map(g => (
                    <div key={g.id} className="flex items-center justify-between py-2 px-3 hover:bg-[var(--bg-hover)] rounded border-b border-[var(--border-light)] last:border-0 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--text-primary)]">{g.name}</span>
                        {g.parentGroupName && (
                          <span className="text-[10px] text-[var(--text-muted)]">under {g.parentGroupName}</span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary-glow)] text-[var(--primary)] font-bold">{g.nature}</span>
                        {!g.isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold">Inactive</span>
                        )}
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="text-xs text-[var(--text-muted)]">{(ledgerCounts[g.id] || 0)} ledgers</span>
                        <button onClick={() => handleEdit(g)} className="text-xs text-[var(--primary)] hover:underline cursor-pointer font-semibold">Edit</button>
                        <button onClick={() => handleToggleActive(g)} className="text-xs text-amber-500 hover:underline cursor-pointer font-semibold">
                          {g.isActive ? 'Disable' : 'Enable'}
                        </button>
                        {!g.isSystemGenerated && (
                          <button onClick={() => handleDelete(g.id)} className="text-xs text-red-500 hover:underline cursor-pointer font-semibold">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Full Hierarchical Tree View */
              allGroups.length === 0 ? (
                <div className="text-center p-6 text-xs text-[var(--text-muted)]">No account groups found.</div>
              ) : (
                allGroups.filter(g => !g.parentGroupId).map(node => (
                  <AccountGroupNode 
                    key={node.id} 
                    node={node} 
                    groups={allGroups} 
                    expanded={expanded} 
                    setExpanded={toggleExpand} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete}
                    onCreateChild={handleCreateChild}
                    onToggleActive={handleToggleActive}
                    ledgerCounts={ledgerCounts}
                  />
                ))
              )
            )}
          </div>
        </SectionCard>

        {showForm && (
          <SectionCard title={editGroup ? 'Edit Group' : 'Create Group'} description="Specify name and choose parent classification" className="text-left">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1"><Label htmlFor="name">Group Name *</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
              <div className="space-y-1"><Label htmlFor="nature">Nature *</Label>
                <select id="nature" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:outline-none" value={nature} onChange={(e) => setNature(e.target.value)} disabled={!!editGroup && editGroup.isSystemGenerated}>
                  {['ASSET', 'LIABILITY', 'CAPITAL', 'INCOME', 'EXPENSE'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="space-y-1"><Label htmlFor="parent">Parent Group</Label>
                <select id="parent" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:outline-none" value={parentId} onChange={(e) => setParentId(e.target.value)}>
                  <option value="">-- No Parent (Root Group) --</option>
                  {allGroups.filter(g => !editGroup || g.id !== editGroup.id).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
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
