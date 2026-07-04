import React from 'react';
import './styles/ItemPriceTiers.css';

export default function ItemPriceTiers({ priceLists }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-left">
      <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 mb-4">Price Lists Configuration</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <th className="pb-2 font-semibold">Tier Name</th>
              <th className="pb-2 font-semibold">Price Type</th>
              <th className="pb-2 text-right font-semibold">Unit Price (INR)</th>
            </tr>
          </thead>
          <tbody>
            {priceLists.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-4 text-center text-slate-400">No custom pricing lists assigned.</td>
              </tr>
            ) : (
              priceLists.map((p, i) => (
                <tr key={i} className="border-b border-slate-50 dark:border-slate-800 last:border-b-0">
                  <td className="py-3 font-medium text-slate-700 dark:text-slate-300">{p.name}</td>
                  <td className="py-3 text-slate-500">{p.priceType}</td>
                  <td className="py-3 text-right font-semibold text-slate-800 dark:text-slate-100">₹{p.price.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
