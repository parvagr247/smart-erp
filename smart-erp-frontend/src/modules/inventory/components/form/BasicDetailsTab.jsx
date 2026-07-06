import React from 'react';

export default function BasicDetailsTab({ state }) {
  const {
    code, setCode, name, setName, alias, setAlias, sku, setSku, barcode, setBarcode,
    description, setDescription, brandId, setBrandId, manufacturerId, setManufacturerId,
    stockGroupId, setStockGroupId, categoryIds, productType, setProductType,
    brands, manufacturers, groups, categories, handleCategoryToggle
  } = state;

  return (
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
  );
}
