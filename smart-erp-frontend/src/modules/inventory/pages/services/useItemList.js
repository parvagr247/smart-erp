import { useState, useEffect } from 'react';
import { inventoryService } from '../../inventory.service';

export function useItemList() {
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

  useEffect(() => {
    fetchLookups();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [page, selectedWarehouse, selectedBrand, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stock item?")) return;
    try {
      const res = await inventoryService.deleteItem(id);
      if (res.success) {
        fetchItems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    items,
    loading,
    search,
    setSearch,
    selectedWarehouse,
    setSelectedWarehouse,
    selectedBrand,
    setSelectedBrand,
    selectedStatus,
    setSelectedStatus,
    warehouses,
    brands,
    page,
    setPage,
    totalPages,
    fetchItems,
    handleSearchSubmit,
    handleDelete
  };
}

