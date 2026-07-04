import { useState, useEffect } from 'react';
import { inventoryService } from '../../inventory.service';

export default function useTaxMaster() {
  const [taxes, setTaxes] = useState([]);
  const [hsns, setHsns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const taxRes = await inventoryService.getTaxCategories();
      if (taxRes.success && taxRes.data) {
        setTaxes(taxRes.data);
      }
      const hsnRes = await inventoryService.getHsn();
      if (hsnRes.success && hsnRes.data) {
        setHsns(hsnRes.data);
      }
    } catch (e) {
      console.error("Error loading tax / hsn master data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTax = async (payload, onSuccess) => {
    try {
      setLoading(true);
      setMessage('');
      const res = await inventoryService.createTaxCategory(payload);
      if (res.success) {
        setMessage("Tax Category created.");
        if (onSuccess) onSuccess();
        fetchData();
        return true;
      } else {
        setMessage(res.message || "Failed to create.");
        return false;
      }
    } catch (err) {
      setMessage("Error occurred.");
      return false;
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCreateHsn = async (payload, onSuccess) => {
    try {
      setLoading(true);
      setMessage('');
      const res = await inventoryService.createHsn(payload);
      if (res.success) {
        setMessage("HSN record created.");
        if (onSuccess) onSuccess();
        fetchData();
        return true;
      } else {
        setMessage(res.message || "Failed to create.");
        return false;
      }
    } catch (err) {
      setMessage("Error occurred.");
      return false;
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteTax = async (id) => {
    if (!confirm("Delete Tax Category?")) return;
    try {
      await inventoryService.deleteTaxCategory(id);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteHsn = async (id) => {
    if (!confirm("Delete HSN code?")) return;
    try {
      await inventoryService.deleteHsn(id);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    taxes,
    hsns,
    loading,
    message,
    handleCreateTax,
    handleCreateHsn,
    handleDeleteTax,
    handleDeleteHsn,
    refresh: fetchData
  };
}

