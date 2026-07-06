import React, { useMemo } from 'react';

export default function PricingGstTab({ state }) {
  const {
    purchasePrice, setPurchasePrice, sellingPrice, setSellingPrice,
    taxCategoryId, setTaxCategoryId, hsnId, setHsnId, openingQuantity,
    taxes, hsns, productType
  } = state;

  // Live Auto Calculations
  const calculatedInventoryValue = useMemo(() => {
    const qty = parseFloat(openingQuantity) || 0;
    const price = parseFloat(purchasePrice) || 0;
    return qty * price;
  }, [openingQuantity, purchasePrice]);

  const expectedMargin = useMemo(() => {
    const buy = parseFloat(purchasePrice) || 0;
    const sell = parseFloat(sellingPrice) || 0;
    if (sell <= 0) return { pct: 0, amt: 0 };
    const amt = sell - buy;
    const pct = (amt / sell) * 100;
    return { pct: pct.toFixed(1), amt: amt.toFixed(2) };
  }, [purchasePrice, sellingPrice]);

  const taxInclusivePreview = useMemo(() => {
    const sell = parseFloat(sellingPrice) || 0;
    const selectedTax = taxes.find(t => t.id === taxCategoryId);
    const taxRate = selectedTax ? parseFloat(selectedTax.gstRate) || 0 : 0;
    const taxAmount = sell * (taxRate / 100);
    return { taxAmount: taxAmount.toFixed(2), total: (sell + taxAmount).toFixed(2), rate: taxRate };
  }, [sellingPrice, taxCategoryId, taxes]);

  const isService = productType === 'SERVICE';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">Pricing Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Purchase Price (Buy Price) *</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">₹</span>
              <input type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)} className="w-full pl-7 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="0.00" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Selling Price (Base Price) *</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">₹</span>
              <input type="number" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)} className="w-full pl-7 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="0.00" required />
            </div>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2 pt-2">Taxation (GST)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">GST Tax Rate Category</label>
            <select value={taxCategoryId} onChange={(e) => setTaxCategoryId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer">
              <option value="">No Tax / Exempt</option>
              {taxes.map(t => <option key={t.id} value={t.id}>{t.taxCode} ({t.gstRate}%)</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">HSN Code</label>
            <select value={hsnId} onChange={(e) => setHsnId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer">
              <option value="">None</option>
              {hsns.map(h => <option key={h.id} value={h.id}>{h.hsnCode} - {h.description}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Summary Side Card */}
      <div className="bg-gradient-to-br from-indigo-50/50 to-slate-50 dark:from-indigo-950/10 dark:to-slate-900 border border-indigo-100 dark:border-indigo-950/50 p-5 rounded-xl space-y-4 shadow-sm text-left">
        <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Business Margin & Tax Review</h3>
        
        <div className="space-y-4 pt-1">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Expected Sales Margin</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">₹{expectedMargin.amt}</span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${parseFloat(expectedMargin.pct) >= 20 ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'}`}>
                {expectedMargin.pct}% Margin
              </span>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Tax-Inclusive Selling Price</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">₹{taxInclusivePreview.total}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Incl. {taxInclusivePreview.rate}% Tax (₹{taxInclusivePreview.taxAmount})
              </span>
            </div>
          </div>

          {!isService && (
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Estimated Inventory Value</span>
              <span className="block text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                ₹{calculatedInventoryValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
