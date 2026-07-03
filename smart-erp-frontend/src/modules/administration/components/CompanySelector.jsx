import React, { useState, useEffect } from 'react';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { fetchCompaniesList } from '../services/company.service';

export default function CompanySelector() {
  const { activeCompany, updateActiveCompany } = useActiveCompany();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Fetch a quick pageable list of companies for the selector dropdown
    fetchCompaniesList(0, 50)
      .then((res) => {
        if (res.success && res.data) {
          setCompanies(res.data.content || []);
        }
      })
      .catch((err) => console.error('Failed to load switcher companies:', err));
  }, []);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    const selected = companies.find((c) => c.id === selectedId);
    if (selected) {
      updateActiveCompany(selected);
    }
  };

  if (companies.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <select
        value={activeCompany?.id || ''}
        onChange={handleChange}
        className="px-3 py-1.5 text-xs font-semibold bg-[var(--bg-input)] border border-[var(--border-light)] rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] cursor-pointer"
      >
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
