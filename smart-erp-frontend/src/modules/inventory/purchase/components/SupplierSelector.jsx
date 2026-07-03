import React, { useState, useEffect } from 'react';
import { fetchPartnersList } from '../../partner/services/partner.service';

export default function SupplierSelector({ value, onChange, disabled }) {
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      try {
        const res = await fetchPartnersList({ search, page: 0, size: 100 });
        if (res.success && res.data && res.data.content) {
          // Filter suppliers or BOTH
          const suppliers = res.data.content.filter(
            p => p.type === 'SUPPLIER' || p.type === 'BOTH'
          );
          setPartners(suppliers);
        }
      } catch (err) {
        console.error('Failed to load suppliers', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      loadPartners();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const selectedPartner = partners.find(p => p.id === value);

  return (
    <div className="relative w-full text-left">
      <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
        Supplier *
      </label>
      
      {disabled ? (
        <div className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)]">
          {selectedPartner ? selectedPartner.name : 'No Supplier Selected'}
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-color)] hover:border-[var(--text-muted)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none transition-colors"
          >
            <span>{selectedPartner ? selectedPartner.name : 'Select Supplier...'}</span>
            <span className="text-[var(--text-muted)] text-xs">▼</span>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2 border-b border-[var(--border-color)]">
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
                  autoFocus
                />
              </div>

              {loading && (
                <div className="p-3 text-xs text-[var(--text-muted)] text-center">
                  Loading...
                </div>
              )}

              {!loading && partners.length === 0 && (
                <div className="p-3 text-xs text-[var(--text-muted)] text-center">
                  No suppliers found
                </div>
              )}

              {!loading && partners.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onChange(p);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[var(--bg-body)] text-sm text-[var(--text-primary)] transition-colors border-b border-[var(--border-color)] last:border-b-0"
                >
                  <div className="font-medium">{p.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    Code: {p.code} | GSTIN: {p.gstNumber || 'N/A'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
