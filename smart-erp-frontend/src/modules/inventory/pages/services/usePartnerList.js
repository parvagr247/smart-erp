import { useState, useEffect } from 'react';
import { inventoryService } from '../../inventory.service';

export default function usePartnerList() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  const loadPartners = async (page = 0) => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        sort: 'name,asc'
      };
      if (search.trim()) params.search = search.trim();
      if (type) params.type = type;
      if (status) params.status = status;

      const res = await inventoryService.getPartners(params);
      if (res.success && res.data) {
        setPartners(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setCurrentPage(res.data.number || 0);
      }
    } catch (err) {
      console.error('Failed to load partners list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners(0);
  }, [type, status]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    loadPartners(0);
  };

  const handleClearFilters = () => {
    setSearch('');
    setType('');
    setStatus('');
    loadPartners(0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this business partner ledger? This cannot be undone.')) return;
    try {
      const res = await inventoryService.deletePartner(id);
      if (res.success) {
        alert('Partner deleted successfully.');
        loadPartners(currentPage);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete partner.');
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    let nextStatus = 'ACTIVE';
    if (currentStatus === 'ACTIVE') {
      nextStatus = 'BLOCKED';
    } else if (currentStatus === 'BLOCKED') {
      nextStatus = 'ACTIVE';
    }
    
    try {
      const res = await inventoryService.updatePartnerStatus(id, nextStatus);
      if (res.success) {
        loadPartners(currentPage);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update partner status.');
    }
  };

  return {
    partners,
    loading,
    totalPages,
    currentPage,
    search,
    setSearch,
    type,
    setType,
    status,
    setStatus,
    handleSearchSubmit,
    handleClearFilters,
    handleDelete,
    handleStatusChange,
    loadPartners
  };
}
