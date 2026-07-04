import React from 'react';
import { usePurchaseItemTableData } from './services/PurchaseItemTableService';
import PurchaseItemTableRow from './PurchaseItemTableRow';
import './styles/PurchaseItemTable.css';

export default function PurchaseItemTable({ items, onChange, isIntraState, isTaxInclusive, disabled }) {
  const { stockCatalog, searchQuery, setSearchQuery, loadingRow, openDropdown, setOpenDropdown, handleSearchCatalog, handleRowChange, handleSelectItem, addRow, removeRow } = usePurchaseItemTableData(items, onChange, isTaxInclusive, disabled);

  const headers = ['Stock Item', 'Quantity', 'Rate (₹)', 'Discount (₹)', 'GST Rate (%)', 'Tax Split (₹)', 'Warehouse', 'Batch No.', 'Total Amount (₹)'];

  return (
    <div className="w-full overflow-x-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Purchase Item List</h3>
        {!disabled && (
          <button type="button" onClick={addRow} className="px-3 py-1.5 bg-[var(--bg-body)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-xs font-semibold rounded-md text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer">
            <span>+</span> Add Line <kbd className="ml-1 text-[9px] opacity-75 font-normal px-1 py-0.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded">Alt+A</kbd>
          </button>
        )}
      </div>
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] font-semibold uppercase">
            {headers.map(h => <th key={h} className="py-2.5 px-2">{h}</th>)}
            {!disabled && <th className="py-2.5 px-2 w-[50px]"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {items.map((row, idx) => (
            <PurchaseItemTableRow key={idx} idx={idx} row={row} disabled={disabled} stockCatalog={stockCatalog} handleSelectItem={handleSelectItem} handleRowChange={handleRowChange} isIntraState={isIntraState} removeRow={removeRow} items={items} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
