import React, { useState } from 'react';
import './styles/ManufacturerComponents.css';

export function ManufacturerForm({ submitLoading, message, onCreate }) {
  const [name, setName] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onCreate({ name: name.trim() }, () => setName(''));
  };

  return (
    <div className="comp-card-form">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Manufacturer</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="form-label-xs">Manufacturer Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input-md" placeholder="e.g. Foxconn, Tata Group" required />
        </div>
        <button type="submit" disabled={submitLoading} className="btn-primary-full">{submitLoading ? "Adding..." : "Add Manufacturer"}</button>
        {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
      </form>
    </div>
  );
}

export function ManufacturerList({ manufacturers, onDelete }) {
  return (
    <div className="comp-card-list">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">All Manufacturers</h2>
      <div className="comp-list-divider">
        {manufacturers.length === 0 ? <p className="py-4 text-center text-slate-400 text-sm">No manufacturers configured yet.</p> :
          manufacturers.map(m => (
            <div key={m.id} className="comp-row-flex">
              <span className="font-medium text-slate-700 dark:text-slate-300">{m.name}</span>
              <button onClick={() => onDelete(m.id, "Delete manufacturer?")} className="btn-delete">Delete</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
