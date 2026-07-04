import { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventory.service';

export default function useStockGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchGroups = async () => {
    try {
      const res = await inventoryService.getGroups();
      if (res.success && res.data) {
        setGroups(res.data);
      }
    } catch (e) {
      console.error("Error loading groups", e);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async (payload, onSuccess) => {
    try {
      setLoading(true);
      setMessage('');
      const res = await inventoryService.createGroup(payload);
      if (res.success) {
        setMessage("Stock Group created.");
        if (onSuccess) onSuccess();
        fetchGroups();
        return true;
      } else {
        setMessage(res.message || "Failed to create.");
        return false;
      }
    } catch (err) {
      setMessage("Error saving stock group.");
      return false;
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this stock group?")) return;
    try {
      await inventoryService.deleteGroup(id);
      fetchGroups();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    groups,
    loading,
    message,
    handleCreate,
    handleDelete
  };
}
