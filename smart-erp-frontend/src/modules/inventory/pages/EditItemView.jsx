import React from 'react';
import { useEditItemViewData } from './services/EditItemViewService';
import ItemForm from '../components/ItemForm';
import './styles/EditItemView.css';

export default function EditItemView() {
  const { navigate, item, loading, saving, error, handleSubmit } = useEditItemViewData();

  if (loading) return <div className="p-6 text-center text-slate-400">Loading item settings...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-left">
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
        <ItemForm initialData={item} onSubmit={handleSubmit} onCancel={() => navigate('/inventory/items')} loading={saving} />
      </div>
    </div>
  );
}
