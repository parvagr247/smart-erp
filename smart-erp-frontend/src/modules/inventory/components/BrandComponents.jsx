import React, { useState } from 'react';
import './styles/BrandComponents.css';

export function BrandForm({ submitLoading, message, onCreate }) {
  const [name, setName] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim() }, () => setName(''));
  };

  return (
    <div className="comp-card-form">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Brand</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="form-label-xs">Brand Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input-md"
            placeholder="e.g. Dell, Samsung"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitLoading}
          className="btn-primary-full"
        >
          {submitLoading ? "Adding..." : "Add Brand"}
        </button>
        {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
      </form>
    </div>
  );
}

export function BrandList({ brands, onDelete }) {
  return (
    <div className="comp-card-list">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">All Brands</h2>
      <div className="comp-list-divider">
        {brands.length === 0 ? (
          <p className="py-4 text-center text-slate-400 text-sm">No brands configured yet.</p>
        ) : (
          brands.map(brand => (
            <div key={brand.id} className="comp-row-flex">
              <span className="font-medium text-slate-700 dark:text-slate-300">{brand.name}</span>
              <button
                onClick={() => onDelete(brand.id, "Are you sure you want to delete this brand?")}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
