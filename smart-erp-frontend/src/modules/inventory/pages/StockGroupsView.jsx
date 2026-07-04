import React from 'react';
import { useStockGroupsViewData } from './services/StockGroupsViewService';
import { StockGroupForm, StockGroupList } from '../components/StockGroupComponents';
import './styles/StockGroupsView.css';

export default function StockGroupsView() {
  const { groups, loading, message, handleCreate, handleDelete } = useStockGroupsViewData();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-left">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Stock Groups Hierarchy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Organize your inventory stock items into primary and nested classifications.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StockGroupForm groups={groups} submitLoading={loading} message={message} onCreate={handleCreate} />
        <StockGroupList groups={groups} onDelete={handleDelete} />
      </div>
    </div>
  );
}
