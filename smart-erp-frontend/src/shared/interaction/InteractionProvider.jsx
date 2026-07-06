import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { useAuth } from '@shared/context/AuthContext';
import { InteractionContext } from './InteractionContext';
import { PointerBlocker } from './PointerBlocker';
import { KeyboardEngine } from './KeyboardEngine';
import { FocusEngine } from './FocusEngine';
import '@shared/components/styles/ConfirmationDialog.css';
import ShortcutOverlay from './ShortcutOverlay';
import { shortcutRegistry } from './ShortcutRegistry';

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
    
    if (keyboardOnlyMode) {
      try {
        const alertCount = parseInt(localStorage.getItem('smartErp_spaceToggleAlertCount') || '0', 10);
        if (alertCount < 2) {
          alert('Keyboard Only Mode is now active.\n\nTip: Use the SPACE key to toggle checkboxes and switch buttons on or off.');
          localStorage.setItem('smartErp_spaceToggleAlertCount', String(alertCount + 1));
        }
      } catch (e) {
        // Fallback if localStorage is disabled/restricted
      }
    }

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
      {keyboardOnlyMode && (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
          <div className="bg-slate-900/90 text-slate-100 dark:bg-white/95 dark:text-slate-900 text-[10px] md:text-xs font-semibold py-2 px-3.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700/50 dark:border-slate-200/50 animate-in fade-in slide-in-from-bottom-2 duration-300 select-none pointer-events-auto">
            <span className="text-base">⌨️</span>
            <span>
              <strong>Keyboard Tip:</strong> Press <strong>Enter</strong> to edit/select fields. Use <strong>Tab</strong>, <strong>Shift+Tab</strong>, or <strong>Arrow keys</strong> to navigate.
            </span>
          </div>
        </div>
      )}
      {isShortcutOverlayOpen && <ShortcutOverlay onClose={() => setIsShortcutOverlayOpen(false)} activeCompany={activeCompany} />}
    </InteractionContext.Provider>
  );
}

