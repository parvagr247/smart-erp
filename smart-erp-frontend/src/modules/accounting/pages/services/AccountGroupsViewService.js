import { useState, useEffect } from 'react';
import { fetchGroupsList, deleteGroupApi, createGroupApi, updateGroupApi, fetchLedgersList } from '@modules/accounting/accounting.service';

export function useAccountGroupsViewData() {
  const [groups, setGroups] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editGroup, setEditGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [nature, setNature] = useState('ASSET');
  const [parentId, setParentId] = useState('');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      const [groupsRes, ledgersRes] = await Promise.all([
        fetchGroupsList(),
        fetchLedgersList({ size: 1000 })
      ]);
      setGroups(groupsRes.data || []);
      setLedgers(ledgersRes.data?.content || ledgersRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => { 
    loadData(); 
  }, []);

  const handleEdit = (g) => {
    setEditGroup(g);
    setName(g.name);
    setNature(g.nature);
    setParentId(g.parentGroupId || '');
    setShowForm(true);
  };

  const handleCreateChild = (parent) => {
    setEditGroup(null);
    setName('');
    setNature(parent.nature);
    setParentId(parent.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this group?')) {
      await deleteGroupApi(id);
      loadData();
    }
  };

  const handleToggleActive = async (g) => {
    const payload = {
      name: g.name,
      nature: g.nature,
      parentGroupId: g.parentGroupId,
      isActive: !g.isActive
    };
    await updateGroupApi(g.id, payload);
    loadData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, nature, parentGroupId: parentId || null, isActive: editGroup ? editGroup.isActive : true };
    if (editGroup) await updateGroupApi(editGroup.id, payload);
    else await createGroupApi(payload);
    setShowForm(false);
    setEditGroup(null);
    setName('');
    loadData();
  };

  const toggleExpand = (id) => {
    setExpanded(p => ({ ...p, [id]: !p[id] }));
  };

  const handleExpandAll = () => {
    const nextExpanded = {};
    groups.forEach(g => {
      nextExpanded[g.id] = true;
    });
    setExpanded(nextExpanded);
  };

  const handleCollapseAll = () => {
    setExpanded({});
  };

  // Compute ledger counts per group
  const ledgerCounts = {};
  ledgers.forEach(l => {
    if (l.groupId) {
      ledgerCounts[l.groupId] = (ledgerCounts[l.groupId] || 0) + 1;
    }
  });

  // Filter groups tree based on search string
  const filteredGroups = groups.filter(g => {
    if (!search.trim()) return true;
    return g.name.toLowerCase().includes(search.toLowerCase()) || 
           g.nature.toLowerCase().includes(search.toLowerCase());
  });

  return {
    groups: filteredGroups,
    allGroups: groups,
    expanded,
    editGroup,
    showForm,
    setShowForm,
    name,
    setName,
    nature,
    setNature,
    parentId,
    setParentId,
    search,
    setSearch,
    handleEdit,
    handleCreateChild,
    handleDelete,
    handleToggleActive,
    handleSubmit,
    toggleExpand,
    handleExpandAll,
    handleCollapseAll,
    ledgerCounts
  };
}
