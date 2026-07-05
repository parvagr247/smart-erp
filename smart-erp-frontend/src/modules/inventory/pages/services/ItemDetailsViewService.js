import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inventoryService } from '../../inventory.service';

export function useItemDetailsViewData() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItem = async () => {
    try {
      setLoading(true);
      const res = await inventoryService.getItem(id);
      if (res.success && res.data) {
        setItem(res.data);
      } else {
        setError(res.message || "Failed to load item.");
      }
    } catch (err) {
      setError("An error occurred loading item profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await inventoryService.deleteItem(id);
      if (res.success) {
        navigate('/inventory/stock-items');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    navigate,
    item,
    loading,
    error,
    handleDelete,
    fetchItem
  };
}

