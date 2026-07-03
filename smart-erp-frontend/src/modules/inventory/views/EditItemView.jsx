import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inventoryService } from '../services/inventory.service';
import ItemForm from '../components/ItemForm';

export default function EditItemView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

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

  if (loading) {
    return <div className="p-6 text-center text-slate-400">Loading item settings...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Edit Stock Item</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Modify properties, warehouse locations, and pricing rules.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-sm font-semibold rounded-lg border border-rose-200 dark:border-rose-900/50">
          {error}
        </div>
      )}

      <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
        <ItemForm
          initialData={item}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/inventory/items')}
          loading={saving}
        />
      </div>
    </div>
  );
}
