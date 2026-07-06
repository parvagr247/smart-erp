import React from 'react';
import './styles/ItemFormContent.css';
import BasicDetailsTab from './form/BasicDetailsTab';
import PricingGstTab from './form/PricingGstTab';
import InventoryTrackingTab from './form/InventoryTrackingTab';

export default function ItemFormContent({ activeTab, state }) {
  const { validationError } = state;

  return (
    <div className="space-y-6">
      {validationError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-900/50">
          ⚠️ {validationError}
        </div>
      )}

      {activeTab === 'basic' && <BasicDetailsTab state={state} />}
      {activeTab === 'pricing' && <PricingGstTab state={state} />}
      {activeTab === 'inventory' && <InventoryTrackingTab state={state} />}
    </div>
  );
}

