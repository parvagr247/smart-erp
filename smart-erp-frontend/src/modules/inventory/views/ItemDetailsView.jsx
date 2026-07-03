import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inventoryService } from '../services/inventory.service';

export default function ItemDetailsView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const res = await inventoryService.getItem(id);
      if (res.success && res.data) {
        setItem(res.data);
      } else {
        setError(res.message || "Failed to load item.");
      }
    } catch (err) {
      setError("An error occurred loading item profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await inventoryService.deleteItem(id);
      if (res.success) {
        navigate('/inventory/items');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-400">Loading stock item profile...</div>;
  }

  if (error || !item) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-4">
        <div className="text-rose-600 font-semibold">{error || "Item not found"}</div>
        <button onClick={() => navigate('/inventory/items')} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm">
          Return to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Stock Item Profile</span>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{item.name}</h1>
          <p className="text-sm text-slate-400 mt-1">SKU: {item.sku} | Code: {item.code}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/inventory/items/${item.id}/edit`)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-sm hover:bg-slate-50 transition"
          >
            Edit Item
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold rounded-lg text-sm transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Summary Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Grid */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">Item Specifications</h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase">Alias / Common Name</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{item.alias || 'None'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase">Brand</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{item.brandName || 'Unassigned'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase">Manufacturer</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{item.manufacturerName || 'Unassigned'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase">Stock Group</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{item.stockGroupName || 'General'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase">Primary Unit</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{item.primaryUnitCode}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase">Secondary Unit</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{item.secondaryUnitCode || 'None'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase">Weight</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{item.weight} KG</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase">Dimensions (L x W x H)</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{item.dimensions || 'Unspecified'}</p>
              </div>
            </div>

            {item.description && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 text-xs font-semibold uppercase">Product Description</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{item.description}</p>
              </div>
            )}
          </div>

          {/* Pricing Tiers Grid */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 mb-4">Price Lists Configuration</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-700">
                    <th className="pb-2 font-semibold">Tier Name</th>
                    <th className="pb-2 font-semibold">Price Type</th>
                    <th className="pb-2 text-right font-semibold">Unit Price (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {item.priceLists.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-4 text-center text-slate-400">No custom pricing lists assigned.</td>
                    </tr>
                  ) : (
                    item.priceLists.map((p, i) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800 last:border-b-0">
                        <td className="py-3 font-medium text-slate-700 dark:text-slate-300">{p.name}</td>
                        <td className="py-3 text-slate-500">{p.priceType}</td>
                        <td className="py-3 text-right font-semibold text-slate-800 dark:text-slate-100">₹{p.price.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Stock Limits, Tax & Warehouses */}
        <div className="space-y-6">
          {/* Stock Balances */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">Inventory Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Available Quantity</span>
                <span className="font-bold text-indigo-600">{item.openingQuantity} {item.primaryUnitCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Warehouse location</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{item.warehouseName || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stock Value</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">₹{item.openingValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-700 pt-2">
                <span className="text-slate-500">Reorder Alert Trigger</span>
                <span className="font-medium text-slate-600 dark:text-slate-400">{item.reorderLevel} {item.primaryUnitCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reorder Quantity</span>
                <span className="font-medium text-slate-600 dark:text-slate-400">{item.reorderQuantity} {item.primaryUnitCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Minimum Stock Limit</span>
                <span className="font-medium text-slate-600 dark:text-slate-400">{item.minimumStock} {item.primaryUnitCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Maximum Stock Limit</span>
                <span className="font-medium text-slate-600 dark:text-slate-400">{item.maximumStock} {item.primaryUnitCode}</span>
              </div>
            </div>
          </div>

          {/* Tax Configurations */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">Tax Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Tax Category</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{item.taxCategoryName || 'No tax mapped'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">HSN Code</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{item.hsnCode || 'Unspecified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
