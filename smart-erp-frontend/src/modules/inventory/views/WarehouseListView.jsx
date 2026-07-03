import React, { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventory.service';

export default function WarehouseListView() {
  const [warehouses, setWarehouses] = useState([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [sectionsText, setSectionsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await inventoryService.getWarehouses();
      if (res.success && res.data) {
        setWarehouses(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;
    try {
      setLoading(true);
      const sections = sectionsText
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const res = await inventoryService.createWarehouse({
        code: code.trim(),
        name: name.trim(),
        address: address.trim(),
        sections
      });

      if (res.success) {
        setCode('');
        setName('');
        setAddress('');
        setSectionsText('');
        setMessage("Warehouse created.");
        fetchWarehouses();
      } else {
        setMessage(res.message || "Failed to create.");
      }
    } catch (err) {
      setMessage("Error saving warehouse.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete warehouse?")) return;
    try {
      await inventoryService.deleteWarehouse(id);
      fetchWarehouses();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Warehouses Master</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure storage locations and sections mapping.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm h-fit">
          <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Warehouse</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Warehouse Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                placeholder="e.g. WH-01, NORTH-WH"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                placeholder="e.g. North Delhi Central"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                placeholder="Storage facility physical address"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Sections (comma separated)</label>
              <input
                type="text"
                value={sectionsText}
                onChange={(e) => setSectionsText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                placeholder="e.g. Raw Material, Cold Room"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition"
            >
              {loading ? "Adding..." : "Add Warehouse"}
            </button>
            {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
          </form>
        </div>

        <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">All Warehouses</h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
            {warehouses.length === 0 ? (
              <p className="py-4 text-center text-slate-400 text-sm">No warehouses configured yet.</p>
            ) : (
              warehouses.map(w => (
                <div key={w.id} className="py-4 flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{w.name} ({w.code})</span>
                    <p className="text-xs text-slate-400 mt-1">{w.address || 'No address configured'}</p>
                    {w.sections && w.sections.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {w.sections.map(s => (
                          <span key={s.id} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(w.id)}
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
