import React from 'react';
import './styles/ItemFormTabs.css';

export default function ItemFormTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: 'general', label: 'General Information' },
    { key: 'stock', label: 'Inventory Rules' },
    { key: 'pricing', label: 'Pricing & Taxes' }
  ];

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 flex gap-4">
      {tabs.map(t => (
        <button
          key={t.key}
          type="button"
          onClick={() => setActiveTab(t.key)}
          className={`pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${activeTab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
