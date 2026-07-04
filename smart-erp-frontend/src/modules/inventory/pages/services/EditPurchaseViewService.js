import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { inventoryService } from '../../inventory.service';

export function useEditPurchaseViewData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeCompany } = useActiveCompany();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPurchase = async () => {
      try {
        const res = await inventoryService.getPurchase(id);
        if (res.success && res.data) {
          if (res.data.status !== 'DRAFT') {
            setError('Only DRAFT purchases can be edited.');
          }
          setPurchase(res.data);
        } else {
          setError(res.message || 'Failed to fetch purchase details.');
        }
      } catch (err) {
        console.error(err);
        setError('Server error occurred while loading purchase.');
      } finally {
        setLoading(false);
      }
    };
    loadPurchase();
  }, [id]);

  const handleSave = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await inventoryService.updatePurchase(id, data);
      if (res.success) {
        navigate(`/purchase/${id}`);
      } else {
        setError(res.message || 'Failed to save changes.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    id,
    navigate,
    activeCompany,
    purchase,
    loading,
    error,
    submitting,
    handleSave
  };
}
