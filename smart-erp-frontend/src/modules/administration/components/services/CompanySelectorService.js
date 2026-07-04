import { useState, useEffect } from 'react';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { fetchCompaniesList } from '../../administration.service';

export function useCompanySelectorData() {
  const { activeCompany, updateActiveCompany } = useActiveCompany();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
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

  return {
    activeCompany,
    companies,
    handleChange
  };
}

