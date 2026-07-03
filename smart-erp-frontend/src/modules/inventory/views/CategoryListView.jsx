import React, { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventory.service';

export default function CategoryListView() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await inventoryService.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setLoading(true);
      const res = await inventoryService.createCategory({
        name: name.trim(),
        description: description.trim()
      });
      if (res.success) {
        setName('');
        setDescription('');
        setMessage("Category created.");
        fetchCategories();
      } else {
        setMessage(res.message || "Failed to create.");
      }
    } catch (err) {
      setMessage("Error occurred.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete category?")) return;
    try {
      await inventoryService.deleteCategory(id);
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Stock Categories Master</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure independent categories used for tags and filters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm h-fit">
          <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Premium, Fast Moving"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="2"
                placeholder="Brief category info"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition"
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
            {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
          </form>
        </div>

        <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">All Categories</h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
            {categories.length === 0 ? (
              <p className="py-4 text-center text-slate-400 text-sm">No categories configured yet.</p>
            ) : (
              categories.map(c => (
                <div key={c.id} className="py-3 flex justify-between items-start">
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block">{c.name}</span>
                    <span className="text-xs text-slate-400">{c.description || 'No description'}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
