import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';
import SectionCard from '@shared/components/SectionCard';
import ActionButton from '@shared/components/ActionButton';
import DataTable from '@shared/components/DataTable';
import StatusBadge from '@shared/components/StatusBadge';
import { Search, Eye, Edit3, Trash2, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { fetchPartnersList, deletePartnerApi, updatePartnerStatusApi } from '../services/partner.service';

export default function PartnerListView() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  
  // Search & Filter parameters
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

      const res = await fetchPartnersList(params);
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
      const res = await deletePartnerApi(id);
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
      const res = await updatePartnerStatusApi(id, nextStatus);
      if (res.success) {
        loadPartners(currentPage);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update partner status.');
    }
  };

  const columns = [
    { key: 'code', header: 'Partner Code' },
    { key: 'name', header: 'Partner Name' },
    { key: 'type', header: 'Type' },
    { key: 'email', header: 'Email Address' },
    { key: 'phone', header: 'Phone' },
    { 
      key: 'openingBalance', 
      header: 'Opening Balance', 
      render: (row) => `${row.openingBalance || '0.00'} ${row.balanceType || ''}` 
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (row) => <StatusBadge status={row.status} /> 
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <ActionButton
            label="View"
            variant="secondary"
            icon={<Eye size={12} />}
            onClick={() => navigate(`/inventory/partners/${row.id}`)}
          />
          <ActionButton
            label="Edit"
            variant="secondary"
            icon={<Edit3 size={12} />}
            onClick={() => navigate(`/inventory/partners/edit/${row.id}`)}
          />
          <ActionButton
            label={row.status === 'ACTIVE' ? 'Block' : 'Unblock'}
            variant={row.status === 'ACTIVE' ? 'outline' : 'secondary'}
            icon={row.status === 'ACTIVE' ? <ShieldAlert size={12} /> : <CheckCircle size={12} />}
            onClick={() => handleStatusChange(row.id, row.status)}
          />
          <ActionButton
            label="Delete"
            variant="destructive"
            icon={<Trash2 size={12} />}
            onClick={() => handleDelete(row.id)}
          />
        </div>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Business Partners Registry" 
        description="Search, filter, and manage all your customer and vendor profiles"
      >
        <ActionButton 
          label="Partner Dashboard" 
          variant="secondary" 
          onClick={() => navigate('/inventory/partners')} 
        />
        <ActionButton 
          label="Add Partner" 
          onClick={() => navigate('/inventory/partners/create')} 
        />
      </PageHeader>

      <SectionCard title="Ledger Index" description="Search and filter active partners list">
        {/* Search & Filter Controls */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search code, name, tax IDs..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 pl-8 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)]"
            />
            <Search size={14} className="absolute left-2.5 top-3 text-[var(--text-muted)]" />
          </div>

          <div>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer"
            >
              <option value="">-- Classification --</option>
              <option value="CUSTOMER">Customer</option>
              <option value="SUPPLIER">Supplier</option>
              <option value="BOTH">Both</option>
            </select>
          </div>

          <div>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 bg-[var(--bg-input)] rounded border border-[var(--border-light)] text-sm text-[var(--text-primary)] cursor-pointer"
            >
              <option value="">-- Status --</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button 
              type="submit" 
              className="flex-1 p-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold rounded transition"
            >
              Apply Search
            </button>
            <button 
              type="button" 
              onClick={handleClearFilters}
              className="p-2 border border-[var(--border-light)] text-[var(--text-muted)] rounded hover:bg-[var(--bg-hover)]"
              title="Reset parameters"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </form>

        {/* Data Grid Table */}
        {loading ? (
          <div className="text-center py-8 text-sm text-[var(--text-muted)] animate-pulse">Loading partners dataset...</div>
        ) : (
          <>
            <DataTable columns={columns} data={partners} />
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 border-t border-[var(--border-light)] pt-4">
                <span className="text-xs text-[var(--text-muted)]">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <ActionButton 
                    label="Previous" 
                    variant="secondary" 
                    disabled={currentPage === 0} 
                    onClick={() => loadPartners(currentPage - 1)} 
                  />
                  <ActionButton 
                    label="Next" 
                    variant="secondary" 
                    disabled={currentPage + 1 >= totalPages} 
                    onClick={() => loadPartners(currentPage + 1)} 
                  />
                </div>
              </div>
            )}
          </>
        )}
      </SectionCard>
    </PageContainer>
  );
}
