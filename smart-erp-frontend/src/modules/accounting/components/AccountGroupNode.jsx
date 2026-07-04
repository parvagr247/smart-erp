import React from 'react';
import { ChevronRight, ChevronDown, Plus, Eye, Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './styles/AccountGroupNode.css';

export default function AccountGroupNode({ 
  node, groups, expanded, setExpanded, onEdit, onDelete, onCreateChild, onToggleActive, ledgerCounts 
}) {
  const navigate = useNavigate();
  const children = groups.filter(g => g.parentGroupId === node.id);
  const isExpanded = expanded[node.id];
  const ledgerCount = ledgerCounts[node.id] || 0;

  const handleViewLedgers = () => {
    navigate(`/accounting/ledgers?groupId=${node.id}`);
  };

  return (
    <div className="pl-4 border-l border-[var(--border-light)] ml-2 text-left">
      <div className="flex items-center justify-between py-1.5 hover:bg-[var(--bg-hover)] rounded px-2 gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
          {children.length > 0 && (
            <button onClick={() => setExpanded(node.id)} className="text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)]">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          {children.length === 0 && <span className="w-3.5"></span>}
          
          <span className={`font-medium ${!node.isActive ? 'text-[var(--text-muted)] line-through' : ''}`}>
            {node.name}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary-glow)] text-[var(--primary)] font-bold">
            {node.nature}
          </span>
          {!node.isActive && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold">
              Inactive
            </span>
          )}
        </div>

        <div className="flex gap-4 items-center ml-auto">
          {/* Ledger count indicator & action */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span>{ledgerCount} {ledgerCount === 1 ? 'ledger' : 'ledgers'}</span>
            {ledgerCount > 0 && (
              <button 
                onClick={handleViewLedgers}
                className="p-1 hover:bg-[var(--bg-input)] rounded text-[var(--primary)] cursor-pointer"
                title="View Ledgers in Registry"
              >
                <Eye size={12} />
              </button>
            )}
          </div>

          {/* Action Links */}
          <div className="flex gap-2 items-center text-xs">
            <button 
              onClick={() => onCreateChild(node)}
              className="p-1 hover:bg-[var(--bg-input)] rounded text-emerald-600 cursor-pointer"
              title="Create Child Group"
            >
              <Plus size={12} />
            </button>
            <button onClick={() => onEdit(node)} className="text-[var(--primary)] hover:underline cursor-pointer font-semibold">Edit</button>
            <button 
              onClick={() => onToggleActive(node)} 
              className={`p-1 rounded cursor-pointer ${node.isActive ? 'text-amber-500 hover:bg-amber-500/10' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
              title={node.isActive ? 'Disable Group' : 'Enable Group'}
            >
              <Power size={12} />
            </button>
            {!node.isSystemGenerated && (
              <button onClick={() => onDelete(node.id)} className="text-red-500 hover:underline cursor-pointer font-semibold">Delete</button>
            )}
          </div>
        </div>
      </div>
      {children.length > 0 && isExpanded && (
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
              onCreateChild={onCreateChild}
              onToggleActive={onToggleActive}
              ledgerCounts={ledgerCounts}
            />
          ))}
        </div>
      )}
    </div>
  );
}
