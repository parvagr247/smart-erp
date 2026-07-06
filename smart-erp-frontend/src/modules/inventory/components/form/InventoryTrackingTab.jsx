import React, { useState } from 'react';

export default function InventoryTrackingTab({ state }) {
  const {
    primaryUnitId, setPrimaryUnitId, secondaryUnitId, setSecondaryUnitId,
    warehouseId, setWarehouseId, openingQuantity, setOpeningQuantity,
    minimumStock, setMinimumStock, maximumStock, setMaximumStock,
    reorderLevel, setReorderLevel, reorderQuantity, setReorderQuantity,
    weight, setWeight, binLocation, setBinLocation, productType,
    trackInventory, setTrackInventory, isEdit, units, warehouses
  } = state;

  const [showAdvanced, setShowAdvanced] = useState(false);
  const isService = productType === 'SERVICE';

  return (
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
  );
}
