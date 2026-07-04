import React from 'react';
import { useUnitListViewData } from './services/UnitListViewService';
import { UnitForm, UnitList } from '../components/UnitComponents';
import './styles/UnitListView.css';

export default function UnitListView() {
  const { data: units, submitLoading, message, handleCreate, handleDelete } = useUnitListViewData();

  return (
    <div className="page-container-medium">
      <div>
        <h1 className="page-header-title">Measurement Units Master</h1>
        <p className="page-header-desc">Configure abbreviations and decimal precision constraints for inventory items.</p>
      </div>
      <div className="grid-three-col">
        <UnitForm submitLoading={submitLoading} message={message} onCreate={handleCreate} />
        <UnitList units={units} onDelete={handleDelete} />
      </div>
    </div>
  );
}
