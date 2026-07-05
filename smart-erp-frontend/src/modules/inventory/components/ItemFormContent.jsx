import React, { useState, useMemo } from 'react';
import './styles/ItemFormContent.css';

export default function ItemFormContent({ activeTab, state }) {
  const {
    code, setCode, name, setName, alias, setAlias, sku, setSku, barcode, setBarcode,
    description, setDescription, brandId, setBrandId, manufacturerId, setManufacturerId,
    stockGroupId, setStockGroupId, categoryIds, primaryUnitId, setPrimaryUnitId,
    secondaryUnitId, setSecondaryUnitId, warehouseId, setWarehouseId, taxCategoryId, setTaxCategoryId,
    hsnId, setHsnId, openingQuantity, setOpeningQuantity, minimumStock, setMinimumStock,
    maximumStock, setMaximumStock, reorderLevel, setReorderLevel, reorderQuantity, setReorderQuantity,
    weight, setWeight, binLocation, setBinLocation, notes, setNotes, status, setStatus,
    purchasePrice, setPurchasePrice, sellingPrice, setSellingPrice,
    productType, setProductType, trackInventory, setTrackInventory,
    isEdit,
    brands, manufacturers, groups, categories, units, warehouses, taxes, hsns,
    handleCategoryToggle, validationError
  } = state;

  const [showAdvanced, setShowAdvanced] = useState(false);

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
    <div className="space-y-6">
      {validationError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-900/50">
          ⚠️ {validationError}
        </div>
      )}

      {/* 1. Basic Details Tab */}
      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">Primary Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Product Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="e.g. Dell Latitude 7420" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">SKU *</label>
                <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="e.g. LAP-DL-7420" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Item Code / Catalog ID *</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="e.g. ITEM-DELL-1" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Barcode / UPC</label>
                <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="Scan or enter bar code" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Alias / Alternative Name</label>
                <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="e.g. Dell 14inch Laptop" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Product Type</label>
                <select value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer">
                  <option value="PHYSICAL">Physical Product</option>
                  <option value="SERVICE">Service Item / Non-Inventory</option>
                </select>
              </div>
            </div>
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none text-xs" rows="3" placeholder="Describe product details, properties, or service conditions..." />
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">Classification</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Stock Group</label>
                  <select value={stockGroupId} onChange={(e) => setStockGroupId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer">
                    <option value="">Unassigned</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Brand</label>
                  <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer">
                    <option value="">Unassigned</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Manufacturer</label>
                  <select value={manufacturerId} onChange={(e) => setManufacturerId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer">
                    <option value="">Unassigned</option>
                    {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Tags / Categories</span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(c => {
                  const active = categoryIds.includes(c.id);
                  return (
                    <button key={c.id} type="button" onClick={() => handleCategoryToggle(c.id)} className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition cursor-pointer ${active ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 border-indigo-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Pricing & GST Tab */}
      {activeTab === 'pricing' && (
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
      )}

      {/* 3. Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Inventory Tracking</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Enable stock count logs and reorder limits for physical inventory.</p>
              </div>
              <input 
                type="checkbox" 
                checked={trackInventory} 
                onChange={() => setTrackInventory(prev => !prev)}
                disabled={isService}
                className="w-4 h-4 accent-[var(--primary)] cursor-pointer disabled:opacity-50"
              />
            </div>

            {isService && (
              <p className="text-xs text-amber-600 dark:text-amber-400 italic">Inventory tracking is disabled for non-physical service items.</p>
            )}

            {!isService && trackInventory && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Primary Base Unit *</label>
                  <select value={primaryUnitId} onChange={(e) => setPrimaryUnitId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer" required>
                    {units.map(u => <option key={u.id} value={u.id}>{u.code} ({u.name})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Default Warehouse</label>
                  <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer">
                    <option value="">None</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase">Opening Stock (Qty)</label>
                    {isEdit && <span className="text-[9px] text-slate-400 font-semibold">(Immutable)</span>}
                  </div>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={openingQuantity} 
                    onChange={(e) => setOpeningQuantity(parseFloat(e.target.value) || 0)} 
                    disabled={isEdit} 
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800/50" 
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase">Reorder Level</label>
                    <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-semibold cursor-help" title="When stock reaches this quantity, SmartERP will notify you.">Info</span>
                  </div>
                  <input type="number" step="0.01" value={reorderLevel} onChange={(e) => setReorderLevel(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase">Preferred Reorder Quantity</label>
                    <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-semibold cursor-help" title="Suggested quantity to purchase during replenishment.">Info</span>
                  </div>
                  <input type="number" step="0.01" value={reorderQuantity} onChange={(e) => setReorderQuantity(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" />
                </div>
              </div>
            )}
          </div>

          {/* 4. Collapsible Advanced Settings */}
          {!isService && trackInventory && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/10">
              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)} 
                className="w-full px-5 py-3 flex justify-between items-center font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition cursor-pointer"
              >
                <span>⚙️ Advanced Inventory Settings</span>
                <span className="text-[10px] text-slate-400">{showAdvanced ? '▲ Collapse Settings' : '▼ Expand Settings'}</span>
              </button>
              {showAdvanced && (
                <div className="p-5 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white dark:bg-slate-800 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Secondary Unit (Alternate Unit)</label>
                    <select value={secondaryUnitId} onChange={(e) => setSecondaryUnitId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer">
                      <option value="">None</option>
                      {units.map(u => <option key={u.id} value={u.id}>{u.code} ({u.name})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Maximum Stock Limit</label>
                    <input type="number" step="0.01" value={maximumStock} onChange={(e) => setMaximumStock(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Minimum Stock Limit</label>
                    <input type="number" step="0.01" value={minimumStock} onChange={(e) => setMinimumStock(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Weight (KG)</label>
                    <input type="number" step="0.001" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Bin Location / Racking Code</label>
                    <input type="text" value={binLocation} onChange={(e) => setBinLocation(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="e.g. Shelf A-4" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
