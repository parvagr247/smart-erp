import React, { useState } from 'react';
import './styles/TaxCategoryPanel.css';

export default function TaxCategoryPanel({ taxes, submitLoading, message, onCreate, onDelete }) {
  const [taxCode, setTaxCode] = useState('');
  const [taxName, setTaxName] = useState('');
  const [gstRate, setGstRate] = useState(18);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (taxCode.trim() && taxName.trim()) {
      await onCreate({ taxCode: taxCode.trim(), name: taxName.trim(), gstRate: parseFloat(gstRate) }, () => { setTaxCode(''); setTaxName(''); setGstRate(18); });
    }
  };

  const fields = [
    { id: 'taxCode', label: 'Tax Code', val: taxCode, set: setTaxCode, ph: 'e.g. GST-18, GST-5', req: true },
    { id: 'taxName', label: 'Display Name', val: taxName, set: setTaxName, ph: 'e.g. GST 18%', req: true },
    { id: 'gstRate', label: 'GST Rate (%)', val: gstRate, set: setGstRate, type: 'number', step: '0.01', req: true }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
      <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm h-fit">
        <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Tax Category</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map(f => (
            <div key={f.id}>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{f.label}</label>
              <input type={f.type || 'text'} step={f.step} value={f.val} onChange={(e) => f.set(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder={f.ph} required={f.req} />
            </div>
          ))}
          <button type="submit" disabled={submitLoading} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition cursor-pointer">{submitLoading ? "Adding..." : "Add Tax Category"}</button>
          {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
        </form>
      </div>
      <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
        <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Tax Schedules</h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {taxes.length === 0 ? <p className="py-4 text-center text-slate-400 text-sm">No tax schedules configured.</p> :
            taxes.map(t => (
              <div key={t.id} className="py-3 flex justify-between items-center">
                <div><span className="font-semibold text-slate-800 dark:text-slate-200">{t.taxCode}</span><span className="text-xs text-slate-400 ml-2">({t.name}) - GST: {t.gstRate}% (CGST: {t.cgstRate}%, SGST: {t.sgstRate}%, IGST: {t.igstRate}%)</span></div>
                <button onClick={() => onDelete(t.id)} className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer">Delete</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
