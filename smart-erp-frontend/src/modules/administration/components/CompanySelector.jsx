import React from 'react';
import { useCompanySelectorData } from './services/CompanySelectorService';
import './styles/CompanySelector.css';

export default function CompanySelector() {
  const { activeCompany, companies, handleChange } = useCompanySelectorData();

  if (companies.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <select value={activeCompany?.id || ''} onChange={handleChange} className="company-selector-select">
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
