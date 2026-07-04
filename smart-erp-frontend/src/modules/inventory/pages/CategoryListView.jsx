import React from 'react';
import { useCategoryListViewData } from './services/CategoryListViewService';
import { CategoryForm, CategoryList } from '../components/CategoryComponents';
import './styles/CategoryListView.css';

export default function CategoryListView() {
  const { data: categories, submitLoading, message, handleCreate, handleDelete } = useCategoryListViewData();

  return (
    <div className="page-container-medium">
      <div>
        <h1 className="page-header-title">Stock Categories Master</h1>
        <p className="page-header-desc">Configure independent categories used for tags and filters.</p>
      </div>
      <div className="grid-three-col">
        <CategoryForm submitLoading={submitLoading} message={message} onCreate={handleCreate} />
        <CategoryList categories={categories} onDelete={handleDelete} />
      </div>
    </div>
  );
}
