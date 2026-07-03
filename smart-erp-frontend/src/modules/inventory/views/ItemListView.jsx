import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/inventory.service';

export default function ItemListView() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Lookup data for filters
  const [warehouses, setWarehouses] = useState([]);
  const [brands, setBrands] = useState([]);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLookups();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [page, selectedWarehouse, selectedBrand, selectedStatus]);

  const fetchLookups = async () => {
    try {
      const whRes = await inventoryService.getWarehouses();
      if (whRes.success && whRes.data) setWarehouses(whRes.data);

      const brandRes = await inventoryService.getBrands();
      if (brandRes.success && brandRes.data) setBrands(brandRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10,
        search: search.trim() || undefined,
        warehouseId: selectedWarehouse || undefined,
        brandId: selectedBrand || undefined,
        stockStatus: selectedStatus || undefined
      };
      const res = await inventoryService.getItems(params);
      if (res.success && res.data) {
        setItems(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this stock item?")) return;
    try {
      const res = await inventoryService.deleteItem(id);
      if (res.success) {
        fetchItems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Stock Item Registry</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage products, opening balance details, and pricing lists.</p>
        </div>
        <button
          onClick={() => navigate('/inventory/items/create')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition"
        >
          + Add Stock Item
        </button>
      </div>

      {/* Filter panel */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-1/3 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
            placeholder="Search by Name, SKU, Code..."
          />
          <button type="submit" className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg text-sm transition">
            Search
          </button>
        </form>

        <div className="w-full md:w-auto flex flex-wrap gap-3 ml-auto">
          <select
            value={selectedWarehouse}
            onChange={(e) => { setSelectedWarehouse(e.target.value); setPage(0); }}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm"
          >
            <option value="">All Warehouses</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => { setSelectedBrand(e.target.value); setPage(0); }}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm"
          >
            <option value="">All Brands</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm"
          >
            <option value="">All Stock Status</option>
            <option value="LOW_STOCK">Low Stock Warning</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Grid listing */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading registry entries...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Item Name</th>
                  <th className="py-3 px-4 font-semibold">Brand</th>
                  <th className="py-3 px-4 font-semibold">Warehouse</th>
                  <th className="py-3 px-4 font-semibold text-right">Available Qty</th>
                  <th className="py-3 px-4 font-semibold text-right">Reorder Lvl</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400">No matching stock items found.</td>
                  </tr>
                ) : (
                  items.map(item => {
                    const isLow = parseFloat(item.openingQuantity) <= parseFloat(item.reorderLevel);
                    const isOut = parseFloat(item.openingQuantity) <= 0;
                    return (
                      <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                          <div>{item.sku}</div>
                          <div className="text-xs text-slate-400">{item.code}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-100 cursor-pointer hover:underline" onClick={() => navigate(`/inventory/items/${item.id}`)}>
                          {item.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.brandName || '-'}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.warehouseName || '-'}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-semibold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-800 dark:text-slate-100'}`}>
                            {item.openingQuantity} {item.primaryUnitCode}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">{item.reorderLevel}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.status === 'ACTIVE' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => navigate(`/inventory/items/${item.id}/edit`)}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-semibold rounded transition disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400 py-1 px-2">Page {page + 1} of {totalPages}</span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-semibold rounded transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
