import React from 'react';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2, Power, FileText } from 'lucide-react';
import './styles/AccountGroupNode.css';

export default function AccountGroupNode({
  node,
  groups,
  expanded,
  setExpanded,
  onEdit,
  onDelete,
  onToggleActive,
  onCreateChild,
  ledgerCountMap,
  groupLedgersMap
}) {
  const children = groups.filter(g => g.parentGroupId === node.id);
  const ledgers = groupLedgersMap[node.id] || [];
  const isExpanded = expanded[node.id];
  const count = ledgerCountMap[node.id] || 0;

  return (
    <div className="pl-4 border-l border-[var(--border-light)] ml-2 text-left">
      <div className="flex items-center justify-between py-1.5 hover:bg-[var(--bg-input)] rounded px-2">
        <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
          {(children.length > 0 || ledgers.length > 0) && (
            <button onClick={() => setExpanded(node.id)} className="text-[var(--text-muted)] cursor-pointer focus:outline-none">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          {children.length === 0 && ledgers.length === 0 && <span className="w-3.5"></span>}
          <span className={`font-medium ${node.isActive ? '' : 'line-through text-[var(--text-muted)]'}`}>{node.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary-glow)] text-[var(--primary)] font-bold">{node.nature}</span>
          {count > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">{count} Ledgers</span>}
        </div>
        <div className="flex gap-2.5 items-center">
          <button onClick={() => onCreateChild(node)} title="Add Child Group" className="text-xs text-[var(--primary)] hover:underline cursor-pointer flex items-center gap-0.5 focus:outline-none"><Plus size={12} /> Child</button>
          <button onClick={() => onEdit(node)} className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer focus:outline-none"><Edit size={12} /></button>
          <button onClick={() => onToggleActive(node)} title={node.isActive ? "Disable Group" : "Enable Group"} className={`text-xs p-0.5 rounded cursor-pointer focus:outline-none ${node.isActive ? 'text-emerald-500' : 'text-slate-400'}`}><Power size={12} /></button>
          {!node.isSystemGenerated && <button onClick={() => onDelete(node.id)} className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer focus:outline-none"><Trash2 size={12} /></button>}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-1 space-y-1">
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
              ledgerCountMap={ledgerCountMap}
              groupLedgersMap={groupLedgersMap}
            />
          ))}
          {ledgers.map(ledger => (
            <div key={ledger.id} className="pl-6 flex items-center gap-1.5 py-1 text-xs text-[var(--text-secondary)]">
              <FileText size={12} className="text-slate-400" />
              <span className={ledger.isActive ? 'font-medium' : 'line-through text-slate-400'}>{ledger.name}</span>
              <span className="text-[10px] text-slate-400">(Bal: ₹{(ledger.openingBalance || 0).toFixed(2)})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
