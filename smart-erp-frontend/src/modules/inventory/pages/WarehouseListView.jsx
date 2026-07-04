import React from 'react';
import { useWarehouseListViewData } from './services/WarehouseListViewService';
import { WarehouseForm, WarehouseList } from '../components/WarehouseComponents';
import './styles/WarehouseListView.css';

export default function WarehouseListView() {
  const { data: warehouses, submitLoading, message, handleCreate, handleDelete } = useWarehouseListViewData();

  return (
    <div className="page-container-medium">
      <div>
        <h1 className="page-header-title">Warehouses Master</h1>
        <p className="page-header-desc">Configure storage locations and sections mapping.</p>
      </div>
      <div className="grid-three-col">
        <WarehouseForm submitLoading={submitLoading} message={message} onCreate={handleCreate} />
        <WarehouseList warehouses={warehouses} onDelete={handleDelete} />
      </div>
    </div>
  );
}
