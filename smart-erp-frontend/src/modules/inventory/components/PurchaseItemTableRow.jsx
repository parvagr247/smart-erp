import React from 'react';
import WarehouseSelector from './WarehouseSelector';
import './styles/PurchaseItemTableRow.css';

export default function PurchaseItemTableRow({ idx, row, disabled, searchQuery, setSearchQuery, handleSearchCatalog, setOpenDropdown, openDropdown, loadingRow, stockCatalog, handleSelectItem, handleRowChange, isIntraState, removeRow, items }) {
  return (
    <tr className="text-sm">
      <td className="py-2 px-1 relative text-left">
        {disabled ? <div className="font-medium text-[var(--text-primary)]">{row.stockItemName || 'N/A'}</div> :
          <div>
            <input type="text" placeholder="Select item..." value={searchQuery[idx] !== undefined ? searchQuery[idx] : row.stockItemName} onChange={(e) => { setSearchQuery(prev => ({ ...prev, [idx]: e.target.value })); handleSearchCatalog(idx, e.target.value); }} onFocus={() => setOpenDropdown(idx)} className="w-full px-2 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]" />
            {openDropdown === idx && (
              <div className="absolute z-50 w-[300px] mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-y-auto">
                {loadingRow[idx] && <div className="p-2 text-xs text-[var(--text-muted)] text-center">Loading...</div>}
                {!loadingRow[idx] && stockCatalog.map((item) => (
                  <button key={item.id} type="button" onClick={() => handleSelectItem(idx, item)} className="w-full text-left px-3 py-2 hover:bg-[var(--bg-body)] text-xs text-[var(--text-primary)] border-b border-[var(--border-color)] last:border-b-0 cursor-pointer">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)] flex justify-between mt-0.5"><span>SKU: {item.sku}</span><span>In Stock: {item.currentQuantity || 0}</span></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        }
        {row.sku && <div className="text-[10px] text-[var(--text-muted)] mt-0.5">SKU: {row.sku}</div>}
      </td>
      <td className="py-2 px-1"><input type="number" min="1" value={row.quantity || ''} onChange={(e) => handleRowChange(idx, 'quantity', e.target.value)} disabled={disabled} className="w-full px-2 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-75" /></td>
      <td className="py-2 px-1"><input type="number" min="0.01" step="0.01" value={row.rate || ''} onChange={(e) => handleRowChange(idx, 'rate', e.target.value)} disabled={disabled} className="w-full px-2 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-75" /></td>
      <td className="py-2 px-1"><input type="number" min="0" step="0.01" value={row.discount || ''} onChange={(e) => handleRowChange(idx, 'discount', e.target.value)} disabled={disabled} className="w-full px-2 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-75" /></td>
      <td className="py-2 px-1"><span className="text-xs font-medium text-[var(--text-primary)] px-2">{row.taxPercentage || 0}%</span></td>
      <td className="py-2 px-1 text-xs">
        {row.taxAmount > 0 ? (
          isIntraState ? (
            <div className="text-[10px] leading-tight text-[var(--text-muted)]">
              <div>CGST ({(row.taxPercentage / 2)}%): ₹{(row.taxAmount / 2).toFixed(2)}</div>
              <div>SGST ({(row.taxPercentage / 2)}%): ₹{(row.taxAmount / 2).toFixed(2)}</div>
            </div>
          ) : (
            <div className="text-[10px] leading-tight text-[var(--text-muted)]"><div>IGST ({row.taxPercentage}%): ₹{row.taxAmount.toFixed(2)}</div></div>
          )
        ) : <span className="text-[var(--text-muted)]">-</span>}
      </td>
      <td className="py-2 px-1"><WarehouseSelector value={row.warehouseId} onChange={(val) => handleRowChange(idx, 'warehouseId', val)} disabled={disabled} label="" /></td>
      <td className="py-2 px-1"><input type="text" placeholder="Batch..." value={row.batchNumber || ''} onChange={(e) => handleRowChange(idx, 'batchNumber', e.target.value)} disabled={disabled} className="w-full px-2 py-1 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-primary)] focus:outline-none" /></td>
      <td className="py-2 px-1 text-right font-medium text-[var(--text-primary)]">₹{row.totalAmount ? row.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</td>
      {!disabled && <td className="py-2 px-1 text-center"><button type="button" onClick={() => removeRow(idx)} disabled={items.length <= 1} className="p-1 text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors cursor-pointer">🗑️</button></td>}
    </tr>
  );
}
