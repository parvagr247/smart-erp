import { useState, useEffect } from 'react';

export default function usePurchaseForm({ initialData, onSave, companyState, disabled }) {
  const [supplier, setSupplier] = useState(null);
  const [warehouseId, setWarehouseId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [isTaxInclusive, setIsTaxInclusive] = useState(false);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState('');
  const [lines, setLines] = useState([
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
      warehouseId: '',
      batchNumber: ''
    }
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setSupplier(initialData.supplier || { id: initialData.supplierId, name: initialData.supplierName });
      setWarehouseId(initialData.warehouseId || '');
      setPurchaseDate(initialData.purchaseDate || new Date().toISOString().split('T')[0]);
      setDueDate(initialData.dueDate || '');
      setPaymentTerms(initialData.paymentTerms || '');
      setIsTaxInclusive(initialData.isTaxInclusive || false);
      setInvoiceDiscount(initialData.discountAmount || 0);
      setNotes(initialData.notes || '');
      setAttachments(initialData.attachments || '');
      if (initialData.lineItems && initialData.lineItems.length > 0) {
        setLines(initialData.lineItems);
      }
    }
  }, [initialData]);

  // Determine if intra-state or inter-state GST split
  const isIntraState = () => {
    if (!supplier) return true;
    const suppState = supplier.state || (supplier.addresses && supplier.addresses.length > 0 ? supplier.addresses[0].state : '') || '';
    const cleanComp = companyState.trim().toLowerCase();
    const cleanSupp = suppState.trim().toLowerCase();
    return cleanComp === '' || cleanSupp === '' || cleanComp === cleanSupp;
  };

  // Periodic draft auto-saving
  useEffect(() => {
    if (initialData || disabled) return;

    const autoSaveTimer = setInterval(() => {
      if (hasChanges) {
        const draft = {
          supplier,
          warehouseId,
          purchaseDate,
          dueDate,
          paymentTerms,
          isTaxInclusive,
          invoiceDiscount,
          notes,
          attachments,
          lines
        };
        localStorage.setItem('smarterp_purchase_draft', JSON.stringify(draft));
      }
    }, 10000);

    return () => clearInterval(autoSaveTimer);
  }, [supplier, warehouseId, purchaseDate, dueDate, paymentTerms, isTaxInclusive, invoiceDiscount, notes, attachments, lines, hasChanges, initialData, disabled]);

  // Prompt before unloading unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges && !disabled) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges, disabled]);

  const [hasDraftAvailable, setHasDraftAvailable] = useState(
    !initialData && !!localStorage.getItem('smarterp_purchase_draft')
  );

  const restoreDraft = () => {
    const raw = localStorage.getItem('smarterp_purchase_draft');
    if (raw) {
      try {
        const draft = JSON.parse(raw);
        setSupplier(draft.supplier);
        setWarehouseId(draft.warehouseId);
        setPurchaseDate(draft.purchaseDate);
        setDueDate(draft.dueDate);
        setPaymentTerms(draft.paymentTerms);
        setIsTaxInclusive(draft.isTaxInclusive);
        setInvoiceDiscount(draft.invoiceDiscount);
        setNotes(draft.notes);
        setAttachments(draft.attachments);
        setLines(draft.lines);
        setHasChanges(true);
        localStorage.removeItem('smarterp_purchase_draft');
        setHasDraftAvailable(false);
      } catch (err) {
        console.error('Failed to restore draft', err);
      }
    }
  };

  const discardDraft = () => {
    localStorage.removeItem('smarterp_purchase_draft');
    setHasDraftAvailable(false);
  };

  const submitForm = (status) => {
    if (!supplier) {
      alert('Please select a supplier.');
      return;
    }
    if (!warehouseId) {
      alert('Please select a warehouse.');
      return;
    }
    const invalidLines = lines.some(l => !l.stockItemId || l.quantity <= 0 || l.rate <= 0);
    if (invalidLines) {
      alert('Please make sure all items are selected and have positive quantities and rates.');
      return;
    }

    setHasChanges(false);
    localStorage.removeItem('smarterp_purchase_draft');

    onSave({
      supplierId: supplier.id,
      warehouseId,
      purchaseDate,
      dueDate: dueDate || null,
      paymentTerms,
      isTaxInclusive,
      invoiceDiscountAmount: parseFloat(invoiceDiscount) || 0,
      notes,
      attachments,
      status,
      lineItems: lines.map(l => ({
        stockItemId: l.stockItemId,
        quantity: parseFloat(l.quantity),
        rate: parseFloat(l.rate),
        discount: parseFloat(l.discount) || 0,
        warehouseId: l.warehouseId || warehouseId,
        batchNumber: l.batchNumber || null
      }))
    });
  };

  return {
    supplier,
    setSupplier: (val) => { setSupplier(val); setHasChanges(true); },
    warehouseId,
    setWarehouseId: (val) => { setWarehouseId(val); setHasChanges(true); },
    purchaseDate,
    setPurchaseDate: (val) => { setPurchaseDate(val); setHasChanges(true); },
    dueDate,
    setDueDate: (val) => { setDueDate(val); setHasChanges(true); },
    paymentTerms,
    setPaymentTerms: (val) => { setPaymentTerms(val); setHasChanges(true); },
    isTaxInclusive,
    setIsTaxInclusive: (val) => { setIsTaxInclusive(val); setHasChanges(true); },
    invoiceDiscount,
    setInvoiceDiscount: (val) => { setInvoiceDiscount(val); setHasChanges(true); },
    notes,
    setNotes: (val) => { setNotes(val); setHasChanges(true); },
    attachments,
    setAttachments: (val) => { setAttachments(val); setHasChanges(true); },
    lines,
    setLines: (val) => { setLines(val); setHasChanges(true); },
    isIntraState: isIntraState(),
    hasChanges,
    hasDraftAvailable,
    restoreDraft,
    discardDraft,
    submitForm
  };
}
