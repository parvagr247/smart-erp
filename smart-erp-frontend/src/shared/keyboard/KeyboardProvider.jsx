import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyboardContext } from './KeyboardContext';
import { KeyboardManager } from './KeyboardManager';
import { shortcutRegistry } from './ShortcutRegistry';
import { FocusManager } from './FocusManager';

const DEFAULT_SETTINGS = {
  keyboardFirstMode: true,
  allowMouseNavigation: true,
  showKeyboardShortcuts: true,
  highVisibilityFocus: true,
  enableCommandPalette: true,
  enableGlobalShortcuts: true
};

export function KeyboardProvider({ children }) {
  const navigate = useNavigate();
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
    KeyboardManager.updateSettings(merged);
  }, [settings]);

  // Handle CSS Class Injections for Mouse & Focus styles
  useEffect(() => {
    const body = document.body;
    
    if (settings.keyboardFirstMode && !settings.allowMouseNavigation) {
      body.classList.add('mouse-nav-disabled');
    } else {
      body.classList.remove('mouse-nav-disabled');
    }

    if (settings.keyboardFirstMode && settings.highVisibilityFocus) {
      body.classList.add('high-vis-focus');
    } else {
      body.classList.remove('high-vis-focus');
    }
  }, [settings.keyboardFirstMode, settings.allowMouseNavigation, settings.highVisibilityFocus]);

  // Click warning toast for mouse-disabled mode
  useEffect(() => {
    const handleMouseWarningClick = (e) => {
      if (settings.keyboardFirstMode && !settings.allowMouseNavigation) {
        const isClickable = e.target.closest('a, button, select, input[type="submit"], tr[tabindex]');
        if (isClickable) {
          e.preventDefault();
          e.stopPropagation();

          let alertBox = document.getElementById('mouse-disabled-warning');
          if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.id = 'mouse-disabled-warning';
            alertBox.className = 'mouse-warning-toast';
            alertBox.innerText = '⚠️ Mouse Navigation is disabled by Administrator. Please use keyboard shortcuts (Alt+D, Tab, Enter) to navigate.';
            document.body.appendChild(alertBox);
            setTimeout(() => {
              alertBox.remove();
            }, 3000);
          }
        }
      }
    };

    document.addEventListener('click', handleMouseWarningClick, true);
    return () => document.removeEventListener('click', handleMouseWarningClick, true);
  }, [settings.keyboardFirstMode, settings.allowMouseNavigation]);

  // Register Default Global Shortcuts
  useEffect(() => {
    shortcutRegistry.clear();

    if (settings.keyboardFirstMode && settings.enableGlobalShortcuts) {
      // 1. Module navigations
      shortcutRegistry.register('alt+d', () => navigate('/dashboard'), 'Go to Dashboard');
      shortcutRegistry.register('alt+a', () => navigate('/accounting'), 'Go to Accounting Module');
      shortcutRegistry.register('alt+i', () => navigate('/inventory'), 'Go to Inventory Module');
      shortcutRegistry.register('alt+s', () => navigate('/sales'), 'Go to Sales Module');
      shortcutRegistry.register('alt+p', () => navigate('/purchase'), 'Go to Purchase Module');
      shortcutRegistry.register('alt+r', () => navigate('/reports'), 'Go to Reports Module');
      shortcutRegistry.register('alt+u', () => navigate('/admin'), 'Go to Administration Settings');

      // 2. Command Palette Toggle
      shortcutRegistry.register('ctrl+k', () => {
        if (settings.enableCommandPalette) {
          setIsCommandPaletteOpen(prev => !prev);
        }
      }, 'Toggle Command Palette Search Console');

      shortcutRegistry.register('ctrl+/', () => {
        if (settings.enableCommandPalette) {
          setIsCommandPaletteOpen(prev => !prev);
        }
      }, 'Toggle Command Palette Search Console');

      // 3. Global overlays
      shortcutRegistry.register('?', () => setIsShortcutOverlayOpen(prev => !prev), 'Toggle Shortcuts Help Panel');
      shortcutRegistry.register('ctrl+shift+/', () => setIsShortcutOverlayOpen(prev => !prev), 'Toggle Shortcuts Help Panel');

      // 4. Escape to close overlay
      shortcutRegistry.register('escape', () => {
        setIsShortcutOverlayOpen(false);
        setIsCommandPaletteOpen(false);
        const activeModal = document.querySelector('.modal-overlay');
        if (activeModal) {
          const cancelBtn = activeModal.querySelector('.modal-cancel-btn, button[variant="outline"]');
          if (cancelBtn) cancelBtn.click();
        }
      }, 'Close Active Dialog / Panels');

      // 5. Focus search input shortcut
      shortcutRegistry.register('ctrl+f', () => {
        const searchInput = document.querySelector('input[placeholder*="Search"], input[type="search"]');
        if (searchInput) searchInput.focus();
      }, 'Focus Search Bar');
    }
  }, [settings.keyboardFirstMode, settings.enableGlobalShortcuts, settings.enableCommandPalette, navigate]);

  // Initialize Keyboard Manager
  useEffect(() => {
    KeyboardManager.init(settings);
    const handleLocationChange = () => {
      setTimeout(() => {
        FocusManager.focusFirst();
      }, 100);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      KeyboardManager.destroy();
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [settings]);

  return (
    <KeyboardContext.Provider value={{ 
      settings, 
      updateSettings, 
      isShortcutOverlayOpen, 
      setIsShortcutOverlayOpen,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen
    }}>
      {children}
      {isShortcutOverlayOpen && <ShortcutOverlay onClose={() => setIsShortcutOverlayOpen(false)} />}
    </KeyboardContext.Provider>
  );
}

function ShortcutOverlay({ onClose }) {
  const registeredList = shortcutRegistry.getAll();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg text-left" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center pb-3 border-b border-[var(--border-light)] mb-4">
          <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">
            SmartERP Keyboard Shortcuts
          </h2>
          <button 
            onClick={onClose}
            className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
          <div className="p-3 bg-[var(--bg-input)] rounded-lg text-xs space-y-1.5 text-[var(--text-secondary)] border border-[var(--border-light)]">
            <div>💡 <strong>Form entry:</strong> Press <code>Enter</code> to move to next field, <code>Shift+Enter</code> for previous field.</div>
            <div>💡 <strong>Table grids:</strong> Use <code>Arrow keys</code> to move between rows, <code>Enter</code> to open, <code>Delete</code> to remove.</div>
          </div>

          <div className="divide-y divide-[var(--border-light)]/50">
            {registeredList.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2 items-center text-xs">
                <span className="text-[var(--text-secondary)] font-medium">
                  {item.description}
                </span>
                <kbd className="px-2 py-1 bg-[var(--bg-input)] border border-[var(--border-light)] rounded-md font-mono text-[10px] font-bold text-[var(--primary)] uppercase">
                  {item.key.replace('ctrl+', 'Ctrl + ').replace('alt+', 'Alt + ').replace('shift+', 'Shift + ')}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-3 border-t border-[var(--border-light)]">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            Close Help Panel
          </button>
        </div>
      </div>
    </div>
  );
}
