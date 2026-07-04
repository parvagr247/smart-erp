import React from 'react';
import SectionCard from '@shared/components/SectionCard';
import { useAuth } from '@shared/context/AuthContext';
import { BookOpen, Package, ShoppingCart, FileSpreadsheet, Users, BarChart3, ChevronRight } from 'lucide-react';
import './styles/ShortcutsPanel.css';

export default function ShortcutsPanel({ navigate }) {
  const { user } = useAuth();
  const role = user?.role;

  const portals = [];

  if (role === 'ADMIN' || role === 'ACCOUNTANT') {
    portals.push({
      title: 'Accounting & Ledger',
      desc: 'Chart of accounts, general ledger entries, voucher configurations, and transaction audits.',
      icon: <BookOpen className="text-indigo-500 shrink-0" size={22} />,
      btnText: 'Go to Accounting',
      path: '/accounting'
    });
  }

  if (role === 'ADMIN' || role === 'INVENTORY_MANAGER') {
    portals.push({
      title: 'Inventory Control',
      desc: 'Manage stock items, groups, unit of measurements, brands, manufacturers, and warehouses.',
      icon: <Package className="text-emerald-500 shrink-0" size={22} />,
      btnText: 'Go to Inventory',
      path: '/inventory'
    });
    portals.push({
      title: 'Sales & Outstandings',
      desc: 'Track customer sales invoices, accounts receivables, billing parameters, and collections.',
      icon: <ShoppingCart className="text-sky-500 shrink-0" size={22} />,
      btnText: 'Go to Sales Registry',
      path: '/sales'
    });
    portals.push({
      title: 'Procurement & Purchases',
      desc: 'Purchase orders, supplier outstandings, raw materials intake, and accounts payables.',
      icon: <FileSpreadsheet className="text-amber-500 shrink-0" size={22} />,
      btnText: 'Go to Purchases',
      path: '/purchase'
    });
    portals.push({
      title: 'Business Partners & CRM',
      desc: 'Manage supplier and customer contact details, tax registrations (GSTIN/PAN), and addresses.',
      icon: <Users className="text-rose-500 shrink-0" size={22} />,
      btnText: 'Go to Partners',
      path: '/inventory/partners'
    });
  }

  portals.push({
    title: 'Reports & Analytics',
    desc: 'Ledger registers, balance sheets, daybooks, inventory valuations, and financial summaries.',
    icon: <BarChart3 className="text-violet-500 shrink-0" size={22} />,
    btnText: 'Go to Reports',
    path: '/reports'
  });

  return (
    <SectionCard title="Quick Access Portal" description="Navigate to central business workspace modules" className="w-full text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
        {portals.map((p, idx) => (
          <div 
            key={idx} 
            tabIndex={0}
            role="button"
            className="p-5 border border-[var(--border-light)] rounded bg-[var(--bg-surface)] hover:border-[var(--primary)] hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between"
            onClick={() => navigate(p.path)}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  {p.icon}
                </div>
                <h4 className="font-bold text-[var(--text-primary)] text-sm tracking-wide">{p.title}</h4>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">{p.desc}</p>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--primary)] mt-auto pt-2 border-t border-[var(--border-light)]/50">
              <span>{p.btnText}</span>
              <ChevronRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
