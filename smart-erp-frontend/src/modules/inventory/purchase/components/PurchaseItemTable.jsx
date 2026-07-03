import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventory.service';
import WarehouseSelector from './WarehouseSelector';

export default function PurchaseItemTable({
  items,
  onChange,
  isIntraState,
  isTaxInclusive,
  disabled
}) {
  const [stockCatalog, setStockCatalog] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});
  const [loadingRow, setLoadingRow] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);

  // Load initial catalog items
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
    
    // Recalculate totals for this row
    const row = updated[index];
    const qty = parseFloat(row.quantity) || 0;
    const rate = parseFloat(row.rate) || 0;
    const discount = parseFloat(row.discount) || 0;
    const gstRate = parseFloat(row.taxPercentage) || 0;

    const rawAmount = qty * rate;
    let taxableAmount = 0;
    let taxAmount = 0;

    if (isTaxInclusive) {
      // Inclusive Tax Calculation: taxableAmount = (rawAmount - discount) / (1 + gstRate/100)
      taxableAmount = (rawAmount - discount) / (1 + gstRate / 100);
      taxAmount = (rawAmount - discount) - taxableAmount;
    } else {
      // Exclusive Tax Calculation: taxableAmount = rawAmount - discount
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

    // Trigger recalculation
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

  // Keyboard shortcut listener to add new lines (Alt + A)
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

  return (
    <div className="w-full overflow-x-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Purchase Item List</h3>
        {!disabled && (
          <button
            type="button"
            onClick={addRow}
            className="px-3 py-1.5 bg-[var(--bg-body)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-xs font-semibold rounded-md text-[var(--text-primary)] transition-colors flex items-center gap-1"
          >
            <span>+</span> Add Line <kbd className="ml-1 text-[9px] opacity-75 font-normal px-1 py-0.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded">Alt+A</kbd>
          </button>
        )}
      </div>

      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] font-semibold uppercase">
            <th className="py-2.5 px-2 w-[250px]">Stock Item</th>
            <th className="py-2.5 px-2 w-[100px]">Quantity</th>
            <th className="py-2.5 px-2 w-[120px]">Rate (₹)</th>
            <th className="py-2.5 px-2 w-[100px]">Discount (₹)</th>
            <th className="py-2.5 px-2 w-[120px]">GST Rate (%)</th>
            <th className="py-2.5 px-2 w-[120px]">Tax Split (₹)</th>
            <th className="py-2.5 px-2 w-[150px]">Warehouse</th>
            <th className="py-2.5 px-2 w-[120px]">Batch No.</th>
            <th className="py-2.5 px-2 w-[120px] text-right">Total Amount (₹)</th>
            {!disabled && <th className="py-2.5 px-2 w-[50px] text-center"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {items.map((row, idx) => (
            <tr key={idx} className="text-sm">
              {/* Stock Item Autocomplete */}
              <td className="py-2 px-1 relative">
                {disabled ? (
                  <div className="font-medium text-[var(--text-primary)]">{row.stockItemName || 'N/A'}</div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Select item..."
                      value={searchQuery[idx] !== undefined ? searchQuery[idx] : row.stockItemName}
                      onChange={(e) => {
                        setSearchQuery(prev => ({ ...prev, [idx]: e.target.value }));
                        handleSearchCatalog(idx, e.target.value);
                      }}
                      onFocus={() => setOpenDropdown(idx)}
                      className="w-full px-2 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
                    />

                    {openDropdown === idx && (
                      <div className="absolute z-50 w-[300px] mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {loadingRow[idx] && (
                          <div className="p-2 text-xs text-[var(--text-muted)] text-center">Loading...</div>
                        )}
                        {!loadingRow[idx] && stockCatalog.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectItem(idx, item)}
                            className="w-full text-left px-3 py-2 hover:bg-[var(--bg-body)] text-xs text-[var(--text-primary)] border-b border-[var(--border-color)] last:border-b-0"
                          >
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-[10px] text-[var(--text-muted)] flex justify-between mt-0.5">
                              <span>SKU: {item.sku}</span>
                              <span>In Stock: {item.currentQuantity || 0}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {row.sku && <div className="text-[10px] text-[var(--text-muted)] mt-0.5">SKU: {row.sku}</div>}
              </td>

              {/* Quantity */}
              <td className="py-2 px-1">
                <input
                  type="number"
                  min="1"
                  value={row.quantity || ''}
                  onChange={(e) => handleRowChange(idx, 'quantity', e.target.value)}
                  disabled={disabled}
                  className="w-full px-2 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-75"
                />
              </td>

              {/* Rate */}
              <td className="py-2 px-1">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={row.rate || ''}
                  onChange={(e) => handleRowChange(idx, 'rate', e.target.value)}
                  disabled={disabled}
                  className="w-full px-2 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-75"
                />
              </td>

              {/* Discount */}
              <td className="py-2 px-1">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={row.discount || ''}
                  onChange={(e) => handleRowChange(idx, 'discount', e.target.value)}
                  disabled={disabled}
                  className="w-full px-2 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-75"
                />
              </td>

              {/* GST Rate */}
              <td className="py-2 px-1">
                <span className="text-xs font-medium text-[var(--text-primary)] px-2">{row.taxPercentage || 0}%</span>
              </td>

              {/* GST Split Displays */}
              <td className="py-2 px-1 text-xs">
                {row.taxAmount > 0 ? (
                  isIntraState ? (
                    <div className="text-[10px] leading-tight text-[var(--text-muted)]">
                      <div>CGST ({(row.taxPercentage / 2)}%): ₹{(row.taxAmount / 2).toFixed(2)}</div>
                      <div>SGST ({(row.taxPercentage / 2)}%): ₹{(row.taxAmount / 2).toFixed(2)}</div>
                    </div>
                  ) : (
                    <div className="text-[10px] leading-tight text-[var(--text-muted)]">
                      <div>IGST ({row.taxPercentage}%): ₹{row.taxAmount.toFixed(2)}</div>
                    </div>
                  )
                ) : (
                  <span className="text-[var(--text-muted)]">-</span>
                )}
              </td>

              {/* Warehouse */}
              <td className="py-2 px-1">
                <WarehouseSelector
                  value={row.warehouseId}
                  onChange={(val) => handleRowChange(idx, 'warehouseId', val)}
                  disabled={disabled}
                  label=""
                />
              </td>

              {/* Batch Number */}
              <td className="py-2 px-1">
                <input
                  type="text"
                  placeholder="Batch..."
                  value={row.batchNumber || ''}
                  onChange={(e) => handleRowChange(idx, 'batchNumber', e.target.value)}
                  disabled={disabled}
                  className="w-full px-2 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </td>

              {/* Total Amount */}
              <td className="py-2 px-1 text-right font-medium text-[var(--text-primary)]">
                ₹{row.totalAmount ? row.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
              </td>

              {/* Action column (delete row) */}
              {!disabled && (
                <td className="py-2 px-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    disabled={items.length <= 1}
                    className="p-1 text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
                  >
                    🗑️
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
