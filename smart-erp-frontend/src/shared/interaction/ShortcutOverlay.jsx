import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { InteractionContext } from './InteractionContext';
import { shortcutRegistry } from './ShortcutRegistry';

export default function ShortcutOverlay({ onClose, activeCompany }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsCommandPaletteOpen } = useContext(InteractionContext);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  
  const allRegistryItems = shortcutRegistry.getAll();

  // 1. Permission-aware filter
  const allowedItems = allRegistryItems.filter(item => {
    if (!user) return false;
    const role = user.role;
    
    if (role === 'ADMIN') return true;

    if (item.module === 'Accounting' || item.module === 'Banking' || item.module === 'GST') {
      return role === 'ACCOUNTANT';
    }
    if (item.module === 'Inventory') {
      return role === 'INVENTORY_MANAGER';
    }
    if (item.module === 'Sales' || item.module === 'Purchase' || item.module === 'Reports') {
      return role === 'ACCOUNTANT' || role === 'INVENTORY_MANAGER';
    }
    if (item.module === 'Administration') {
      return role === 'ADMIN';
    }
    return true; // General, Navigation, Tables & Forms
  });

  // 2. Search filter
  const filteredList = allowedItems.filter(item => {
    const query = search.toLowerCase();
    const joinedKeys = item.keys.join(' ').toLowerCase();
    return (
      item.label.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.module && item.module.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query)) ||
      joinedKeys.includes(query) ||
      (item.permission && item.permission.toLowerCase().includes(query))
    );
  });

  // Sort by priority
  const sortedList = [...filteredList].sort((a, b) => (a.priority || 99) - (b.priority || 99));

  // Remove duplicates
  const uniqueList = [];
  const seenKeys = new Set();
  sortedList.forEach(item => {
    const keyCombo = item.keys.join('+');
    if (!seenKeys.has(keyCombo)) {
      seenKeys.add(keyCombo);
      uniqueList.push(item);
    }
  });

  // Group uniqueList by Category
  const groupedCategories = uniqueList.reduce((acc, item) => {
    const cat = item.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  // Reset index when search updates
  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  const handleActivateShortcut = (item) => {
    onClose();
    if (item.screen) {
      navigate(item.screen);
    } else if (item.id === 'search') {
      setIsCommandPaletteOpen(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % uniqueList.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + uniqueList.length) % uniqueList.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = uniqueList[activeIndex];
      if (selected) {
        handleActivateShortcut(selected);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  let globalItemIndex = 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content max-w-[1000px] w-full text-left bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-6 font-sans flex flex-col justify-between" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header Metadata block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-[var(--border-color)] mb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⌨️</span>
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                System Productivity Guide
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-secondary)] mt-1 font-medium">
              <span><strong>Active Company:</strong> {activeCompany?.companyName || 'Not selected'}</span>
              <span className="hidden md:inline text-[var(--border-color)]">|</span>
              <span><strong>Role Scope:</strong> {user?.role?.replace('_', ' ') || 'Guest'}</span>
              <span className="hidden md:inline text-[var(--border-color)]">|</span>
              <span className="text-[var(--primary)] font-bold">{allowedItems.length} shortcuts available</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer hover:underline md:self-center"
          >
            ✕ Close Panel
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Search action, key description, module..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2.5 bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all font-sans"
            autoFocus
          />
        </div>

        {/* Spacious JetBrains-style vertical list */}
        <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-5">
          {Object.keys(groupedCategories).map(catName => (
            <div key={catName} className="space-y-1.5">
              {/* Category section title */}
              <h3 className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider pt-2 pb-1 border-b border-[var(--border-color)]/60">
                {catName}
              </h3>
              
              <div className="space-y-0.5">
                {groupedCategories[catName].map(item => {
                  const currentIndex = globalItemIndex;
                  globalItemIndex++;
                  const isActive = currentIndex === activeIndex;
                  
                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleActivateShortcut(item)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-[var(--bg-hover)] ring-1 ring-[var(--primary)] shadow-sm' 
                          : 'hover:bg-[var(--bg-hover)]/40'
                      }`}
                    >
                      {/* Left: Action label & description */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="text-[10px] text-[var(--text-muted)] leading-tight">
                            {item.description}
                          </span>
                        )}
                      </div>
                      
                      {/* Right: Individual keyboard caps */}
                      <div className="flex items-center gap-0.5 select-none shrink-0">
                        {item.keys.map((key, kIdx) => (
                          <React.Fragment key={kIdx}>
                            {kIdx > 0 && <span className="text-[10px] text-[var(--text-muted)] mx-1">+</span>}
                            <kbd className="px-1.5 py-0.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded font-mono text-[9px] font-bold shadow-sm text-[var(--primary)]">
                              {key}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {uniqueList.length === 0 && (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No matching shortcuts found.
            </div>
          )}
        </div>

        {/* Footer Statistics */}
        <div className="flex justify-between items-center mt-5 pt-3 border-t border-[var(--border-color)] text-[10px] text-[var(--text-muted)] font-semibold">
          <span>Showing {uniqueList.length} of {allowedItems.length} system shortcuts</span>
          <span>Press ↑ ↓ to navigate rows, Enter to run actions, Esc to dismiss</span>
        </div>
      </div>
    </div>
  );
}
