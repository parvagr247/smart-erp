import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import usePurchaseDetails from '../hooks/usePurchaseDetails';
import PurchaseStatusBadge from '../components/PurchaseStatusBadge';
import PageContainer from '@shared/components/PageContainer';
import PageHeader from '@shared/components/PageHeader';

export default function PurchaseDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeCompany } = useActiveCompany();

  const details = usePurchaseDetails(id, () => navigate('/inventory/purchases'));

  if (details.loading) {
    return (
      <PageContainer>
        <div className="p-8 text-center text-sm text-[var(--text-muted)] animate-pulse">
          Loading purchase voucher details...
        </div>
      </PageContainer>
    );
  }

  if (details.error && !details.purchase) {
    return (
      <PageContainer>
        <div className="bg-red-100 border border-red-200 text-red-800 text-sm p-4 rounded-lg text-left">
          <span className="font-semibold">Error:</span> {details.error}
        </div>
        <button
          onClick={() => navigate('/inventory/purchases')}
          className="mt-4 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md text-sm text-[var(--text-primary)]"
        >
          Back to List
        </button>
      </PageContainer>
    );
  }

  const isIntraState = () => {
    if (!details.purchase) return true;
    return details.purchase.cgst > 0 || details.purchase.sgst > 0 || details.purchase.igst === 0;
  };

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-4 print:hidden text-left">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Purchase Invoice: {details.purchase.purchaseNumber}
            </h1>
            <PurchaseStatusBadge status={details.purchase.status} />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Recorded by {details.purchase.createdBy} on {new Date(details.purchase.purchaseDate).toLocaleDateString('en-IN')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={details.printInvoice}
            className="px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-xs font-semibold rounded text-[var(--text-primary)] transition-all"
          >
            🖨️ Print Invoice
          </button>

          {details.purchase.status === 'DRAFT' && (
            <>
              <Link
                to={`/purchase/edit/${id}`}
                className="px-3 py-1.5 bg-[var(--bg-body)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-xs font-semibold rounded text-[var(--text-primary)] transition-all"
              >
                ✏️ Edit Draft
              </Link>
              <button
                onClick={() => details.handleStatusTransition('APPROVED')}
                disabled={details.updating}
                className="px-3 py-1.5 bg-[var(--color-primary)] hover:opacity-90 text-xs font-semibold rounded text-white transition-all disabled:opacity-50"
              >
                ✔️ Approve & Post
              </button>
              <button
                onClick={details.deleteDraft}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-xs font-semibold rounded text-white transition-all"
              >
                🗑️ Delete Draft
              </button>
            </>
          )}

          {details.purchase.status === 'APPROVED' && (
            <>
              <button
                onClick={() => details.handleStatusTransition('RECEIVED')}
                disabled={details.updating}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold rounded text-white transition-all disabled:opacity-50"
              >
                📦 Mark as Received
              </button>
              <button
                onClick={() => details.handleStatusTransition('CANCELLED')}
                disabled={details.updating}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-xs font-semibold rounded text-white transition-all disabled:opacity-50"
              >
                ❌ Cancel Voucher
              </button>
            </>
          )}

          {details.purchase.status === 'RECEIVED' && (
            <button
              onClick={() => details.handleStatusTransition('COMPLETED')}
              disabled={details.updating}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-xs font-semibold rounded text-white transition-all disabled:opacity-50"
            >
              🏁 Complete Transaction
            </button>
          )}
        </div>
      </div>

      {details.error && (
        <div className="bg-red-100 border border-red-200 text-red-800 text-sm p-4 rounded-lg mb-4 text-left">
          <span className="font-semibold">Error:</span> {details.error}
        </div>
      )}

      {/* Main Voucher Display Sheet */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 shadow-sm text-left max-w-4xl mx-auto print:border-none print:shadow-none">
        
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-[var(--border-color)] pb-6 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-primary)]">
              {activeCompany ? activeCompany.name : 'SmartERP Corporation'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm leading-relaxed">
              {activeCompany ? activeCompany.address : 'HQ Office Block, Business Plaza'}
              <br />
              GSTIN: {activeCompany ? activeCompany.gstNumber : 'N/A'} | State: {activeCompany ? activeCompany.state : 'N/A'}
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold uppercase text-[var(--text-muted)] tracking-wider">
              Purchase Invoice
            </h3>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">
              Invoice No: {details.purchase.purchaseNumber}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Date: {new Date(details.purchase.purchaseDate).toLocaleDateString('en-IN')}
              {details.purchase.dueDate && (
                <> | Due: {new Date(details.purchase.dueDate).toLocaleDateString('en-IN')}</>
              )}
            </p>
          </div>
        </div>

        {/* Invoice Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[var(--border-color)] pb-6 mb-6">
          <div>
            <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2">
              Supplier (From)
            </h4>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {details.purchase.supplierName}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              Payment Terms: {details.purchase.paymentTerms || 'N/A'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2">
              Delivery Warehouse (Ship To)
            </h4>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {details.purchase.warehouseName}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              Standard receiving warehouse for line items.
            </p>
          </div>
        </div>

        {/* Invoice Lines Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] font-semibold uppercase">
                <th className="py-2.5 px-1">Item Description</th>
                <th className="py-2.5 px-1 w-[100px] text-right">Quantity</th>
                <th className="py-2.5 px-1 w-[120px] text-right">Rate</th>
                <th className="py-2.5 px-1 w-[100px] text-right">Discount</th>
                <th className="py-2.5 px-1 w-[120px] text-right">GST Rate</th>
                <th className="py-2.5 px-1 w-[150px] text-right">Tax Split</th>
                <th className="py-2.5 px-1 w-[150px] text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-sm text-[var(--text-primary)]">
              {details.purchase.lineItems.map((line, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-1">
                    <div className="font-semibold">{line.stockItemName}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      SKU: {line.sku} {line.batchNumber && `| Batch: ${line.batchNumber}`}
                    </div>
                  </td>
                  <td className="py-3 px-1 text-right font-medium">
                    {line.quantity}
                  </td>
                  <td className="py-3 px-1 text-right">
                    ₹{line.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-1 text-right text-red-500">
                    {line.discount > 0 ? `-₹${line.discount.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="py-3 px-1 text-right">
                    {line.taxPercentage}%
                  </td>
                  <td className="py-3 px-1 text-right text-xs text-[var(--text-muted)] leading-tight">
                    {line.taxAmount > 0 ? (
                      isIntraState() ? (
                        <>
                          CGST ({(line.taxPercentage / 2)}%): ₹{(line.taxAmount / 2).toFixed(2)}
                          <br />
                          SGST ({(line.taxPercentage / 2)}%): ₹{(line.taxAmount / 2).toFixed(2)}
                        </>
                      ) : (
                        <>IGST ({line.taxPercentage}%): ₹{line.taxAmount.toFixed(2)}</>
                      )
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-1 text-right font-semibold">
                    ₹{line.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary Footers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-6 border-t border-[var(--border-color)]">
          <div className="text-xs text-[var(--text-muted)] space-y-2">
            <h5 className="font-bold uppercase text-[var(--text-muted)]">Notes / Remarks</h5>
            <p className="leading-relaxed bg-[var(--bg-body)] p-3 rounded-md border border-[var(--border-color)]">
              {details.purchase.notes || 'No remarks added to this purchase voucher.'}
            </p>
            {details.purchase.attachments && (
              <div className="pt-2">
                <span className="font-semibold block mb-1">Attachments:</span>
                <span className="text-[var(--color-primary)] truncate block">{details.purchase.attachments}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm text-[var(--text-primary)] max-w-sm ml-auto w-full">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Voucher Subtotal</span>
              <span>₹{(details.purchase.grossAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            {details.purchase.discountAmount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Extra Discounts</span>
                <span>- ₹{details.purchase.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="border-t border-[var(--border-color)] my-1"></div>

            {isIntraState() ? (
              <>
                <div className="flex justify-between text-xs text-[var(--text-muted)]">
                  <span>CGST Input Tax</span>
                  <span>₹{(details.purchase.cgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-muted)]">
                  <span>SGST Input Tax</span>
                  <span>₹{(details.purchase.sgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-xs text-[var(--text-muted)]">
                <span>IGST Input Tax</span>
                <span>₹{(details.purchase.igst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            {details.purchase.cess > 0 && (
              <div className="flex justify-between text-xs text-[var(--text-muted)]">
                <span>CESS Input Tax</span>
                <span>₹{details.purchase.cess.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-[var(--text-muted)]">
              <span>Round Off</span>
              <span>₹{(details.purchase.roundOff || 0).toFixed(2)}</span>
            </div>

            <div className="border-t border-[var(--border-color)] my-1"></div>

            <div className="flex justify-between text-base font-bold text-[var(--color-primary)]">
              <span>Voucher Grand Total</span>
              <span>₹{(details.purchase.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
}
