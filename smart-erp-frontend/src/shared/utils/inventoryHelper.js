export function getStockStatus(item) {
  const qty = parseFloat(item.currentQuantity !== undefined ? item.currentQuantity : item.openingQuantity) || 0;
  const reorder = parseFloat(item.reorderLevel !== undefined ? item.reorderLevel : item.reorderQuantity) || 0;
  
  if (qty <= 0) {
    return { status: 'OUT_OF_STOCK', label: 'Out of Stock', qty };
  } else if (qty <= reorder) {
    return { status: 'LOW_STOCK', label: `Low Stock (${qty} ${item.primaryUnitCode || 'PCS'})`, qty };
  } else {
    return { status: 'AVAILABLE', label: `Available: ${qty} ${item.primaryUnitCode || 'PCS'}`, qty };
  }
}

export function sortStockCatalog(catalog, showOutOfStockItems = true) {
  let filtered = [...catalog];
  if (!showOutOfStockItems) {
    filtered = filtered.filter(item => {
      const qty = parseFloat(item.currentQuantity !== undefined ? item.currentQuantity : item.openingQuantity) || 0;
      return qty > 0;
    });
  }

  return filtered.sort((a, b) => {
    const statusA = getStockStatus(a).status;
    const statusB = getStockStatus(b).status;

    const priority = { AVAILABLE: 1, LOW_STOCK: 2, OUT_OF_STOCK: 3 };
    return priority[statusA] - priority[statusB];
  });
}
