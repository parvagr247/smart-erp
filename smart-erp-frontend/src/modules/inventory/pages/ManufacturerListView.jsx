import React from 'react';
import { useManufacturerListViewData } from './services/ManufacturerListViewService';
import { ManufacturerForm, ManufacturerList } from '../components/ManufacturerComponents';
import './styles/ManufacturerListView.css';

export default function ManufacturerListView() {
  const { data: manufacturers, submitLoading, message, handleCreate, handleDelete } = useManufacturerListViewData();

  return (
    <div className="page-container-medium">
      <div>
        <h1 className="page-header-title">Manufacturers Master</h1>
        <p className="page-header-desc">Configure item production companies.</p>
      </div>
      <div className="grid-three-col">
        <ManufacturerForm submitLoading={submitLoading} message={message} onCreate={handleCreate} />
        <ManufacturerList manufacturers={manufacturers} onDelete={handleDelete} />
      </div>
    </div>
  );
}
