import React from 'react';
import { useStockGroupsViewData } from './services/StockGroupsViewService';
import { StockGroupForm, StockGroupList } from '../components/StockGroupComponents';
import './styles/StockGroupsView.css';

export default function StockGroupsView() {
  const { groups, loading, message, handleCreate, handleDelete } = useStockGroupsViewData();

  return (
    <div className="page-container-medium">
      <div>
        <h1 className="page-header-title-sub">Stock Groups Hierarchy</h1>
        <p className="page-header-desc">Organize your inventory stock items into primary and nested classifications.</p>
      </div>
      <div className="grid-three-col">
        <StockGroupForm groups={groups} submitLoading={loading} message={message} onCreate={handleCreate} />
        <StockGroupList groups={groups} onDelete={handleDelete} />
      </div>
    </div>
  );
}
