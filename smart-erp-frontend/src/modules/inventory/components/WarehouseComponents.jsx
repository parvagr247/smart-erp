import React, { useState } from 'react';
import './styles/WarehouseComponents.css';

export function WarehouseForm({ submitLoading, message, onCreate }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [sectionsText, setSectionsText] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;
    const sections = sectionsText.split(',').map(s => s.trim()).filter(s => s.length > 0);
    onCreate({ code: code.trim(), name: name.trim(), address: address.trim(), sections }, () => { setCode(''); setName(''); setAddress(''); setSectionsText(''); });
  };

  const fields = [
    { id: 'code', label: 'Warehouse Code', val: code, set: setCode, ph: 'e.g. WH-01, NORTH-WH', req: true },
    { id: 'name', label: 'Display Name', val: name, set: setName, ph: 'e.g. North Delhi Central', req: true },
    { id: 'address', label: 'Address', val: address, set: setAddress, ph: 'Storage facility physical address' },
    { id: 'sections', label: 'Sections (comma separated)', val: sectionsText, set: setSectionsText, ph: 'e.g. Raw Material, Cold Room' }
  ];

  return (
    <div className="comp-card-form">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Warehouse</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map(f => (
          <div key={f.id}>
            <label className="form-label-xs">{f.label}</label>
            <input type="text" value={f.val} onChange={(e) => f.set(e.target.value)} className="form-input-md" placeholder={f.ph} required={f.req} />
          </div>
        ))}
        <button type="submit" disabled={submitLoading} className="btn-primary-full">{submitLoading ? "Adding..." : "Add Warehouse"}</button>
        {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
      </form>
    </div>
  );
}

export function WarehouseList({ warehouses, onDelete }) {
  return (
    <div className="comp-card-list">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">All Warehouses</h2>
      <div className="comp-list-divider">
        {warehouses.length === 0 ? <p className="py-4 text-center text-slate-400 text-sm">No warehouses configured yet.</p> :
          warehouses.map(w => (
            <div key={w.id} className="comp-row-flex-start">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{w.name} ({w.code})</span>
                <p className="text-xs text-slate-400 mt-1">{w.address || 'No address configured'}</p>
                {w.sections && w.sections.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {w.sections.map((s, idx) => <span key={s.id || idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs">{s.name}</span>)}
                  </div>
                )}
              </div>
              <button onClick={() => onDelete(w.id, "Delete warehouse?")} className="btn-delete">Delete</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
