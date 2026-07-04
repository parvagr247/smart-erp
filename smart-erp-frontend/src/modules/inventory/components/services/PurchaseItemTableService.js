import { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventory.service';

export function usePurchaseItemTableData(items, onChange, isTaxInclusive, disabled) {
  const [stockCatalog, setStockCatalog] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});
  const [loadingRow, setLoadingRow] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    inventoryService.getItems({ page: 0, size: 100 }).then((res) => {
      if (res.success && res.data && res.data.content) {
        setStockCatalog(res.data.content);
      }
    });
  }, []);

  const handleSearchCatalog = async (rowIndex, query) => {
    setSearchQuery(prev => ({ ...prev, [rowIndex]: query }));
    setLoadingRow(prev => ({ ...prev, [rowIndex]: true }));
    try {
      const res = await inventoryService.getItems({ search: query, page: 0, size: 50 });
      if (res.success && res.data && res.data.content) {
        setStockCatalog(res.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRow(prev => ({ ...prev, [rowIndex]: false }));
    }
  };

  const handleRowChange = (index, field, val) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    
    const row = updated[index];
    const qty = parseFloat(row.quantity) || 0;
    const rate = parseFloat(row.rate) || 0;
    const discount = parseFloat(row.discount) || 0;
    const gstRate = parseFloat(row.taxPercentage) || 0;

    const rawAmount = qty * rate;
    let taxableAmount = 0;
    let taxAmount = 0;

    if (isTaxInclusive) {
      taxableAmount = (rawAmount - discount) / (1 + gstRate / 100);
      taxAmount = (rawAmount - discount) - taxableAmount;
    } else {
      taxableAmount = rawAmount - discount;
      taxAmount = taxableAmount * (gstRate / 100);
    }

    row.taxAmount = parseFloat(taxAmount.toFixed(2));
    row.totalAmount = parseFloat((taxableAmount + taxAmount).toFixed(2));

    onChange(updated);
  };

  const handleSelectItem = (index, item) => {
    const updated = [...items];
    const gstRate = item.taxCategory ? item.taxCategory.gstRate : 0;
    
    updated[index] = {
      ...updated[index],
      stockItemId: item.id,
      stockItemName: item.name,
      sku: item.sku,
      rate: item.openingValue && item.openingQuantity ? parseFloat((item.openingValue / item.openingQuantity).toFixed(2)) : 0,
      taxPercentage: gstRate,
      quantity: 1,
      discount: 0
    };

    setOpenDropdown(null);
    setSearchQuery(prev => ({ ...prev, [index]: '' }));

    handleRowChange(index, 'quantity', 1);
  };

  const addRow = () => {
    const defaultWarehouseId = localStorage.getItem('defaultWarehouseId') || '';
    onChange([
      ...items,
      {
        stockItemId: '',
        stockItemName: '',
        sku: '',
        quantity: 1,
        rate: 0,
        discount: 0,
        taxPercentage: 0,
        taxAmount: 0,
        totalAmount: 0,
        warehouseId: defaultWarehouseId,
        batchNumber: ''
      }
    ]);
  };

  const removeRow = (index) => {
    const updated = items.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (!disabled) addRow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, disabled]);

  return {
    stockCatalog,
    searchQuery,
    setSearchQuery,
    loadingRow,
    openDropdown,
    setOpenDropdown,
    handleSearchCatalog,
    handleRowChange,
    handleSelectItem,
    addRow,
    removeRow
  };
}
