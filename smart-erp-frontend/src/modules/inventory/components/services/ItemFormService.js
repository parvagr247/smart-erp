import { useState, useEffect } from 'react';
import { inventoryService } from '../../inventory.service';

export function useItemFormViewData(props) {
  const { initialData, onSubmit, onCancel, loading } = props;
  const [activeTab, setActiveTab] = useState('general');

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

  const [openingQuantity, setOpeningQuantity] = useState(initialData?.openingQuantity || 0);
  const [openingValue, setOpeningValue] = useState(initialData?.openingValue || 0);
  const [minimumStock, setMinimumStock] = useState(initialData?.minimumStock || 0);
  const [maximumStock, setMaximumStock] = useState(initialData?.maximumStock || 0);
  const [reorderLevel, setReorderLevel] = useState(initialData?.reorderLevel || 0);
  const [reorderQuantity, setReorderQuantity] = useState(initialData?.reorderQuantity || 0);

  const [weight, setWeight] = useState(initialData?.weight || 0);
  const [dimensions, setDimensions] = useState(initialData?.dimensions || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [status, setStatus] = useState(initialData?.status || 'ACTIVE');

  // Price List States
  const [priceLists, setPriceLists] = useState(initialData?.priceLists || []);

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

  const handleAddPrice = () => {
    setPriceLists([...priceLists, { name: 'Retail Price', priceType: 'RETAIL', price: 0 }]);
  };

  const handlePriceChange = (index, field, val) => {
    const updated = [...priceLists];
    updated[index][field] = val;
    setPriceLists(updated);
  };

  const handleRemovePrice = (index) => {
    setPriceLists(priceLists.filter((_, i) => i !== index));
  };

  const handleCategoryToggle = (id) => {
    if (categoryIds.includes(id)) {
      setCategoryIds(categoryIds.filter(cid => cid !== id));
    } else {
      setCategoryIds([...categoryIds, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      openingQuantity: parseFloat(openingQuantity),
      openingValue: parseFloat(openingValue),
      minimumStock: parseFloat(minimumStock),
      maximumStock: parseFloat(maximumStock),
      reorderLevel: parseFloat(reorderLevel),
      reorderQuantity: parseFloat(reorderQuantity),
      weight: parseFloat(weight),
      dimensions,
      notes,
      status,
      priceLists
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
      parseFloat(openingQuantity) !== parseFloat(initialData?.openingQuantity || 0) ||
      parseFloat(openingValue) !== parseFloat(initialData?.openingValue || 0) ||
      parseFloat(minimumStock) !== parseFloat(initialData?.minimumStock || 0) ||
      parseFloat(maximumStock) !== parseFloat(initialData?.maximumStock || 0) ||
      parseFloat(reorderLevel) !== parseFloat(initialData?.reorderLevel || 0) ||
      parseFloat(reorderQuantity) !== parseFloat(initialData?.reorderQuantity || 0) ||
      parseFloat(weight) !== parseFloat(initialData?.weight || 0) ||
      dimensions !== (initialData?.dimensions || '') ||
      notes !== (initialData?.notes || '') ||
      status !== (initialData?.status || 'ACTIVE');

    if (hasChanged) {
      setIsDirty(true);
    }
  }, [
    code, name, alias, sku, barcode, description, brandId, manufacturerId, 
    stockGroupId, primaryUnitId, secondaryUnitId, warehouseId, taxCategoryId, 
    hsnId, openingQuantity, openingValue, minimumStock, maximumStock, 
    reorderLevel, reorderQuantity, weight, dimensions, notes, status, initialData
  ]);

  const handleCancel = () => {
    if (isDirty) {
      if (!confirm("You have unsaved changes. Are you sure you want to discard them?")) {
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
    code,
    setCode,
    name,
    setName,
    alias,
    setAlias,
    sku,
    setSku,
    barcode,
    setBarcode,
    description,
    setDescription,
    brandId,
    setBrandId,
    manufacturerId,
    setManufacturerId,
    stockGroupId,
    setStockGroupId,
    categoryIds,
    setCategoryIds,
    primaryUnitId,
    setPrimaryUnitId,
    secondaryUnitId,
    setSecondaryUnitId,
    warehouseId,
    setWarehouseId,
    taxCategoryId,
    setTaxCategoryId,
    hsnId,
    setHsnId,
    openingQuantity,
    setOpeningQuantity,
    openingValue,
    setOpeningValue,
    minimumStock,
    setMinimumStock,
    maximumStock,
    setMaximumStock,
    reorderLevel,
    setReorderLevel,
    reorderQuantity,
    setReorderQuantity,
    weight,
    setWeight,
    dimensions,
    setDimensions,
    notes,
    setNotes,
    status,
    setStatus,
    priceLists,
    setPriceLists,
    brands,
    manufacturers,
    groups,
    categories,
    units,
    warehouses,
    taxes,
    hsns,
    handleAddPrice,
    handlePriceChange,
    handleRemovePrice,
    handleCategoryToggle
  };
}

