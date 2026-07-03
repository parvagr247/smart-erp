import { useState, useEffect } from 'react';
import { fetchPurchaseById, updatePurchaseStatusApi, deletePurchaseApi } from '../services/purchase.service';

export default function usePurchaseDetails(id, onDeletedSuccess) {
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadPurchase = async () => {
    try {
      const res = await fetchPurchaseById(id);
      if (res.success && res.data) {
        setPurchase(res.data);
      } else {
        setError(res.message || 'Failed to load purchase details.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error occurred while loading purchase voucher.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadPurchase();
  }, [id]);

  const handleStatusTransition = async (newStatus) => {
    setUpdating(true);
    setError('');
    try {
      const res = await updatePurchaseStatusApi(id, newStatus);
      if (res.success) {
        // Reload purchase to fetch updated state
        const updatedRes = await fetchPurchaseById(id);
        if (updatedRes.success && updatedRes.data) {
          setPurchase(updatedRes.data);
        }
      } else {
        setError(res.message || 'Failed to update status.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error occurred during status transition.');
    } finally {
      setUpdating(false);
    }
  };

  const deleteDraft = async () => {
    if (!window.confirm('Are you sure you want to delete this draft purchase?')) return false;
    try {
      const res = await deletePurchaseApi(id);
      if (res.success) {
        if (onDeletedSuccess) onDeletedSuccess();
        return true;
      } else {
        setError(res.message || 'Failed to delete purchase.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error occurred during deletion.');
    }
    return false;
  };

  const printInvoice = () => {
    window.print();
  };

  return {
    purchase,
    loading,
    error,
    setError,
    updating,
    handleStatusTransition,
    deleteDraft,
    printInvoice,
    reload: loadPurchase
  };
}
