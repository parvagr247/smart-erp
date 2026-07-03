import React, { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventory.service';

export default function ItemForm({ initialData, onSubmit, onCancel, loading }) {
  const [activeTab, setActiveTab] = useState('general');

  // Input states
  const [code, setCode] = useState(initialData?.code || '');
  const [name, setName] = useState(initialData?.name || '');
  const [alias, setAlias] = useState(initialData?.alias || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [barcode, setBarcode] = useState(initialData?.barcode || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const [brandId, setBrandId] = useState(initialData?.brandId || '');
  const [manufacturerId, setManufacturerId] = useState(initialData?.manufacturerId || '');
  const [stockGroupId, setStockGroupId] = useState(initialData?.stockGroupId || '');
  const [categoryIds, setCategoryIds] = useState(initialData?.categoryIds || []);
  const [primaryUnitId, setPrimaryUnitId] = useState(initialData?.primaryUnitId || '');
  const [secondaryUnitId, setSecondaryUnitId] = useState(initialData?.secondaryUnitId || '');
  const [warehouseId, setWarehouseId] = useState(initialData?.warehouseId || '');
  const [taxCategoryId, setTaxCategoryId] = useState(initialData?.taxCategoryId || '');
  const [hsnId, setHsnId] = useState(initialData?.hsnId || '');

  const [openingQuantity, setOpeningQuantity] = useState(initialData?.openingQuantity || 0);
  const [openingValue, setOpeningValue] = useState(initialData?.openingValue || 0);
  const [minimumStock, setMinimumStock] = useState(initialData?.minimumStock || 0);
  const [maximumStock, setMaximumStock] = useState(initialData?.maximumStock || 0);
  const [reorderLevel, setReorderLevel] = useState(initialData?.reorderLevel || 0);
  const [reorderQuantity, setReorderQuantity] = useState(initialData?.reorderQuantity || 0);

  const [weight, setWeight] = useState(initialData?.weight || 0);
  const [dimensions, setDimensions] = useState(initialData?.dimensions || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [status, setStatus] = useState(initialData?.status || 'ACTIVE');

  // Price List States
  const [priceLists, setPriceLists] = useState(initialData?.priceLists || []);

  // Lookups data
  const [brands, setBrands] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [hsns, setHsns] = useState([]);

  useEffect(() => {
    fetchLookups();
  }, []);

  const fetchLookups = async () => {
    try {
      const brandRes = await inventoryService.getBrands();
      if (brandRes.success) setBrands(brandRes.data);

      const mfgRes = await inventoryService.getManufacturers();
      if (mfgRes.success) setManufacturers(mfgRes.data);

      const groupRes = await inventoryService.getGroups();
      if (groupRes.success) setGroups(groupRes.data);

      const catRes = await inventoryService.getCategories();
      if (catRes.success) setCategories(catRes.data);

      const unitRes = await inventoryService.getUnits();
      if (unitRes.success) {
        setUnits(unitRes.data);
        if (!primaryUnitId && unitRes.data.length > 0) {
          setPrimaryUnitId(unitRes.data[0].id);
        }
      }

      const whRes = await inventoryService.getWarehouses();
      if (whRes.success) setWarehouses(whRes.data);

      const taxRes = await inventoryService.getTaxCategories();
      if (taxRes.success) setTaxes(taxRes.data);

      const hsnRes = await inventoryService.getHsn();
      if (hsnRes.success) setHsns(hsnRes.data);
    } catch (e) {
      console.error("Error loading form lookups", e);
    }
  };

  const handleAddPrice = () => {
    setPriceLists([...priceLists, { name: 'Retail Price', priceType: 'RETAIL', price: 0 }]);
  };

  const handlePriceChange = (index, field, val) => {
    const updated = [...priceLists];
    updated[index][field] = val;
    setPriceLists(updated);
  };

  const handleRemovePrice = (index) => {
    setPriceLists(priceLists.filter((_, i) => i !== index));
  };

  const handleCategoryToggle = (id) => {
    if (categoryIds.includes(id)) {
      setCategoryIds(categoryIds.filter(cid => cid !== id));
    } else {
      setCategoryIds([...categoryIds, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      code,
      name,
      alias,
      sku,
      barcode,
      description,
      brandId: brandId || null,
      manufacturerId: manufacturerId || null,
      stockGroupId: stockGroupId || null,
      categoryIds,
      primaryUnitId,
      secondaryUnitId: secondaryUnitId || null,
      warehouseId: warehouseId || null,
      taxCategoryId: taxCategoryId || null,
      hsnId: hsnId || null,
      openingQuantity: parseFloat(openingQuantity),
      openingValue: parseFloat(openingValue),
      minimumStock: parseFloat(minimumStock),
      maximumStock: parseFloat(maximumStock),
      reorderLevel: parseFloat(reorderLevel),
      reorderQuantity: parseFloat(reorderQuantity),
      weight: parseFloat(weight),
      dimensions,
      notes,
      status,
      priceLists
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700 flex gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
        >
          General Information
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('stock')}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'stock' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
        >
          Inventory Rules
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'pricing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
        >
          Pricing & Taxes
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Item Code *</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
              placeholder="e.g. ITEM-001"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Item Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
              placeholder="e.g. Core i7 Processor"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">SKU *</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
              placeholder="e.g. SKU-DELL-I7"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Barcode</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
              placeholder="Universal Product Code"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Alias / Alternative Name</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
              placeholder="e.g. i7 CPU"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Stock Group</label>
            <select
              value={stockGroupId}
              onChange={(e) => setStockGroupId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="">Unassigned</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Brand</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="">Unassigned</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Manufacturer</label>
            <select
              value={manufacturerId}
              onChange={(e) => setManufacturerId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="">Unassigned</option>
              {manufacturers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
              rows="3"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Item Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => {
                const active = categoryIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategoryToggle(c.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${active ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 border-indigo-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Primary Unit *</label>
            <select
              value={primaryUnitId}
              onChange={(e) => setPrimaryUnitId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
              required
            >
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.code} ({u.name})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Secondary Unit</label>
            <select
              value={secondaryUnitId}
              onChange={(e) => setSecondaryUnitId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="">None</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.code} ({u.name})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Default Warehouse / Bin Location</label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="">None</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Weight (KG)</label>
            <input
              type="number"
              step="0.001"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Opening Quantity</label>
            <input
              type="number"
              step="0.01"
              value={openingQuantity}
              onChange={(e) => setOpeningQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Opening Value (₹)</label>
            <input
              type="number"
              step="0.01"
              value={openingValue}
              onChange={(e) => setOpeningValue(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Reorder Alert Level</label>
            <input
              type="number"
              step="0.01"
              value={reorderLevel}
              onChange={(e) => setReorderLevel(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Reorder Quantity</label>
            <input
              type="number"
              step="0.01"
              value={reorderQuantity}
              onChange={(e) => setReorderQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Minimum Stock Limit</label>
            <input
              type="number"
              step="0.01"
              value={minimumStock}
              onChange={(e) => setMinimumStock(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Maximum Stock Limit</label>
            <input
              type="number"
              step="0.01"
              value={maximumStock}
              onChange={(e) => setMaximumStock(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tax Category</label>
              <select
                value={taxCategoryId}
                onChange={(e) => setTaxCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="">None</option>
                {taxes.map(t => (
                  <option key={t.id} value={t.id}>{t.taxCode} ({t.gstRate}%)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">HSN Master Code</label>
              <select
                value={hsnId}
                onChange={(e) => setHsnId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="">None</option>
                {hsns.map(h => (
                  <option key={h.id} value={h.id}>{h.hsnCode} - {h.description}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Price List Mappings</h3>
              <button
                type="button"
                onClick={handleAddPrice}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                + Add Price Tier
              </button>
            </div>

            {priceLists.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No custom price lists configured. Click Add Price Tier above to customize.</p>
            ) : (
              <div className="space-y-3">
                {priceLists.map((price, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="w-full sm:w-1/3">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Price Name</label>
                      <input
                        type="text"
                        value={price.name}
                        onChange={(e) => handlePriceChange(idx, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="w-full sm:w-1/3">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Price Type</label>
                      <select
                        value={price.priceType}
                        onChange={(e) => handlePriceChange(idx, 'priceType', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                      >
                        <option value="RETAIL">Retail Price</option>
                        <option value="WHOLESALE">Wholesale Price</option>
                        <option value="DISTRIBUTOR">Distributor Price</option>
                        <option value="DEALER">Dealer Price</option>
                        <option value="ONLINE">Online Price</option>
                        <option value="PURCHASE">Purchase Price</option>
                      </select>
                    </div>
                    <div className="w-full sm:w-1/4">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={price.price}
                        onChange={(e) => handlePriceChange(idx, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePrice(idx)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold py-1.5 px-3 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-sm transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow transition"
        >
          {loading ? "Saving..." : "Save Stock Item"}
        </button>
      </div>
    </form>
  );
}
