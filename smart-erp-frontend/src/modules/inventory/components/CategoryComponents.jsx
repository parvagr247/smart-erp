import React, { useState } from 'react';
import './styles/CategoryComponents.css';

export function CategoryForm({ submitLoading, message, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onCreate({ name: name.trim(), description: description.trim() }, () => { setName(''); setDescription(''); });
  };

  return (
    <div className="comp-card-form">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Category</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="form-label-xs">Category Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input-md" placeholder="e.g. Premium, Fast Moving" required />
        </div>
        <div>
          <label className="form-label-xs">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-input-md" rows="2" placeholder="Brief category info" />
        </div>
        <button type="submit" disabled={submitLoading} className="btn-primary-full">{submitLoading ? "Adding..." : "Add Category"}</button>
        {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
      </form>
    </div>
  );
}

export function CategoryList({ categories, onDelete }) {
  return (
    <div className="comp-card-list">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">All Categories</h2>
      <div className="comp-list-divider">
        {categories.length === 0 ? <p className="py-4 text-center text-slate-400 text-sm">No categories configured yet.</p> :
          categories.map(c => (
            <div key={c.id} className="comp-row-flex-start">
              <div><span className="font-medium text-slate-700 dark:text-slate-300 block text-left">{c.name}</span><span className="text-xs text-slate-400 block text-left">{c.description || 'No description'}</span></div>
              <button onClick={() => onDelete(c.id, "Delete category?")} className="btn-delete">Delete</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
