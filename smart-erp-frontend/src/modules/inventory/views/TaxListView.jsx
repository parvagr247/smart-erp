import React, { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventory.service';

export default function TaxListView() {
  const [taxes, setTaxes] = useState([]);
  const [hsns, setHsns] = useState([]);
  const [activeTab, setActiveTab] = useState('tax');

  // Tax form state
  const [taxCode, setTaxCode] = useState('');
  const [taxName, setTaxName] = useState('');
  const [gstRate, setGstRate] = useState(18);

  // HSN form state
  const [hsnCode, setHsnCode] = useState('');
  const [hsnDesc, setHsnDesc] = useState('');
  const [hsnTaxId, setHsnTaxId] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const taxRes = await inventoryService.getTaxCategories();
      if (taxRes.success && taxRes.data) {
        setTaxes(taxRes.data);
      }
      const hsnRes = await inventoryService.getHsn();
      if (hsnRes.success && hsnRes.data) {
        setHsns(hsnRes.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTax = async (e) => {
    e.preventDefault();
    if (!taxCode.trim() || !taxName.trim()) return;
    try {
      setLoading(true);
      const res = await inventoryService.createTaxCategory({
        taxCode: taxCode.trim(),
        name: taxName.trim(),
        gstRate: parseFloat(gstRate)
      });
      if (res.success) {
        setTaxCode('');
        setTaxName('');
        setGstRate(18);
        setMessage("Tax Category created.");
        fetchData();
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

  const handleCreateHsn = async (e) => {
    e.preventDefault();
    if (!hsnCode.trim()) return;
    try {
      setLoading(true);
      const res = await inventoryService.createHsn({
        hsnCode: hsnCode.trim(),
        description: hsnDesc.trim(),
        taxCategoryId: hsnTaxId || null
      });
      if (res.success) {
        setHsnCode('');
        setHsnDesc('');
        setHsnTaxId('');
        setMessage("HSN record created.");
        fetchData();
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

  const handleDeleteTax = async (id) => {
    if (!confirm("Delete Tax Category?")) return;
    try {
      await inventoryService.deleteTaxCategory(id);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteHsn = async (id) => {
    if (!confirm("Delete HSN code?")) return;
    try {
      await inventoryService.deleteHsn(id);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Tax & HSN Masters</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure global GST schedules and Harmonized Nomenclature mappings.</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex">
          <button
            onClick={() => setActiveTab('tax')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === 'tax' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Tax Categories
          </button>
          <button
            onClick={() => setActiveTab('hsn')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === 'hsn' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow' : 'text-slate-600 dark:text-slate-400'}`}
          >
            HSN Codes
          </button>
        </div>
      </div>

      {activeTab === 'tax' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm h-fit">
            <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Tax Category</h2>
            <form onSubmit={handleCreateTax} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tax Code</label>
                <input
                  type="text"
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                  placeholder="e.g. GST-18, GST-5"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Display Name</label>
                <input
                  type="text"
                  value={taxName}
                  onChange={(e) => setTaxName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                  placeholder="e.g. GST 18%"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">GST Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition"
              >
                {loading ? "Adding..." : "Add Tax Category"}
              </button>
              {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
            </form>
          </div>

          <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
            <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Tax Schedules</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {taxes.length === 0 ? (
                <p className="py-4 text-center text-slate-400 text-sm">No tax schedules configured.</p>
              ) : (
                taxes.map(t => (
                  <div key={t.id} className="py-3 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{t.taxCode}</span>
                      <span className="text-xs text-slate-400 ml-2">({t.name}) - GST: {t.gstRate}% (CGST: {t.cgstRate}%, SGST: {t.sgstRate}%, IGST: {t.igstRate}%)</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTax(t.id)}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm h-fit">
            <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add HSN Code</h2>
            <form onSubmit={handleCreateHsn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">HSN Code</label>
                <input
                  type="text"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                  placeholder="e.g. 84713010"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
                <input
                  type="text"
                  value={hsnDesc}
                  onChange={(e) => setHsnDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                  placeholder="e.g. Portable computers"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tax Mappings</label>
                <select
                  value={hsnTaxId}
                  onChange={(e) => setHsnTaxId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  <option value="">No tax association</option>
                  {taxes.map(t => (
                    <option key={t.id} value={t.id}>{t.taxCode} ({t.gstRate}%)</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition"
              >
                {loading ? "Adding..." : "Add HSN"}
              </button>
              {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
            </form>
          </div>

          <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
            <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">HSN Registry</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {hsns.length === 0 ? (
                <p className="py-4 text-center text-slate-400 text-sm">No HSN codes configured.</p>
              ) : (
                hsns.map(h => (
                  <div key={h.id} className="py-3 flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{h.hsnCode}</span>
                      <span className="text-xs text-slate-400 block">{h.description || 'No description'}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteHsn(h.id)}
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
      )}
    </div>
  );
}
