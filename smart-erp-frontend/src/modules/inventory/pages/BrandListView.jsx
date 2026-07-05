import React from 'react';
import { useBrandListViewData } from './services/BrandListViewService';
import { BrandForm, BrandList } from '../components/BrandComponents';
import './styles/BrandListView.css';

export default function BrandListView() {
  const { data: brands, submitLoading, message, handleCreate, handleDelete } = useBrandListViewData();

  return (
    <div className="brand-page-container">
      <div>
        <h1 className="brand-page-title">Brands Master</h1>
        <p className="brand-page-desc">Configure item brand names.</p>
      </div>
      <div className="brand-grid-layout">
        <BrandForm submitLoading={submitLoading} message={message} onCreate={handleCreate} />
        <BrandList brands={brands} onDelete={handleDelete} />
      </div>
    </div>
  );
}
