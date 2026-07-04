import React from 'react';
import './styles/GstSummaryTable.css';

export default function GstSummaryTable({ reportData }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-neutral-100 flex justify-between items-end">
        <h2 className="text-xl font-bold text-neutral-900">GST Duty Tax Summary</h2>
        <span className="text-xs text-neutral-400">Offset Account Statement</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div>
          <h3 className="font-bold text-emerald-600 border-b pb-2 mb-3 bg-emerald-50 p-2 rounded">
            Input Tax Credit (ITC)
          </h3>
          <ul className="divide-y divide-neutral-100 text-sm">
            <li className="py-2.5 flex justify-between">
              <span>CGST Input Tax</span>
              <span className="font-medium text-neutral-900">₹{reportData.inputCgst?.toFixed(2)}</span>
            </li>
            <li className="py-2.5 flex justify-between">
              <span>SGST Input Tax</span>
              <span className="font-medium text-neutral-900">₹{reportData.inputSgst?.toFixed(2)}</span>
            </li>
            <li className="py-2.5 flex justify-between">
              <span>IGST Input Tax</span>
              <span className="font-medium text-neutral-900">₹{reportData.inputIgst?.toFixed(2)}</span>
            </li>
            <li className="py-3 flex justify-between font-bold border-t border-neutral-200">
              <span>Total Input Credit</span>
              <span>₹{reportData.totalInputTax?.toFixed(2)}</span>
            </li>
          </ul>
        </div>

        {/* Outputs */}
        <div>
          <h3 className="font-bold text-rose-600 border-b pb-2 mb-3 bg-rose-50 p-2 rounded">
            Output Tax Liability
          </h3>
          <ul className="divide-y divide-neutral-100 text-sm">
            <li className="py-2.5 flex justify-between">
              <span>CGST Output Tax</span>
              <span className="font-medium text-neutral-900">₹{reportData.outputCgst?.toFixed(2)}</span>
            </li>
            <li className="py-2.5 flex justify-between">
              <span>SGST Output Tax</span>
              <span className="font-medium text-neutral-900">₹{reportData.outputSgst?.toFixed(2)}</span>
            </li>
            <li className="py-2.5 flex justify-between">
              <span>IGST Output Tax</span>
              <span className="font-medium text-neutral-900">₹{reportData.outputIgst?.toFixed(2)}</span>
            </li>
            <li className="py-3 flex justify-between font-bold border-t border-neutral-200">
              <span>Total Output Liability</span>
              <span>₹{reportData.totalOutputTax?.toFixed(2)}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6 flex flex-col items-end gap-2 text-right">
        <div className="text-sm text-neutral-500 font-semibold">
          Net GST Payable Result:
        </div>
        <div className="text-xl font-bold bg-neutral-100 p-4 rounded-xl border border-neutral-200 mt-2">
          {reportData.netTotalPayable >= 0 ? 'Tax Payable: ' : 'Net Credit Carryforward: '}
          <span className={reportData.netTotalPayable >= 0 ? "text-rose-600" : "text-emerald-600"}>
            ₹{Math.abs(reportData.netTotalPayable)?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
