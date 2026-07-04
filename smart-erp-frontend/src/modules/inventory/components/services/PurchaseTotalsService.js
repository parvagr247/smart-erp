export function usePurchaseTotalsData(items, invoiceDiscount, isIntraState) {
  let gross = 0;
  let totalDiscount = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;
  let taxTotal = 0;

  items.forEach((row) => {
    const qty = parseFloat(row.quantity) || 0;
    const rate = parseFloat(row.rate) || 0;
    const disc = parseFloat(row.discount) || 0;

    const rowGross = qty * rate;

    gross += rowGross;
    totalDiscount += disc;

    const rowTax = row.taxAmount || 0;
    taxTotal += rowTax;

    if (isIntraState) {
      cgstTotal += rowTax / 2;
      sgstTotal += rowTax / 2;
    } else {
      igstTotal += rowTax;
    }
  });

  const extraDisc = parseFloat(invoiceDiscount) || 0;
  const netTotalBeforeRoundOff = (gross - totalDiscount) + taxTotal - extraDisc;
  const grandTotal = Math.round(netTotalBeforeRoundOff);
  const roundOff = grandTotal - netTotalBeforeRoundOff;

  return {
    gross,
    totalDiscount,
    cgstTotal,
    sgstTotal,
    igstTotal,
    taxTotal,
    extraDisc,
    roundOff,
    grandTotal
  };
}
