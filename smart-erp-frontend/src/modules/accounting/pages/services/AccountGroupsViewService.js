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
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const [groupsRes, ledgersRes] = await Promise.all([
        fetchGroupsList(),
        fetchLedgersList({ page: 0, size: 1000 })
      ]);
      setGroups(groupsRes.data || []);
      setLedgers(ledgersRes.data?.content || []);
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

  const toggleActive = async (g) => {
    try {
      const payload = {
        name: g.name,
        nature: g.nature,
        parentGroupId: g.parentGroupId,
        isActive: !g.isActive
      };
      await updateGroupApi(g.id, payload);
      loadData();
    } catch (err) {
      console.error(err);
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
    loadData();
  };

  const toggleExpand = (id) => {
    setExpanded(p => ({ ...p, [id]: !p[id] }));
  };

  const ledgerCountMap = {};
  const groupLedgersMap = {};
  
  ledgers.forEach(l => {
    if (l.groupId) {
      ledgerCountMap[l.groupId] = (ledgerCountMap[l.groupId] || 0) + 1;
      if (!groupLedgersMap[l.groupId]) groupLedgersMap[l.groupId] = [];
      groupLedgersMap[l.groupId].push(l);
    }
  });

  return {
    groups,
    filteredGroups: searchQuery.trim()
      ? groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : groups,
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
    searchQuery,
    setSearchQuery,
    ledgerCountMap,
    groupLedgersMap,
    handleEdit,
    handleCreateChild,
    handleDelete,
    toggleActive,
    handleSubmit,
    toggleExpand
  };
}
