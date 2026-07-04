import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../inventory.service';

export function useCreateItemViewData() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      const res = await inventoryService.createItem(data);
      if (res.success) {
        navigate('/inventory/stock-items');
      } else {
        setError(res.message || "Failed to create item.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while creating stock item.");
    } finally {
      setLoading(false);
    }
  };

  return { navigate, loading, error, handleSubmit };
}

