import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/inventory.service';
import ItemForm from '../components/ItemForm';

export default function CreateItemView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      const res = await inventoryService.createItem(data);
      if (res.success) {
        navigate('/inventory/items');
      } else {
        setError(res.message || "Failed to create item.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while creating stock item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Add Stock Item</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Onboard a new catalog item with pricing tiers and inventory limits.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-sm font-semibold rounded-lg border border-rose-200 dark:border-rose-900/50">
          {error}
        </div>
      )}

      <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
        <ItemForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/inventory/items')}
          loading={loading}
        />
      </div>
    </div>
  );
}
