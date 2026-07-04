import React from 'react';
import './styles/ItemTaxInfo.css';

export default function ItemTaxInfo({ item }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 text-left">
      <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">Tax Information</h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Tax Category</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{item.taxCategoryName || 'No tax mapped'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">HSN Code</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{item.hsnCode || 'Unspecified'}</span>
        </div>
      </div>
    </div>
  );
}
