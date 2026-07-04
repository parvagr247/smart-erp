import React, { useMemo } from 'react';
import { useInteraction } from '@shared/interaction/InteractionContext';
import { getStockStatus, sortStockCatalog } from '@shared/utils/inventoryHelper';

export default function StockItemSelector({ value, onChange, items = [], placeholder = "Select stock item...", disabled = false }) {
  const { settings } = useInteraction();

  const sortedCatalog = useMemo(() => {
    return sortStockCatalog(items, settings.showOutOfStockItems);
  }, [items, settings.showOutOfStockItems]);

  return (
    <select
      value={value || ''}
      disabled={disabled}
      onChange={(e) => {
        const selectedId = e.target.value;
        const found = items.find(item => item.id === selectedId);
        if (found) {
          onChange(found);
        } else {
          onChange({ id: '' });
        }
      }}
      className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded p-2 text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer focus:border-[var(--primary)]"
    >
      <option value="">-- {placeholder} --</option>
      {sortedCatalog.map(item => {
        const stock = getStockStatus(item);
        const isOutOfStock = stock.status === 'OUT_OF_STOCK';
        const isLowStock = stock.status === 'LOW_STOCK';

        let optionLabel = item.name;
        if (item.sku) {
          optionLabel += ` (${item.sku})`;
        }
        optionLabel += ` - ${stock.label}`;

        return (
          <option
            key={item.id}
            value={item.id}
            disabled={isOutOfStock}
            title={isOutOfStock ? "Out of Stock - Current Quantity: 0 - Cannot be selected." : undefined}
            style={{
              color: isOutOfStock ? '#f87171' : (isLowStock ? '#fbbf24' : 'inherit')
            }}
          >
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
}
