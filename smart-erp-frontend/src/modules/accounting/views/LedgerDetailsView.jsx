import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@shared/components/PageContainer';
import StatusBadge from '@shared/components/StatusBadge';
import { fetchLedgerById } from '@modules/accounting/services/accounting.service';
import { 
  ArrowLeft, Edit, Wallet, Landmark, FileText, 
  Mail, Phone, MapPin, Copy, Check 
} from 'lucide-react';

export default function LedgerDetailsView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    fetchLedgerById(id)
      .then(res => {
        setLedger(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) return <div className="p-12 text-center animate-pulse text-indigo-400 font-semibold">Loading details...</div>;
  if (!ledger) return <div className="p-12 text-center text-rose-500 font-semibold">Ledger not found.</div>;

  return (
    <PageContainer>
      {/* Premium Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Landmark size={20} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{ledger.name}</h1>
              <p className="text-xs text-slate-400 font-medium">Inspect company ledger configuration parameters and tax status</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate('/accounting/ledgers')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-xs font-semibold cursor-pointer w-full md:w-auto justify-center"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <button
            onClick={() => navigate(`/accounting/ledgers/edit/${ledger.id}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all cursor-pointer w-full md:w-auto justify-center"
          >
            <Edit size={14} />
            Edit Ledger
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start text-left">
        
        {/* Card 1: Account Profile & Balance */}
        <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/30">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />
          
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <Wallet size={16} className="text-indigo-400" />
            Financial Profile
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Ledger Name</label>
              <div className="text-base font-bold text-white">{ledger.name}</div>
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Group Category</label>
              <div className="inline-flex items-center rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mt-0.5">
                {ledger.groupName}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Opening Balance</label>
                <div className="text-lg font-black text-white">₹{ledger.openingBalance?.toFixed(2) || '0.00'}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Balance Type</label>
                <div className={`text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded ${ledger.balanceType === 'DEBIT' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {ledger.balanceType || 'DEBIT'}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
              <div className="mt-1">
                <StatusBadge status={ledger.isActive ? 'Active' : 'Inactive'} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Tax & Regulatory Info */}
        <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/30">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-500/5 blur-3xl" />
          
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <FileText size={16} className="text-purple-400" />
            Tax & Regulatory
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">GST Applicable</label>
              <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${ledger.gstApplicable ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' : 'bg-slate-800 text-slate-400 ring-slate-700'}`}>
                {ledger.gstApplicable ? 'Yes' : 'No'}
              </span>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">GSTIN Number</label>
              <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                <span className="text-xs font-mono font-bold text-white select-all">{ledger.gstNumber || 'Not Registered'}</span>
                {ledger.gstNumber && (
                  <button 
                    onClick={() => copyToClipboard(ledger.gstNumber, 'gst')}
                    className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                    title="Copy GSTIN"
                  >
                    {copiedField === 'gst' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">PAN Number</label>
              <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                <span className="text-xs font-mono font-bold text-white select-all">{ledger.pan || 'Not Provided'}</span>
                {ledger.pan && (
                  <button 
                    onClick={() => copyToClipboard(ledger.pan, 'pan')}
                    className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                    title="Copy PAN"
                  >
                    {copiedField === 'pan' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Contact & Address Profile */}
        <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/30">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
          
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <Mail size={16} className="text-blue-400" />
            Contact Details
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
              {ledger.email ? (
                <a href={`mailto:${ledger.email}`} className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1.5">
                  <Mail size={13} className="text-slate-400" />
                  {ledger.email}
                </a>
              ) : (
                <span className="text-xs text-slate-500">Not Provided</span>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
              {ledger.phone ? (
                <a href={`tel:${ledger.phone}`} className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-400" />
                  {ledger.phone}
                </a>
              ) : (
                <span className="text-xs text-slate-500">Not Provided</span>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Registered Address</label>
              {ledger.address ? (
                <div className="flex items-start gap-1.5 text-xs text-slate-300 leading-relaxed mt-1">
                  <MapPin size={13} className="text-slate-500 mt-0.5 flex-shrink-0" />
                  <span className="select-all">{ledger.address}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-500">Not Provided</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
}
