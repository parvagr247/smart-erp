import React from 'react';
import { useItemFormViewData } from './services/ItemFormService';
import ItemFormTabs from './ItemFormTabs';
import ItemFormContent from './ItemFormContent';
import ItemFormActions from './ItemFormActions';
import './styles/ItemForm.css';

export default function ItemForm(props) {
  const state = useItemFormViewData(props);
  const { activeTab, setActiveTab, handleSubmit, onCancel, loading } = state;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <ItemFormTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ItemFormContent activeTab={activeTab} state={state} />
      <ItemFormActions onCancel={onCancel} loading={loading} />
    </form>
  );
}
