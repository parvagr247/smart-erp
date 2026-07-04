import React from 'react';
import './styles/ItemDetailsError.css';

export default function ItemDetailsError({ error, onBack }) {
  return (
    <div className="p-6 max-w-xl mx-auto text-center space-y-4">
      <div className="text-rose-600 font-semibold">{error || "Item not found"}</div>
      <button onClick={onBack} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm cursor-pointer">
        Return to Registry
      </button>
    </div>
  );
}
