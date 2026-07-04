import React, { useState } from 'react';
import './styles/HsnPanel.css';

export default function HsnPanel({ hsns, taxes, submitLoading, message, onCreate, onDelete }) {
  const [hsnCode, setHsnCode] = useState('');
  const [hsnDesc, setHsnDesc] = useState('');
  const [hsnTaxId, setHsnTaxId] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (hsnCode.trim()) {
      await onCreate({ hsnCode: hsnCode.trim(), description: hsnDesc.trim(), taxCategoryId: hsnTaxId || null }, () => { setHsnCode(''); setHsnDesc(''); setHsnTaxId(''); });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
      <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm h-fit">
        <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add HSN Code</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">HSN/SAC Code</label>
            <input type="text" value={hsnCode} onChange={(e) => setHsnCode(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="e.g. 84713010, 998313" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
            <input type="text" value={hsnDesc} onChange={(e) => setHsnDesc(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="e.g. Laptop computers" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tax Linkage</label>
            <select value={hsnTaxId} onChange={(e) => setHsnTaxId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none text-sm cursor-pointer">
              <option value="">No Tax Linkage</option>
              {taxes.map(t => <option key={t.id} value={t.id}>{t.taxCode} ({t.gstRate}%)</option>)}
            </select>
          </div>
          <button type="submit" disabled={submitLoading} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition cursor-pointer">{submitLoading ? "Adding..." : "Add HSN"}</button>
          {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
        </form>
      </div>
      <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
        <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">HSN Nomenclature Codes</h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
          {hsns.length === 0 ? <p className="py-4 text-center text-slate-400 text-sm">No HSN codes configured.</p> :
            hsns.map(h => (
              <div key={h.id} className="py-3 flex justify-between items-start">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{h.hsnCode}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{h.description || 'No description'}</p>
                  {h.taxCategory && <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded text-left">Linked: {h.taxCategory.taxCode} ({h.taxCategory.gstRate}%)</span>}
                </div>
                <button onClick={() => onDelete(h.id)} className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer">Delete</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
