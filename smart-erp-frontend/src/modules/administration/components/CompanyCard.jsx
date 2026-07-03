import React from 'react';
import { Briefcase, Calendar, MapPin, Trash2, Edit, ArrowRight } from 'lucide-react';

export default function CompanyCard({ company, onSelect, onEdit, onDelete }) {
  const createdDate = company.createdAt 
    ? new Date(company.createdAt).toLocaleDateString()
    : 'N/A';

  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col justify-between h-full overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-500 group-hover:bg-indigo-500/20" />
      
      <div>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Briefcase size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight truncate max-w-[200px]" title={company.name}>
                {company.name}
              </h3>
              <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mt-1 font-mono">
                GST: {company.gstNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 my-4 text-sm text-slate-300">
          <div className="flex items-center gap-2.5">
            <Calendar size={14} className="text-slate-500" />
            <span className="text-xs text-slate-400">Financial Year: <strong className="text-slate-200 font-medium">{company.financialYear}</strong></span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin size={14} className="text-slate-500" />
            <span className="text-xs text-slate-400">State: <strong className="text-slate-200 font-medium">{company.state}</strong></span>
          </div>
          {company.address && (
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed" title={company.address}>
                {company.address}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-4">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onEdit(company)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Edit Company"
          >
            <Edit size={15} />
          </button>
          <button 
            onClick={() => onDelete(company)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            title="Delete Company"
          >
            <Trash2 size={15} />
          </button>
        </div>
        
        <button 
          onClick={() => onSelect(company)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          Open
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
