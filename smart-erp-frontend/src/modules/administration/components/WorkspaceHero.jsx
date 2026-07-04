import React from 'react';
import { Plus } from 'lucide-react';
import './styles/WorkspaceHero.css';

export default function WorkspaceHero({ user, onCreateCompany }) {
  return (
    <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-8">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-black font-heading text-[var(--text-primary)] leading-tight">
          Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-indigo-600 font-extrabold">{user?.name || 'User'}</span>!
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-medium max-w-lg">
          Choose one of your registered companies below to enter your transactions, ledgers, and inventory management consoles.
        </p>
      </div>
      
      <button
        onClick={onCreateCompany}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-indigo-600 hover:opacity-95 text-white font-semibold text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus size={15} />
        Create Company
      </button>
    </div>
  );
}
