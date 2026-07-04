import React from 'react';
import { Briefcase, Calendar, MapPin, Trash2, Edit, ArrowRight } from 'lucide-react';
import './styles/CompanyCard.css';

export default function CompanyCard({ company, onSelect, onEdit, onDelete, isAdmin }) {
  return (
    <div className="company-card-container group">
      <div className="company-card-glow" />
      <div>
        <div className="company-card-header">
          <div className="flex items-center gap-3">
            <div className="company-card-header-icon-wrap"><Briefcase size={20} /></div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight truncate max-w-[200px]" title={company.name}>{company.name}</h3>
              <span className="company-card-tag">GST: {company.gstNumber}</span>
            </div>
          </div>
        </div>
        <div className="company-card-body">
          <div className="flex items-center gap-2.5"><Calendar size={14} className="text-[var(--text-muted)]" /><span className="text-xs">Financial Year: <strong className="text-[var(--text-primary)] font-semibold">{company.financialYear}</strong></span></div>
          <div className="flex items-center gap-2.5"><MapPin size={14} className="text-[var(--text-muted)]" /><span className="text-xs">State: <strong className="text-[var(--text-primary)] font-semibold">{company.state}</strong></span></div>
          {company.address && (
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed" title={company.address}>{company.address}</p>
            </div>
          )}
        </div>
      </div>
      <div className="company-card-footer">
        {isAdmin ? (
          <div className="company-card-footer-actions">
            <button onClick={() => onEdit(company)} className="company-card-btn-edit" title="Edit Company"><Edit size={15} /></button>
            <button onClick={() => onDelete(company)} className="company-card-btn-delete" title="Delete Company"><Trash2 size={15} /></button>
          </div>
        ) : (
          <div className="company-card-footer-actions opacity-0 pointer-events-none"></div>
        )}
        <button onClick={() => onSelect(company)} className="company-card-btn-open font-semibold">Open <ArrowRight size={13} /></button>
      </div>
    </div>
  );
}
