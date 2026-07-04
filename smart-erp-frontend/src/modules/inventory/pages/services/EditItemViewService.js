import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inventoryService } from '../../services/inventory.service';

export function useEditItemViewData() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await inventoryService.getItem(id);
        if (res.success && res.data) {
          setItem(res.data);
        } else {
          setError(res.message || "Failed to load item details.");
        }
      } catch (err) {
        setError("An error occurred loading item.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      const res = await inventoryService.updateItem(id, data);
      if (res.success) {
        navigate('/inventory/items');
      } else {
        setError(res.message || "Failed to save edits.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred updating the stock item.");
    } finally {
      setSaving(false);
    }
  };

  return { navigate, item, loading, saving, error, handleSubmit };
}
