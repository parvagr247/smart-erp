import React, { useState, useEffect } from 'react';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { fetchGroupsList, deleteGroupApi, createGroupApi, updateGroupApi } from '@modules/accounting/services/accounting.service';
import { Plus, ChevronRight, ChevronDown } from 'lucide-react';

export default function AccountGroupsView() {
  const [groups, setGroups] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editGroup, setEditGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [nature, setNature] = useState('ASSET');
  const [parentId, setParentId] = useState('');

  const loadGroups = () => fetchGroupsList().then(res => setGroups(res.data || []));
  useEffect(() => { loadGroups(); }, []);

  const handleEdit = (g) => {
    setEditGroup(g);
    setName(g.name);
    setNature(g.nature);
    setParentId(g.parentGroupId || '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this group?')) {
      await deleteGroupApi(id);
      loadGroups();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, nature, parentGroupId: parentId || null, isActive: true };
    if (editGroup) await updateGroupApi(editGroup.id, payload);
    else await createGroupApi(payload);
    setShowForm(false);
    setEditGroup(null);
    setName('');
    loadGroups();
  };

  const renderNode = (node) => {
    const children = groups.filter(g => g.parentGroupId === node.id);
    const isExpanded = expanded[node.id];
    return (
      <div key={node.id} className="pl-4 border-l border-[var(--border-light)] ml-2 text-left">
        <div className="flex items-center justify-between py-1.5 hover:bg-[var(--bg-input)] rounded px-2">
          <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
            {children.length > 0 && (
              <button onClick={() => setExpanded(p => ({ ...p, [node.id]: !p[node.id] }))} className="text-[var(--text-muted)] cursor-pointer">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
            {children.length === 0 && <span className="w-3.5"></span>}
            <span className="font-medium">{node.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary-glow)] text-[var(--primary)] font-bold">{node.nature}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleEdit(node)} className="text-xs text-[var(--primary)] hover:underline cursor-pointer">Edit</button>
            {!node.isSystemGenerated && <button onClick={() => handleDelete(node.id)} className="text-xs text-red-500 hover:underline cursor-pointer">Delete</button>}
          </div>
        </div>
        {children.length > 0 && isExpanded && <div className="mt-1 space-y-1">{children.map(renderNode)}</div>}
      </div>
    );
  };

  return (
    <PageContainer>
      <PageHeader title="Account Groups" description="Manage hierarchical chart of accounts and default groups template">
        <ActionButton label="Create Group" icon={<Plus size={14} />} onClick={() => { setEditGroup(null); setName(''); setParentId(''); setShowForm(true); }} />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        <SectionCard title="Groups Tree" description="Hierarchical folder-tree view of chart categories" className="lg:col-span-2">
          <div className="space-y-1 p-2 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-light)]">
            {groups.filter(g => !g.parentGroupId).map(renderNode)}
          </div>
        </SectionCard>

        {showForm && (
          <SectionCard title={editGroup ? 'Edit Group' : 'Create Group'} description="Specify name and choose parent classification">
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1"><Label htmlFor="name">Group Name *</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
              <div className="space-y-1"><Label htmlFor="nature">Nature *</Label>
                <select id="nature" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)]" value={nature} onChange={(e) => setNature(e.target.value)} disabled={!!editGroup && editGroup.isSystemGenerated}>
                  {['ASSET', 'LIABILITY', 'CAPITAL', 'INCOME', 'EXPENSE'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="space-y-1"><Label htmlFor="parent">Parent Group</Label>
                <select id="parent" className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)]" value={parentId} onChange={(e) => setParentId(e.target.value)}>
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
