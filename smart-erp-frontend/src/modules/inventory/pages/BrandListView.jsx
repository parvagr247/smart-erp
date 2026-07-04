import React from 'react';
import { useBrandListViewData } from './services/BrandListViewService';
import { BrandForm, BrandList } from '../components/BrandComponents';
import './styles/BrandListView.css';

export default function BrandListView() {
  const { data: brands, submitLoading, message, handleCreate, handleDelete } = useBrandListViewData();

  return (
    <div className="page-container-medium">
      <div>
        <h1 className="page-header-title">Brands Master</h1>
        <p className="page-header-desc">Configure item brand names.</p>
      </div>
      <div className="grid-three-col">
        <BrandForm submitLoading={submitLoading} message={message} onCreate={handleCreate} />
        <BrandList brands={brands} onDelete={handleDelete} />
      </div>
    </div>
  );
}
