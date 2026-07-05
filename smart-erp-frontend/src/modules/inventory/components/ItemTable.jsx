import React from 'react';
import './styles/ItemTable.css';

export default function ItemTable({ items, onNavigate, onDelete, onAdjust }) {
  return (
    <div className="registry-table-container">
      <table className="registry-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Item Name</th>
            <th>Brand</th>
            <th>Warehouse</th>
            <th className="text-right">Available Qty</th>
            <th className="text-right">Reorder Lvl</th>
            <th className="text-center">Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-8 text-center text-[var(--text-muted)]">
                No matching stock items found.
              </td>
            </tr>
          ) : (
            items.map(item => {
              const qty = parseFloat(item.currentQuantity !== undefined ? item.currentQuantity : item.openingQuantity) || 0;
              const reorder = parseFloat(item.reorderLevel) || 0;
              const isLow = qty <= reorder;
              const isOut = qty <= 0;
              
              let qtyClass = "qty-safe";
              if (isOut) qtyClass = "qty-danger";
              else if (isLow) qtyClass = "qty-warning";
 
              return (
                <tr key={item.id}>
                  <td>
                    <div className="sku-text">{item.sku}</div>
                    <div className="sku-sub">{item.code}</div>
                  </td>
                  <td 
                    className="item-name-cell" 
                    onClick={() => onNavigate(`/inventory/stock-items/${item.id}`)}
                  >
                    {item.name}
                  </td>
                  <td>{item.brandName || '-'}</td>
                  <td>{item.warehouseName || '-'}</td>
                  <td className="text-right">
                    <span className={`qty-pill ${qtyClass}`}>
                      {item.currentQuantity !== undefined ? item.currentQuantity : item.openingQuantity} {item.primaryUnitCode}
                    </span>
                  </td>
                  <td className="text-right">{item.reorderLevel}</td>
                  <td className="text-center">
                    <span className={`status-pill ${item.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-3 items-center">
                      {onAdjust && (
                        <button 
                          onClick={() => onAdjust(item)} 
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-md cursor-pointer transition-colors"
                        >
                          Adjust
                        </button>
                      )}
                      <button 
                        onClick={() => onNavigate(`/inventory/stock-items/edit/${item.id}`)} 
                        className="action-btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)} 
                        className="action-btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
