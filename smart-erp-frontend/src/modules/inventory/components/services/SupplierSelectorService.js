import { useState, useEffect } from 'react';
import { inventoryService } from '../../inventory.service';

export function useSupplierSelectorData(value) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      try {
        const res = await inventoryService.getPartners({ page: 0, size: 100 });
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
    loadPartners();
  }, []);

  const selectedPartner = partners.find(p => p.id === value);

  return { partners, loading, selectedPartner };
}
