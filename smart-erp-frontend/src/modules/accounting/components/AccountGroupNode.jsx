import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import './styles/AccountGroupNode.css';

export default function AccountGroupNode({ node, groups, expanded, setExpanded, onEdit, onDelete }) {
  const children = groups.filter(g => g.parentGroupId === node.id);
  const isExpanded = expanded[node.id];

  return (
    <div className="pl-4 border-l border-[var(--border-light)] ml-2 text-left">
      <div className="flex items-center justify-between py-1.5 hover:bg-[var(--bg-input)] rounded px-2">
        <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
          {children.length > 0 && (
            <button onClick={() => setExpanded(node.id)} className="text-[var(--text-muted)] cursor-pointer">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          {children.length === 0 && <span className="w-3.5"></span>}
          <span className="font-medium">{node.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary-glow)] text-[var(--primary)] font-bold">{node.nature}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(node)} className="text-xs text-[var(--primary)] hover:underline cursor-pointer">Edit</button>
          {!node.isSystemGenerated && <button onClick={() => onDelete(node.id)} className="text-xs text-red-500 hover:underline cursor-pointer">Delete</button>}
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
