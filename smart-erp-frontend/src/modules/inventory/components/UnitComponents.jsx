import React, { useState } from 'react';
import './styles/UnitComponents.css';

export function UnitForm({ submitLoading, message, onCreate }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [precision, setPrecision] = useState(0);

  const onSubmit = (e) => {
    e.preventDefault();
    if (code.trim() && name.trim()) {
      onCreate({ code: code.trim(), name: name.trim(), abbreviation: abbreviation.trim() || code.trim(), decimalPrecision: parseInt(precision, 10) }, () => { setCode(''); setName(''); setAbbreviation(''); setPrecision(0); });
    }
  };

  const fields = [
    { id: 'code', label: 'Unit Code', val: code, set: setCode, ph: 'e.g. PCS, KG', req: true },
    { id: 'name', label: 'Unit Name', val: name, set: setName, ph: 'e.g. Pieces, Kilograms', req: true },
    { id: 'abbreviation', label: 'Abbreviation', val: abbreviation, set: setAbbreviation, ph: 'e.g. pcs, kg' },
    { id: 'precision', label: 'Decimal Precision', val: precision, set: setPrecision, type: 'number', req: true }
  ];

  return (
    <div className="comp-card-form">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Unit</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map(f => (
          <div key={f.id}>
            <label className="form-label-xs">{f.label}</label>
            <input type={f.type || 'text'} value={f.val} onChange={(e) => f.set(e.target.value)} className="form-input-md" placeholder={f.ph} required={f.req} min={f.type === 'number' ? '0' : undefined} max={f.type === 'number' ? '4' : undefined} />
          </div>
        ))}
        <button type="submit" disabled={submitLoading} className="btn-primary-full">{submitLoading ? "Adding..." : "Add Unit"}</button>
        {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
      </form>
    </div>
  );
}

export function UnitList({ units, onDelete }) {
  return (
    <div className="comp-card-list">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">All Units</h2>
      <div className="comp-list-divider">
        {units.length === 0 ? <p className="py-4 text-center text-slate-400 text-sm">No measurement units configured.</p> :
          units.map(u => (
            <div key={u.id} className="comp-row-flex">
              <div><span className="font-semibold text-slate-800 dark:text-slate-200">{u.code}</span><span className="text-xs text-slate-400 ml-2">({u.name}) - Precision: {u.decimalPrecision}</span></div>
              <button onClick={() => onDelete(u.id, "Delete unit?")} className="btn-delete">Delete</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
