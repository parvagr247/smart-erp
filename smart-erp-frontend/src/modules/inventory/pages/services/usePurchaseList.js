import { useState, useEffect } from 'react';
import { fetchPurchasesList } from '../../components/services/purchase.service';

export default function usePurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        sortBy: 'createdAt',
        direction: 'desc',
        search: search || undefined,
        status: status || undefined,
        supplierId: supplierId || undefined,
        warehouseId: warehouseId || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined
      };
      const res = await fetchPurchasesList(params);
      if (res.success && res.data) {
        setPurchases(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      }
    } catch (err) {
      console.error('Failed to load purchases', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, [page, status, supplierId, warehouseId, fromDate, toDate]);

  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setSupplierId('');
    setWarehouseId('');
    setFromDate('');
    setToDate('');
    setPage(0);
  };

  return {
    purchases,
    loading,
    search,
    setSearch,
    status,
    setStatus,
    supplierId,
    setSupplierId,
    warehouseId,
    setWarehouseId,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    page,
    setPage,
    totalPages,
    totalElements,
    loadPurchases,
    resetFilters
  };
}
