import { useState, useEffect } from 'react';
import { fetchPartnersList } from './partner.service';

export function useSupplierSelectorData(search, value) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      try {
        const res = await fetchPartnersList({ search, page: 0, size: 100 });
        if (res.success && res.data && res.data.content) {
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

  return { partners, loading, selectedPartner };
}
