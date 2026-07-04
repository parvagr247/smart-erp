import React from 'react';
import './styles/OutstandingTable.css';

export default function OutstandingTable({ reportData, partnerType }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
        <h2 className="text-xl font-bold text-neutral-900">{partnerType} Ledger Outstandings</h2>
        <span className="text-xs text-neutral-400">Total: ₹{reportData.totalOutstanding?.toFixed(2)}</span>
      </div>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-600 font-semibold bg-neutral-50">
            <th className="py-3 px-4">Partner Name</th>
            <th className="py-3 px-4">Contact Info</th>
            <th className="py-3 px-4 text-right">Outstanding Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          {reportData.rows?.map((row, idx) => (
            <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
              <td className="py-3 px-4 font-medium text-neutral-900">{row.partnerName}</td>
              <td className="py-3 px-4 text-neutral-500 text-xs">
                <div>Phone: {row.phone}</div>
                <div>Email: {row.email}</div>
              </td>
              <td className="py-3 px-4 text-right text-rose-600 font-bold">₹{row.outstandingAmount?.toFixed(2)}</td>
            </tr>
          ))}
          {(!reportData.rows || reportData.rows.length === 0) && (
            <tr>
              <td colSpan={3} className="py-8 text-center text-neutral-400 text-xs">No outstanding balances found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
