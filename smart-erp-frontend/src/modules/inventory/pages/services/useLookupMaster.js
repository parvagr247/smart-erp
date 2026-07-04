import { useState, useEffect } from 'react';

export default function useLookupMaster({ fetchApi, createApi, deleteApi }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (e) {
      console.error("Error fetching master data list", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (payload, onSuccess) => {
    try {
      setSubmitLoading(true);
      setMessage('');
      const res = await createApi(payload);
      if (res.success) {
        setMessage("Saved successfully.");
        if (onSuccess) onSuccess();
        fetchData();
        return true;
      } else {
        setMessage(res.message || "Failed to save entry.");
        return false;
      }
    } catch (err) {
      setMessage("An error occurred while saving.");
      return false;
    } finally {
      setSubmitLoading(false);
      setTimeout(() => setMessage(''), 3500);
    }
  };

  const handleDelete = async (id, confirmMsg = "Are you sure you want to delete this master item?") => {
    if (!confirm(confirmMsg)) return;
    try {
      const res = await deleteApi(id);
      if (res.success) {
        fetchData();
      }
    } catch (e) {
      console.error("Error deleting master item", e);
    }
  };

  return {
    data,
    loading,
    submitLoading,
    message,
    setMessage,
    handleCreate,
    handleDelete,
    refresh: fetchData
  };
}
