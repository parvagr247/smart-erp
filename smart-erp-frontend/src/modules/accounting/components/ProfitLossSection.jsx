import React from 'react';
import './styles/ProfitLossSection.css';

export default function ProfitLossSection({ title, rows, total, emptyText }) {
  return (
    <div>
      <h3 className="font-bold text-[var(--text-primary)] border-b border-[var(--border-light)] pb-2 mb-3 flex justify-between bg-[var(--bg-input)] p-2 rounded">
        <span>{title}</span>
        <span>₹{total?.toFixed(2)}</span>
      </h3>
      <ul className="divide-y divide-[var(--border-light)] text-sm text-left">
        {rows?.map((row, idx) => (
          <li key={idx} className="py-2.5 flex justify-between text-[var(--text-secondary)]">
            <span>{row.name}</span>
            <span className="font-medium text-[var(--text-primary)]">₹{row.amount?.toFixed(2)}</span>
          </li>
        ))}
        {(!rows || rows.length === 0) && (
          <li className="py-4 text-center text-[var(--text-muted)] text-xs">{emptyText}</li>
        )}
      </ul>
    </div>
  );
}
