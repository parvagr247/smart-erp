import React, { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventory.service';

export default function ManufacturerListView() {
  const [manufacturers, setManufacturers] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      const res = await inventoryService.getManufacturers();
      if (res.success && res.data) {
        setManufacturers(res.data);
      }
    } catch (e) {
      console.error("Error fetching manufacturers", e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setLoading(true);
      const res = await inventoryService.createManufacturer({ name: name.trim() });
      if (res.success) {
        setName('');
        setMessage("Manufacturer created.");
        fetchManufacturers();
      } else {
        setMessage(res.message || "Failed to create.");
      }
    } catch (err) {
      setMessage("Error saving manufacturer.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete manufacturer?")) return;
    try {
      await inventoryService.deleteManufacturer(id);
      fetchManufacturers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Manufacturers Master</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure item production companies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm h-fit">
          <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Manufacturer</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Manufacturer Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Foxconn, Tata Group"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition"
            >
              {loading ? "Adding..." : "Add Manufacturer"}
            </button>
            {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
          </form>
        </div>

        <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">All Manufacturers</h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
            {manufacturers.length === 0 ? (
              <p className="py-4 text-center text-slate-400 text-sm">No manufacturers configured yet.</p>
            ) : (
              manufacturers.map(m => (
                <div key={m.id} className="py-3 flex justify-between items-center">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{m.name}</span>
                  <button
                    onClick={() => handleDelete(m.id)}
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
