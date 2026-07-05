import React from 'react';
import { useUnitListViewData } from './services/UnitListViewService';
import { UnitForm, UnitList } from '../components/UnitComponents';
import './styles/UnitListView.css';

export default function UnitListView() {
  const { data: units, submitLoading, message, handleCreate, handleDelete } = useUnitListViewData();

  return (
    <div className="unit-page-container">
      <div>
        <h1 className="unit-page-title">Measurement Units Master</h1>
        <p className="unit-page-desc">Configure abbreviations and decimal precision constraints for inventory items.</p>
      </div>
      <div className="unit-grid-layout">
        <UnitForm submitLoading={submitLoading} message={message} onCreate={handleCreate} />
        <UnitList units={units} onDelete={handleDelete} />
      </div>
    </div>
  );
}
