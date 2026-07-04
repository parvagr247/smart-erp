import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { useAuth } from '@shared/context/AuthContext';
import { InteractionContext } from './InteractionContext';
import { PointerBlocker } from './PointerBlocker';
import { KeyboardEngine } from './KeyboardEngine';
import { FocusEngine } from './FocusEngine';
import { shortcutRegistry } from './ShortcutRegistry';
import '@shared/components/styles/ConfirmationDialog.css';

const DEFAULT_SETTINGS = {
  keyboardFirstMode: true,
  allowMouseNavigation: true,
  showKeyboardShortcuts: true,
  highVisibilityFocus: true,
  enableCommandPalette: true,
  enableGlobalShortcuts: true,
  showOutOfStockItems: true
};

export function InteractionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeCompany } = useActiveCompany();
  const keyboardOnlyMode = !!activeCompany?.keyboardOnlyMode;

  const [settings, setSettingsState] = useState(() => {
    try {
      const saved = localStorage.getItem('smartErp_interactionSettings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [isShortcutOverlayOpen, setIsShortcutOverlayOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const updateSettings = useCallback((newSettings) => {
    const merged = { ...settings, ...newSettings };
    localStorage.setItem('smartErp_interactionSettings', JSON.stringify(merged));
    setSettingsState(merged);
  }, [settings]);

  const effectiveSettings = useMemo(() => {
    if (keyboardOnlyMode) {
      return {
        ...settings,
        keyboardFirstMode: true,
        allowMouseNavigation: false,
        highVisibilityFocus: true
      };
    }
    return settings;
  }, [settings, keyboardOnlyMode]);

  useEffect(() => {
    PointerBlocker.init(keyboardOnlyMode);
    return () => {
      PointerBlocker.destroy();
    };
  }, [keyboardOnlyMode]);

  useEffect(() => {
    KeyboardEngine.init(effectiveSettings, activeCompany);
    return () => {
      KeyboardEngine.destroy();
    };
  }, [effectiveSettings, activeCompany]);

  useEffect(() => {
    if (!keyboardOnlyMode) return;

    const handleFocusLoss = () => {
      setTimeout(() => {
        const active = document.activeElement;
        const elements = document.querySelectorAll('a, button, input, select, textarea, [tabindex="0"], [role="button"]');
        const elementsArr = Array.from(elements);
        if (!active || active === document.body || !elementsArr.includes(active)) {
          FocusEngine.focusFirst();
        }
      }, 10);
    };

    document.addEventListener('focusout', handleFocusLoss);
    return () => {
      document.removeEventListener('focusout', handleFocusLoss);
    };
  }, [keyboardOnlyMode]);

  useEffect(() => {
    if (!keyboardOnlyMode) return;

    let currentModal = null;

    const observer = new MutationObserver(() => {
      const activeModal = document.querySelector('.modal-overlay');
      
      if (activeModal && activeModal !== currentModal) {
        currentModal = activeModal;
        FocusEngine.saveFocus();
        setTimeout(() => {
          FocusEngine.focusFirst(activeModal);
        }, 50);
      } else if (!activeModal && currentModal) {
        currentModal = null;
        FocusEngine.restoreFocus();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [keyboardOnlyMode]);

  useEffect(() => {
    if (keyboardOnlyMode) {
      const timer = setTimeout(() => {
        FocusEngine.focusFirst();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, keyboardOnlyMode]);

  useEffect(() => {
    shortcutRegistry.clear();

    if (effectiveSettings.keyboardFirstMode && effectiveSettings.enableGlobalShortcuts) {
      shortcutRegistry.register('alt+d', () => navigate('/dashboard'), 'Go to Dashboard', 'Navigation', 'Modules');
      shortcutRegistry.register('alt+a', () => navigate('/accounting'), 'Go to Chart of Accounts', 'Navigation', 'Modules');
      shortcutRegistry.register('alt+i', () => navigate('/inventory'), 'Go to Inventory Module', 'Navigation', 'Modules');
      shortcutRegistry.register('alt+s', () => navigate('/sales'), 'Go to Sales Module', 'Navigation', 'Modules');
      shortcutRegistry.register('alt+p', () => navigate('/purchase'), 'Go to Purchase Module', 'Navigation', 'Modules');
      shortcutRegistry.register('alt+r', () => navigate('/reports'), 'Go to Reports Module', 'Navigation', 'Modules');
      shortcutRegistry.register('alt+u', () => navigate('/admin'), 'Go to Administration Settings', 'Navigation', 'Modules');

      shortcutRegistry.register('ctrl+k', () => {
        if (effectiveSettings.enableCommandPalette) {
          setIsCommandPaletteOpen(prev => !prev);
        }
      }, 'Toggle Command Palette Search', 'Search', 'General');

      shortcutRegistry.register('f1', () => setIsShortcutOverlayOpen(prev => !prev), 'Toggle Shortcut Help Guide', 'Help', 'General');
      shortcutRegistry.register('ctrl+/', () => setIsShortcutOverlayOpen(prev => !prev), 'Toggle Shortcut Help Guide', 'Help', 'General');
      shortcutRegistry.register('?', () => setIsShortcutOverlayOpen(prev => !prev), 'Toggle Shortcut Help Guide', 'Help', 'General');

      shortcutRegistry.register('escape', () => {
        setIsShortcutOverlayOpen(false);
        setIsCommandPaletteOpen(false);
        const activeModal = document.querySelector('.modal-overlay');
        if (activeModal) {
          const cancelBtn = activeModal.querySelector('.modal-cancel-btn, button[variant="outline"]');
          if (cancelBtn) cancelBtn.click();
        }
      }, 'Cancel Form / Close Dialog / Exit Panels', 'System', 'General');

      shortcutRegistry.register('ctrl+f', () => {
        const searchInput = document.querySelector('input[placeholder*="Search"], input[type="search"]');
        if (searchInput) searchInput.focus();
      }, 'Focus Search Bar', 'Search', 'General');

      shortcutRegistry.register('ctrl+s', null, 'Save Record / Submit Form', 'General', 'Forms');
      shortcutRegistry.register('f2', null, 'Edit Focused Item', 'General', 'System');
      shortcutRegistry.register('f8', () => navigate('/sales'), 'Go to Sales Voucher', 'Sales', 'Modules');
      shortcutRegistry.register('delete', null, 'Delete Focused Item / Row', 'General', 'Tables');
      shortcutRegistry.register('tab', null, 'Next Field / Focus element', 'General', 'System');
      shortcutRegistry.register('shift+tab', null, 'Previous Field / Focus element', 'General', 'System');
      shortcutRegistry.register('enter', null, 'Activate Focused Action / Next field', 'General', 'System');
      shortcutRegistry.register('space', null, 'Toggle switch/checkbox / Select row', 'General', 'System');
      shortcutRegistry.register('arrow keys', null, 'Navigate rows / Tree nodes', 'General', 'System');
      shortcutRegistry.register('page up / down', null, 'Scroll page / list viewports', 'General', 'System');
    }
  }, [effectiveSettings, navigate]);

  return (
    <InteractionContext.Provider value={{
      settings,
      updateSettings,
      isShortcutOverlayOpen,
      setIsShortcutOverlayOpen,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen
    }}>
      {children}
      {isShortcutOverlayOpen && <ShortcutOverlay onClose={() => setIsShortcutOverlayOpen(false)} activeCompany={activeCompany} />}
    </InteractionContext.Provider>
  );
}

function ShortcutOverlay({ onClose, activeCompany }) {
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
