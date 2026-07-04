import { useState, useEffect } from 'react';
import { inventoryService } from '../../inventory.service';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';

export function useSalesViewData() {
  const { activeCompany } = useActiveCompany();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [mode, setMode] = useState('LIST');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);

  const [customerId, setCustomerId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [salesDate, setSalesDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [isTaxInclusive, setIsTaxInclusive] = useState(false);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState([
    { stockItemId: '', quantity: 1, rate: 0, discount: 0, taxPercentage: 0 }
  ]);

  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [stats, setStats] = useState({ salesCount: 0, totalSalesValue: 0 });

  const loadSales = async () => {
    setLoading(true);
    try {
      const res = await inventoryService.getSales();
      if (res.success && res.data) {
        setSales(res.data.content || []);
      }
      
      const summaryRes = await inventoryService.getDashboardSummary();
      if (summaryRes.success && summaryRes.data) {
        setStats({
          salesCount: summaryRes.data.salesCount || 0,
          totalSalesValue: summaryRes.data.totalSalesValue || 0
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch sales vouchers.');
    } finally {
      setLoading(false);
    }
  };

  const loadMasterData = async () => {
    try {
      const [partnersRes, itemsRes, whRes] = await Promise.all([
        inventoryService.getPartners({ page: 0, size: 100 }),
        inventoryService.getItems({ page: 0, size: 100 }),
        inventoryService.getWarehouses()
      ]);
      
      if (partnersRes.success && partnersRes.data) {
        const custs = partnersRes.data.content.filter(
          p => p.type === 'CUSTOMER' || p.type === 'BOTH'
        );
        setCustomers(custs);
      }
      if (itemsRes.success && itemsRes.data) {
        setItems(itemsRes.data.content || []);
      }
      if (whRes.success && whRes.data) {
        setWarehouses(whRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load form master data', err);
    }
  };

  useEffect(() => {
    if (activeCompany) {
      loadSales();
      loadMasterData();
    }
  }, [activeCompany]);

  const handleCreate = () => {
    setCustomerId('');
    setWarehouseId('');
    setSalesDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setPaymentTerms('');
    setIsTaxInclusive(false);
    setInvoiceDiscount(0);
    setNotes('');
    setLines([{ stockItemId: '', quantity: 1, rate: 0, discount: 0, taxPercentage: 0 }]);
    setSelectedId(null);
    setSelectedSale(null);
    setMode('CREATE');
  };

  const handleEdit = (sale) => {
    setCustomerId(sale.customerId);
    setWarehouseId(sale.warehouseId);
    setSalesDate(sale.salesDate || new Date().toISOString().split('T')[0]);
    setDueDate(sale.dueDate || '');
    setPaymentTerms(sale.paymentTerms || '');
    setIsTaxInclusive(sale.isTaxInclusive || false);
    setInvoiceDiscount(sale.invoiceDiscountAmount || 0);
    setNotes(sale.notes || '');
    if (sale.lineItems && sale.lineItems.length > 0) {
      setLines(sale.lineItems.map(l => ({
        id: l.id,
        stockItemId: l.stockItemId,
        quantity: l.quantity,
        rate: l.rate,
        discount: l.discount || 0,
        taxPercentage: l.taxPercentage || 0
      })));
    }
    setSelectedId(sale.id);
    setSelectedSale(sale);
    setMode('EDIT');
  };

  const handleDetails = async (id) => {
    setLoading(true);
    try {
      const res = await inventoryService.getSale(id);
      if (res.success && res.data) {
        setSelectedSale(res.data);
        setSelectedId(id);
        setMode('DETAILS');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch sales invoice details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setLoading(true);
    try {
      const res = await inventoryService.updateSaleStatus(id, status);
      if (res.success) {
        if (mode === 'DETAILS') {
          handleDetails(id);
        } else {
          loadSales();
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel/delete this sales invoice?')) return;
    setLoading(true);
    try {
      const res = await inventoryService.deleteSale(id);
      if (res.success) {
        alert('Sales invoice deleted successfully.');
        setMode('LIST');
        loadSales();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete sales invoice.');
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (status) => {
    if (!customerId) return alert('Please select a customer.');
    if (!warehouseId) return alert('Please select a warehouse.');
    const invalidLines = lines.some(l => !l.stockItemId || l.quantity <= 0 || l.rate <= 0);
    if (invalidLines) return alert('Please check stock items selection, quantities, and rates.');

    setLoading(true);
    try {
      const payload = {
        customerId,
        warehouseId,
        salesDate,
        dueDate: dueDate || null,
        paymentTerms,
        isTaxInclusive,
        invoiceDiscountAmount: parseFloat(invoiceDiscount) || 0,
        notes,
        status,
        lineItems: lines.map(l => ({
          id: l.id || null,
          stockItemId: l.stockItemId,
          quantity: parseFloat(l.quantity),
          rate: parseFloat(l.rate),
          discount: parseFloat(l.discount) || 0,
          taxPercentage: parseFloat(l.taxPercentage) || 0,
          warehouseId
        }))
      };

      let res;
      if (mode === 'EDIT') {
        res = await inventoryService.updateSale(selectedId, payload);
      } else {
        res = await inventoryService.createSale(payload);
      }

      if (res.success) {
        setMode('LIST');
        loadSales();
      } else {
        alert(res.message || 'Save failed.');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Server validation error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const updateLine = (index, field, val) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: val };
    setLines(updated);
  };

  const addLine = () => {
    setLines([...lines, { stockItemId: '', quantity: 1, rate: 0, discount: 0, taxPercentage: 0 }]);
  };

  const removeLine = (index) => {
    if (lines.length === 1) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    
    lines.forEach(l => {
      const qty = parseFloat(l.quantity) || 0;
      const rate = parseFloat(l.rate) || 0;
      const lineDisc = parseFloat(l.discount) || 0;
      const taxRate = parseFloat(l.taxPercentage) || 0;
      
      const lineSub = (qty * rate) - lineDisc;
      let lineTax = 0;
      
      if (isTaxInclusive) {
        const factor = taxRate / 100;
        lineTax = lineSub * (factor / (1 + factor));
      } else {
        lineTax = lineSub * (taxRate / 100);
      }
      
      subtotal += lineSub;
      totalTax += lineTax;
    });

    const netAmount = subtotal + (isTaxInclusive ? 0 : totalTax) - (parseFloat(invoiceDiscount) || 0);

    return {
      subtotal,
      totalTax,
      netAmount
    };
  };

  const totals = calculateTotals();

  return {
    sales,
    loading,
    error,
    mode,
    setMode,
    selectedSale,
    stats,
    customers,
    items,
    warehouses,
    customerId,
    setCustomerId,
    warehouseId,
    setWarehouseId,
    salesDate,
    setSalesDate,
    dueDate,
    setDueDate,
    paymentTerms,
    setPaymentTerms,
    isTaxInclusive,
    setIsTaxInclusive,
    invoiceDiscount,
    setInvoiceDiscount,
    notes,
    setNotes,
    lines,
    updateLine,
    addLine,
    removeLine,
    totals,
    handleCreate,
    handleEdit,
    handleDetails,
    handleStatusChange,
    handleDelete,
    submitForm
  };
}
