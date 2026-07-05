import React from 'react';
import { useManufacturerListViewData } from './services/ManufacturerListViewService';
import { ManufacturerForm, ManufacturerList } from '../components/ManufacturerComponents';
import './styles/ManufacturerListView.css';

export default function ManufacturerListView() {
  const { data: manufacturers, submitLoading, message, handleCreate, handleDelete } = useManufacturerListViewData();

  return (
    <div className="manufacturer-page-container">
      <div>
        <h1 className="manufacturer-page-title">Manufacturers Master</h1>
        <p className="manufacturer-page-desc">Configure item manufacturer details.</p>
      </div>
      <div className="manufacturer-grid-layout">
        <ManufacturerForm submitLoading={submitLoading} message={message} onCreate={handleCreate} />
        <ManufacturerList manufacturers={manufacturers} onDelete={handleDelete} />
      </div>
    </div>
  );
}
