import { useState, useEffect } from 'react';
import { inventoryService } from '../../inventory.service';

export function useItemFormViewData(props) {
  const { initialData, onSubmit, onCancel, loading } = props;
  const [activeTab, setActiveTab] = useState('basic');
  const [validationError, setValidationError] = useState('');

  // Input states
  const [code, setCode] = useState(initialData?.code || '');
  const [name, setName] = useState(initialData?.name || '');
  const [alias, setAlias] = useState(initialData?.alias || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [barcode, setBarcode] = useState(initialData?.barcode || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const [brandId, setBrandId] = useState(initialData?.brandId || '');
  const [manufacturerId, setManufacturerId] = useState(initialData?.manufacturerId || '');
  const [stockGroupId, setStockGroupId] = useState(initialData?.stockGroupId || '');
  const [categoryIds, setCategoryIds] = useState(initialData?.categoryIds || []);
  const [primaryUnitId, setPrimaryUnitId] = useState(initialData?.primaryUnitId || '');
  const [secondaryUnitId, setSecondaryUnitId] = useState(initialData?.secondaryUnitId || '');
  const [warehouseId, setWarehouseId] = useState(initialData?.warehouseId || '');
  const [taxCategoryId, setTaxCategoryId] = useState(initialData?.taxCategoryId || '');
  const [hsnId, setHsnId] = useState(initialData?.hsnId || '');

  // Business simplified inventory rules
  const [productType, setProductType] = useState(initialData?.productType || 'PHYSICAL');
  const [trackInventory, setTrackInventory] = useState(initialData?.trackInventory !== false);
  const [openingQuantity, setOpeningQuantity] = useState(initialData?.openingQuantity || 0);
  const [reorderLevel, setReorderLevel] = useState(initialData?.reorderLevel || 0);
  const [reorderQuantity, setReorderQuantity] = useState(initialData?.reorderQuantity || 0);

  // Advanced inventory settings
  const [minimumStock, setMinimumStock] = useState(initialData?.minimumStock || 0);
  const [maximumStock, setMaximumStock] = useState(initialData?.maximumStock || 0);
  const [weight, setWeight] = useState(initialData?.weight || 0);
  const [binLocation, setBinLocation] = useState(initialData?.binLocation || '');
  
  const [dimensions, setDimensions] = useState(initialData?.dimensions || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [status, setStatus] = useState(initialData?.status || 'ACTIVE');

  // Unified direct price fields
  const [purchasePrice, setPurchasePrice] = useState(() => {
    return initialData?.priceLists?.find(p => p.priceType === 'PURCHASE')?.price || 0;
  });
  const [sellingPrice, setSellingPrice] = useState(() => {
    return initialData?.priceLists?.find(p => p.priceType === 'RETAIL')?.price || 0;
  });

  // Lookups data
  const [brands, setBrands] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [hsns, setHsns] = useState([]);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const brandRes = await inventoryService.getBrands();
        if (brandRes.success) setBrands(brandRes.data);

        const mfgRes = await inventoryService.getManufacturers();
        if (mfgRes.success) setManufacturers(mfgRes.data);

        const groupRes = await inventoryService.getGroups();
        if (groupRes.success) setGroups(groupRes.data);

        const catRes = await inventoryService.getCategories();
        if (catRes.success) setCategories(catRes.data);

        const unitRes = await inventoryService.getUnits();
        if (unitRes.success) {
          setUnits(unitRes.data);
          if (!primaryUnitId && unitRes.data.length > 0) {
            setPrimaryUnitId(unitRes.data[0].id);
          }
        }

        const whRes = await inventoryService.getWarehouses();
        if (whRes.success) setWarehouses(whRes.data);

        const taxRes = await inventoryService.getTaxCategories();
        if (taxRes.success) setTaxes(taxRes.data);

        const hsnRes = await inventoryService.getHsn();
        if (hsnRes.success) setHsns(hsnRes.data);
      } catch (e) {
        console.error("Error loading form lookups", e);
      }
    };
    fetchLookups();
  }, []);

  const handleCategoryToggle = (id) => {
    if (categoryIds.includes(id)) {
      setCategoryIds(categoryIds.filter(cid => cid !== id));
    } else {
      setCategoryIds([...categoryIds, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Validations
    const qty = parseFloat(openingQuantity) || 0;
    const reorder = parseFloat(reorderLevel) || 0;
    const preferredQty = parseFloat(reorderQuantity) || 0;
    const minQty = parseFloat(minimumStock) || 0;
    const maxQty = parseFloat(maximumStock) || 0;
    const buyPrice = parseFloat(purchasePrice) || 0;
    const sellPrice = parseFloat(sellingPrice) || 0;

    if (qty < 0) {
      setValidationError("Opening Stock cannot be negative.");
      return;
    }
    if (reorder < 0) {
      setValidationError("Reorder Level cannot be negative.");
      return;
    }
    if (preferredQty < 0) {
      setValidationError("Preferred Reorder Quantity cannot be negative.");
      return;
    }
    if (buyPrice < 0 || sellPrice < 0) {
      setValidationError("Prices cannot be negative.");
      return;
    }
    if (maxQty > 0 && maxQty < reorder) {
      setValidationError("Maximum Stock Limit cannot be smaller than Reorder Level.");
      return;
    }

    const calculatedOpeningValue = qty * buyPrice;

    onSubmit({
      code,
      name,
      alias,
      sku,
      barcode,
      description,
      brandId: brandId || null,
      manufacturerId: manufacturerId || null,
      stockGroupId: stockGroupId || null,
      categoryIds,
      primaryUnitId,
      secondaryUnitId: secondaryUnitId || null,
      warehouseId: warehouseId || null,
      taxCategoryId: taxCategoryId || null,
      hsnId: hsnId || null,
      
      productType,
      trackInventory,
      openingQuantity: productType === 'SERVICE' || !trackInventory ? 0 : qty,
      openingValue: productType === 'SERVICE' || !trackInventory ? 0 : calculatedOpeningValue,
      reorderLevel: productType === 'SERVICE' || !trackInventory ? 0 : reorder,
      reorderQuantity: productType === 'SERVICE' || !trackInventory ? 0 : preferredQty,
      
      minimumStock: productType === 'SERVICE' || !trackInventory ? 0 : minQty,
      maximumStock: productType === 'SERVICE' || !trackInventory ? 0 : maxQty,
      weight: productType === 'SERVICE' ? 0 : parseFloat(weight) || 0,
      binLocation: productType === 'SERVICE' || !trackInventory ? '' : binLocation,
      
      dimensions,
      notes,
      status,
      priceLists: [
        { name: 'Purchase Price', priceType: 'PURCHASE', price: buyPrice },
        { name: 'Retail Price', priceType: 'RETAIL', price: sellPrice }
      ]
    });
  };

  const [isDirty, setIsDirty] = useState(false);
  useEffect(() => {
    const hasChanged = 
      code !== (initialData?.code || '') ||
      name !== (initialData?.name || '') ||
      alias !== (initialData?.alias || '') ||
      sku !== (initialData?.sku || '') ||
      barcode !== (initialData?.barcode || '') ||
      description !== (initialData?.description || '') ||
      brandId !== (initialData?.brandId || '') ||
      manufacturerId !== (initialData?.manufacturerId || '') ||
      stockGroupId !== (initialData?.stockGroupId || '') ||
      primaryUnitId !== (initialData?.primaryUnitId || '') ||
      secondaryUnitId !== (initialData?.secondaryUnitId || '') ||
      warehouseId !== (initialData?.warehouseId || '') ||
      taxCategoryId !== (initialData?.taxCategoryId || '') ||
      hsnId !== (initialData?.hsnId || '') ||
      productType !== (initialData?.productType || 'PHYSICAL') ||
      trackInventory !== (initialData?.trackInventory !== false) ||
      parseFloat(openingQuantity) !== parseFloat(initialData?.openingQuantity || 0) ||
      parseFloat(reorderLevel) !== parseFloat(initialData?.reorderLevel || 0) ||
      parseFloat(reorderQuantity) !== parseFloat(initialData?.reorderQuantity || 0) ||
      parseFloat(minimumStock) !== parseFloat(initialData?.minimumStock || 0) ||
      parseFloat(maximumStock) !== parseFloat(initialData?.maximumStock || 0) ||
      parseFloat(weight) !== parseFloat(initialData?.weight || 0) ||
      binLocation !== (initialData?.binLocation || '') ||
      notes !== (initialData?.notes || '') ||
      status !== (initialData?.status || 'ACTIVE');

    if (hasChanged) {
      setIsDirty(true);
    }
  }, [
    code, name, alias, sku, barcode, description, brandId, manufacturerId, 
    stockGroupId, primaryUnitId, secondaryUnitId, warehouseId, taxCategoryId, 
    hsnId, productType, trackInventory, openingQuantity, reorderLevel, 
    reorderQuantity, minimumStock, maximumStock, weight, binLocation, notes, status, initialData
  ]);

  const handleCancel = () => {
    if (isDirty) {
      if (!confirm("You have unsaved changes. Discard?")) {
        return;
      }
    }
    if (onCancel) onCancel();
  };

  return {
    activeTab,
    setActiveTab,
    handleSubmit,
    onCancel: handleCancel,
    loading,
    validationError,
    setValidationError,
    
    code, setCode,
    name, setName,
    alias, setAlias,
    sku, setSku,
    barcode, setBarcode,
    description, setDescription,
    brandId, setBrandId,
    manufacturerId, setManufacturerId,
    stockGroupId, setStockGroupId,
    categoryIds, setCategoryIds,
    primaryUnitId, setPrimaryUnitId,
    secondaryUnitId, setSecondaryUnitId,
    warehouseId, setWarehouseId,
    taxCategoryId, setTaxCategoryId,
    hsnId, setHsnId,

    productType, setProductType,
    trackInventory, setTrackInventory,
    openingQuantity, setOpeningQuantity,
    reorderLevel, setReorderLevel,
    reorderQuantity, setReorderQuantity,

    minimumStock, setMinimumStock,
    maximumStock, setMaximumStock,
    weight, setWeight,
    binLocation, setBinLocation,

    dimensions, setDimensions,
    notes, setNotes,
    status, setStatus,
    
    purchasePrice, setPurchasePrice,
    sellingPrice, setSellingPrice,

    brands,
    manufacturers,
    groups,
    categories,
    units,
    warehouses,
    taxes,
    hsns,
    handleCategoryToggle
  };
}
