import React from 'react';
import { useCreateItemViewData } from './services/CreateItemViewService';
import ItemForm from '../components/ItemForm';
import './styles/CreateItemView.css';

export default function CreateItemView() {
  const { navigate, loading, error, handleSubmit } = useCreateItemViewData();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-left">
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
        <ItemForm onSubmit={handleSubmit} onCancel={() => navigate('/inventory/stock-items')} loading={loading} />
      </div>
    </div>
  );
}
