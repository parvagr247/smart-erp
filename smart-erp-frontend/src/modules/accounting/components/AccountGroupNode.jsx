import React from 'react';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2, Power, FileText, Folder, FolderOpen } from 'lucide-react';
import './styles/AccountGroupNode.css';

const NATURE_COLORS = {
  ASSET: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  LIABILITY: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
  CAPITAL: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  INCOME: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  EXPENSE: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
};

export default function AccountGroupNode({
  node,
  groups,
  expanded,
  setExpanded,
  onEdit,
  onDelete,
  onToggleActive,
  onCreateChild,
  ledgerCounts,
  groupLedgersMap
}) {
  const children = groups.filter(g => g.parentGroupId === node.id);
  const ledgers = (groupLedgersMap && groupLedgersMap[node.id]) || [];
  const isExpanded = expanded[node.id];
  const count = (ledgerCounts && ledgerCounts[node.id]) || 0;
  const colorClass = NATURE_COLORS[node.nature] || NATURE_COLORS.ASSET;

  return (
    <div className="pl-4 border-l border-dashed border-slate-300 dark:border-slate-700 ml-3 text-left">
      <div className="flex items-center justify-between py-2 hover:bg-[var(--bg-input)]/70 rounded-lg px-3 transition-colors group/row">
        <div className="flex items-center gap-2.5 text-sm text-[var(--text-primary)]">
          {(children.length > 0 || ledgers.length > 0) ? (
            <button onClick={() => setExpanded(node.id)} className="text-[var(--text-muted)] cursor-pointer focus:outline-none hover:text-[var(--text-primary)]">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-3.5"></span>
          )}
          
          {/* Folder Icon */}
          {(children.length > 0 || ledgers.length > 0) ? (
            isExpanded ? <FolderOpen size={16} className="text-indigo-500/80 dark:text-indigo-400/80 shrink-0" /> : <Folder size={16} className="text-indigo-500/80 dark:text-indigo-400/80 shrink-0" />
          ) : (
            <Folder size={16} className="text-slate-400/80 dark:text-slate-600 shrink-0" />
          )}

          <span className={`font-semibold tracking-tight ${node.isActive ? '' : 'line-through text-[var(--text-muted)]'}`}>{node.name}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${colorClass}`}>{node.nature}</span>
          {count > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">{count} Ledgers</span>}
        </div>
        <div className="flex gap-3 items-center opacity-70 group-hover/row:opacity-100 transition-opacity">
          <button onClick={() => onCreateChild(node)} title="Add Child Group" className="text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] cursor-pointer flex items-center gap-0.5 focus:outline-none"><Plus size={12} /> Child</button>
          <button onClick={() => onEdit(node)} title="Edit Group" className="text-xs text-slate-400 hover:text-[var(--text-primary)] cursor-pointer focus:outline-none"><Edit size={12} /></button>
          <button onClick={() => onToggleActive(node)} title={node.isActive ? "Disable Group" : "Enable Group"} className={`text-xs p-0.5 rounded cursor-pointer focus:outline-none ${node.isActive ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-400 hover:text-slate-500'}`}><Power size={12} /></button>
          {!node.isSystemGenerated && <button onClick={() => onDelete(node.id)} title="Delete Group" className="text-xs text-rose-400 hover:text-rose-600 cursor-pointer focus:outline-none"><Trash2 size={12} /></button>}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-1.5 space-y-1">
          {children.map(child => (
            <AccountGroupNode
              key={child.id}
              node={child}
              groups={groups}
              expanded={expanded}
              setExpanded={setExpanded}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
              onCreateChild={onCreateChild}
              ledgerCounts={ledgerCounts}
              groupLedgersMap={groupLedgersMap}
            />
          ))}
          {ledgers.map(ledger => (
            <div key={ledger.id} className="pl-8 flex items-center justify-between py-1 text-xs text-[var(--text-secondary)] border-l border-dashed border-slate-300 dark:border-slate-700 ml-3 hover:bg-[var(--bg-input)]/30 rounded px-2 transition-colors">
              <div className="flex items-center gap-2">
                <FileText size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                <span className={ledger.isActive ? 'font-medium' : 'line-through text-slate-400'}>{ledger.name}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">(Bal: ₹{(ledger.openingBalance || 0).toFixed(2)})</span>
              </div>
              {!ledger.isActive && <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Disabled</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
