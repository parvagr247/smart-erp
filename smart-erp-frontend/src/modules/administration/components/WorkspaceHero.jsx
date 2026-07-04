import React from 'react';
import { Plus } from 'lucide-react';
import './styles/WorkspaceHero.css';

export default function WorkspaceHero({ user, onCreateCompany, isAdmin }) {
  const getRoleDisplay = () => {
    if (user?.role === 'ADMIN') return 'Administrator';
    if (user?.role === 'ACCOUNTANT') return 'Accountant';
    if (user?.role === 'INVENTORY_MANAGER') return 'Inventory Manager';
    return '';
  };

  const getDescription = () => {
    if (user?.role === 'ADMIN') {
      return "Choose a company context below to manage system parameters, user access configurations, or view financial metrics.";
    }
    if (user?.role === 'ACCOUNTANT') {
      return "Choose a company context below to record vouchers, configure ledger accounts, and compile balance reports.";
    }
    if (user?.role === 'INVENTORY_MANAGER') {
      return "Choose a company context below to coordinate warehouses, adjust stock, and review purchase shipments.";
    }
    return "Choose one of your registered companies below to enter your transactions, ledgers, and inventory management consoles.";
  };

  const roleText = getRoleDisplay();
  const displayName = user?.fullName || 'User';

  return (
    <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-8">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-black font-heading text-[var(--text-primary)] leading-tight">
          Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-indigo-600 font-extrabold">{displayName}</span>
          {roleText && <span className="text-xs font-bold text-[var(--text-muted)] ml-2 font-sans bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-0.5 rounded-full inline-block align-middle mb-1">({roleText})</span>}!
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-medium max-w-lg">
          {getDescription()}
        </p>
      </div>
      
      {isAdmin && (
        <button
          onClick={onCreateCompany}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-indigo-600 hover:opacity-95 text-white font-semibold text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={15} />
          Create Company
        </button>
      )}
    </div>
  );
}
