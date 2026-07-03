import React, { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventory.service';

export default function UnitListView() {
  const [units, setUnits] = useState([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [precision, setPrecision] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const res = await inventoryService.getUnits();
      if (res.success && res.data) {
        setUnits(res.data);
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
      const res = await inventoryService.createUnit({
        code: code.trim(),
        name: name.trim(),
        abbreviation: abbreviation.trim() || code.trim(),
        decimalPrecision: parseInt(precision, 10)
      });
      if (res.success) {
        setCode('');
        setName('');
        setAbbreviation('');
        setPrecision(0);
        setMessage("Unit created.");
        fetchUnits();
      } else {
        setMessage(res.message || "Failed to create.");
      }
    } catch (err) {
      setMessage("Error saving unit.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete unit?")) return;
    try {
      await inventoryService.deleteUnit(id);
      fetchUnits();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Measurement Units Master</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure abbreviations and decimal precision constraints for inventory items.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm h-fit">
          <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Unit</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Unit Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. PCS, BOX, KG"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Unit Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Pieces, Box, Kilogram"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Abbreviation</label>
              <input
                type="text"
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. pcs, box, kg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Decimal Precision</label>
              <input
                type="number"
                min="0"
                max="4"
                value={precision}
                onChange={(e) => setPrecision(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition"
            >
              {loading ? "Adding..." : "Add Unit"}
            </button>
            {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
          </form>
        </div>

        <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">All Units</h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
            {units.length === 0 ? (
              <p className="py-4 text-center text-slate-400 text-sm">No measurement units configured.</p>
            ) : (
              units.map(u => (
                <div key={u.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{u.code}</span>
                    <span className="text-xs text-slate-400 ml-2">({u.name}) - Precision: {u.decimalPrecision}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(u.id)}
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
