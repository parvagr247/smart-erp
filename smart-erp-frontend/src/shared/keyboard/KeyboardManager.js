import { shortcutRegistry } from './ShortcutRegistry';
import { FocusManager } from './FocusManager';
import { NavigationManager } from './NavigationManager';

export const KeyboardManager = {
  init(settings = {}) {
    this.settings = settings;
    this._handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this._handleKeyDown, true);
  },

  destroy() {
    window.removeEventListener('keydown', this._handleKeyDown, true);
  },

  updateSettings(settings) {
    this.settings = settings;
  },

  handleKeyDown(e) {
    if (this.settings.keyboardFirstMode === false) return;

    const target = e.target;
    const isInput = ['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.tagName);

    // 1. Form entry focus movement (Enter / Shift+Enter)
    if (isInput && e.key === 'Enter' && target.type !== 'submit' && target.tagName !== 'TEXTAREA') {
      if (e.shiftKey) {
        if (FocusManager.focusPrevField(target)) {
          e.preventDefault();
        }
      } else {
        if (FocusManager.focusNextField(target)) {
          e.preventDefault();
        }
      }
      return;
    }

    // 2. Table row navigation
    if (target?.tagName === 'TR') {
      NavigationManager.handleTableNavigation(e, target);
      return;
    }

    // 3. Trap focus inside active modal overlays
    const activeModal = document.querySelector('.modal-overlay');
    if (activeModal && e.key === 'Tab') {
      FocusManager.trapFocus(e, activeModal);
      return;
    }

    // 4. Global Shortcuts & Module Shortcuts matching
    if (this.settings.enableGlobalShortcuts !== false) {
      let shortcutKey = '';
      if (e.ctrlKey && e.shiftKey && e.key === '/') {
        shortcutKey = 'ctrl+shift+/';
      } else if (e.key === '?') {
        shortcutKey = '?';
      } else if (e.ctrlKey) {
        shortcutKey = `ctrl+${e.key.toLowerCase()}`;
      } else if (e.altKey) {
        shortcutKey = `alt+${e.key.toLowerCase()}`;
      } else if (e.key === 'Escape') {
        shortcutKey = 'escape';
      } else if (e.key === 'Enter') {
        shortcutKey = 'enter';
      }

      if (shortcutKey) {
        const handler = shortcutRegistry.get(shortcutKey);
        if (handler) {
          handler.callback(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }
  }
};
