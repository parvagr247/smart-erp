import React from 'react';
import './styles/GstSummaryTable.css';

export default function GstSummaryTable({ reportData }) {
  return (
    <div>
      <div className="gst-header-panel">
        <h2 className="gst-title">GST Duty Tax Summary</h2>
        <span className="gst-subtitle">Offset Account Statement</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="gst-section-title-itc">Input Tax Credit (ITC)</h3>
          <ul className="gst-ul">
            <li className="gst-li"><span>CGST Input Tax</span><span className="gst-value">₹{reportData.inputCgst?.toFixed(2)}</span></li>
            <li className="gst-li"><span>SGST Input Tax</span><span className="gst-value">₹{reportData.inputSgst?.toFixed(2)}</span></li>
            <li className="gst-li"><span>IGST Input Tax</span><span className="gst-value">₹{reportData.inputIgst?.toFixed(2)}</span></li>
            <li className="gst-li-total"><span>Total Input Credit</span><span>₹{reportData.totalInputTax?.toFixed(2)}</span></li>
          </ul>
        </div>
        <div>
          <h3 className="gst-section-title-liability">Output Tax Liability</h3>
          <ul className="gst-ul">
            <li className="gst-li"><span>CGST Output Tax</span><span className="gst-value">₹{reportData.outputCgst?.toFixed(2)}</span></li>
            <li className="gst-li"><span>SGST Output Tax</span><span className="gst-value">₹{reportData.outputSgst?.toFixed(2)}</span></li>
            <li className="gst-li"><span>IGST Output Tax</span><span className="gst-value">₹{reportData.outputIgst?.toFixed(2)}</span></li>
            <li className="gst-li-total"><span>Total Output Liability</span><span>₹{reportData.totalOutputTax?.toFixed(2)}</span></li>
          </ul>
        </div>
      </div>
      <div className="gst-result-panel">
        <div className="gst-result-label">Net GST Payable Result:</div>
        <div className="gst-result-value">
          {reportData.netTotalPayable >= 0 ? 'Tax Payable: ' : 'Net Credit Carryforward: '}
          <span className={reportData.netTotalPayable >= 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}>
            ₹{Math.abs(reportData.netTotalPayable)?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
