import { useState, useEffect } from 'react';
import { fetchGroupsList, deleteGroupApi, createGroupApi, updateGroupApi } from '@modules/accounting/services/accounting.service';

export function useAccountGroupsViewData() {
  const [groups, setGroups] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editGroup, setEditGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [nature, setNature] = useState('ASSET');
  const [parentId, setParentId] = useState('');

  const loadGroups = () => fetchGroupsList().then(res => setGroups(res.data || []));
  
  useEffect(() => { 
    loadGroups(); 
  }, []);

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

  const toggleExpand = (id) => {
    setExpanded(p => ({ ...p, [id]: !p[id] }));
  };

  return {
    groups,
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
    handleEdit,
    handleDelete,
    handleSubmit,
    toggleExpand
  };
}
