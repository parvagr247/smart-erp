import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inventoryService } from '../../inventory.service';

export function usePartnerDetailsViewData() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPartnerDetails = async () => {
      try {
        const res = await inventoryService.getPartner(id);
        if (res.success && res.data) {
          setPartner(res.data);
        } else {
          setError(res.message || 'Failed to fetch details.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load business partner profile.');
      } finally {
        setLoading(false);
      }
    };
    loadPartnerDetails();
  }, [id]);

  return { navigate, partner, loading, error };
}
