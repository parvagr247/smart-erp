import { useState, useEffect } from 'react';
import { inventoryService } from '../../inventory.service';

export function useWarehouseSelectorData(value, onChange) {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWarehouses = async () => {
      setLoading(true);
      try {
        const res = await inventoryService.getWarehouses();
        if (res.success && res.data) {
          setWarehouses(res.data);
          if (!value && res.data.length > 0 && onChange) {
            onChange(res.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load warehouses', err);
      } finally {
        setLoading(false);
      }
    };
    loadWarehouses();
  }, [value, onChange]);

  return { warehouses, loading };
}

