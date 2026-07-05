import React, { useState } from 'react';
import { useItemDetailsViewData } from './services/ItemDetailsViewService';
import ItemDetailsError from '../components/ItemDetailsError';
import ItemDetailsHeader from '../components/ItemDetailsHeader';
import ItemSpecifications from '../components/ItemSpecifications';
import ItemPriceTiers from '../components/ItemPriceTiers';
import ItemInventorySummary from '../components/ItemInventorySummary';
import ItemTaxInfo from '../components/ItemTaxInfo';
import StockLedgerModal from '../components/StockLedgerModal';
import InventoryAdjustmentModal from '../components/InventoryAdjustmentModal';
import './styles/ItemDetailsView.css';

export default function ItemDetailsView() {
  const { navigate, item, loading, error, handleDelete, fetchItem } = useItemDetailsViewData();
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isAdjOpen, setIsAdjOpen] = useState(false);

  if (loading) return <div className="p-6 text-center text-slate-400">Loading stock item profile...</div>;
  if (error || !item) return <ItemDetailsError error={error} onBack={() => navigate('/inventory/stock-items')} />;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-left">
      <ItemDetailsHeader 
        item={item} 
        onEdit={() => navigate(`/inventory/stock-items/edit/${item.id}`)} 
        onDelete={handleDelete}
        onAdjust={() => setIsAdjOpen(true)}
        onViewLedger={() => setIsLedgerOpen(true)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ItemSpecifications item={item} />
          <ItemPriceTiers priceLists={item.priceLists} />
        </div>
        <div className="space-y-6">
          <ItemInventorySummary item={item} />
          <ItemTaxInfo item={item} />
        </div>
      </div>

      <StockLedgerModal
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
        item={item}
      />

      <InventoryAdjustmentModal
        isOpen={isAdjOpen}
        onClose={() => setIsAdjOpen(false)}
        item={item}
        onSaveSuccess={fetchItem}
      />
    </div>
  );
}
