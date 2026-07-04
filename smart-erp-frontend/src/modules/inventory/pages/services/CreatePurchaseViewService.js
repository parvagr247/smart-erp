import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { inventoryService } from '../../inventory.service';

export function useCreatePurchaseViewData() {
  const navigate = useNavigate();
  const { activeCompany } = useActiveCompany();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await inventoryService.createPurchase(data);
      if (res.success) {
        navigate(`/inventory/purchases/${res.data.id}`);
      } else {
        setError(res.message || 'Failed to create purchase.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error occurred while creating purchase.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    navigate,
    activeCompany,
    error,
    submitting,
    handleSave
  };
}
