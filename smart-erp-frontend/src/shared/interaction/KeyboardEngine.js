import { FocusEngine } from './FocusEngine';
import { NavigationEngine } from './NavigationEngine';
import { ActionDispatcher } from './ActionDispatcher';
import { shortcutRegistry } from './ShortcutRegistry';
import { focusRegistry } from './FocusRegistry';
import { PointerBlocker } from './PointerBlocker';

export const KeyboardEngine = {
  init(settings = {}, activeCompany = null) {
    this.settings = settings;
    this.activeCompany = activeCompany;
    this.keyboardOnlyMode = !!activeCompany?.keyboardOnlyMode;
    this._handleKeyDown = this.handleKeyDown.bind(this);
    this._handleFocusIn = (e) => {
      const target = e.target;
      const isAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
      if (isAuthPage) return;

      const isEditable = (target.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'submit', 'range'].includes(target.type)) || target.tagName === 'TEXTAREA';
      const isIgnored = target.hasAttribute('data-no-keyboard-engine');
      if (isEditable && !isIgnored && !target.hasAttribute('data-in-edit-mode')) {
        target.readOnly = true;
        target.style.setProperty('caret-color', 'transparent', 'important');
      }

      const rect = target.getBoundingClientRect();
      const isOutside = rect.top < 85 || rect.bottom > window.innerHeight - 85 || rect.left < 50 || rect.right > window.innerWidth - 50;
      if (isOutside) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    };
    this._handleFocusOut = (e) => {
      const target = e.target;
      if (target.hasAttribute('data-in-edit-mode')) {
        target.removeAttribute('data-in-edit-mode');
        target.readOnly = true;
        target.style.setProperty('caret-color', 'transparent', 'important');
      }
    };

    window.removeEventListener('keydown', this._handleKeyDown, true);
    window.addEventListener('keydown', this._handleKeyDown, true);

    document.removeEventListener('focusin', this._handleFocusIn, true);
    document.addEventListener('focusin', this._handleFocusIn, true);

    document.removeEventListener('focusout', this._handleFocusOut, true);
    document.addEventListener('focusout', this._handleFocusOut, true);
  },

  destroy() {
    window.removeEventListener('keydown', this._handleKeyDown, true);
    document.removeEventListener('focusin', this._handleFocusIn, true);
    document.removeEventListener('focusout', this._handleFocusOut, true);
  },

  updateSettings(settings, activeCompany) {
    this.settings = settings;
    this.activeCompany = activeCompany;
    this.keyboardOnlyMode = !!activeCompany?.keyboardOnlyMode;
  },

  scrollActiveContainer(direction, key) {
    const activeEl = document.activeElement;
    let scrollContainer = null;
    let curr = activeEl;
    while (curr && curr !== document.body && curr !== document.documentElement) {
      const style = window.getComputedStyle(curr);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll' || curr.classList.contains('overflow-y-auto') || curr.classList.contains('data-table-scroll')) {
        scrollContainer = curr;
        break;
      }
      curr = curr.parentElement;
    }

    if (!scrollContainer) {
      scrollContainer = document.querySelector('.max-h-\\[60vh\\], .overflow-y-auto, .data-table-scroll') || document.documentElement || document.body;
    }

    if (!scrollContainer) return;

    const scrollSpeed = 40;
    const pageMultiplier = window.innerHeight * 0.8;

    if (key === 'ArrowDown') {
      scrollContainer.scrollTop += scrollSpeed;
    } else if (key === 'ArrowUp') {
      scrollContainer.scrollTop -= scrollSpeed;
    } else if (key === 'PageDown' || key === ' ') {
      scrollContainer.scrollTop += pageMultiplier;
    } else if (key === 'PageUp' || (key === ' ' && direction === 'up')) {
      scrollContainer.scrollTop -= pageMultiplier;
    } else if (key === 'Home') {
      scrollContainer.scrollTop = 0;
    } else if (key === 'End') {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  },

  handleKeyDown(e) {
    const isAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
    if (isAuthPage) return;

    console.log("KEY:", e.key); // Stage 1

    const isKeyboardFirst = this.settings.keyboardFirstMode || this.keyboardOnlyMode;
    if (!isKeyboardFirst) return;

    console.log("KeyboardEngine received:", e.key); // Stage 2

    const target = e.target;
    const isInput = ['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.tagName) || target?.getAttribute('contenteditable') === 'true';
    const isEditable = ((target?.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'submit', 'range'].includes(target?.type)) || target?.tagName === 'TEXTAREA') && !target?.hasAttribute('data-no-keyboard-engine');
    const isEditing = isEditable && target?.hasAttribute('data-in-edit-mode');

    // 1. Checkbox toggle on Enter
    if (target?.tagName === 'INPUT' && target?.type === 'checkbox') {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        target.click();
        return;
      }
    }

    // 2. Navigation Mode / Edit Mode toggle for editable fields
    if (isEditable) {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (!isEditing) {
          target.setAttribute('data-in-edit-mode', 'true');
          target.setAttribute('data-original-value', target.value);
          target.readOnly = false;
          target.style.removeProperty('caret-color');
          target.focus();
          target.select();
        } else {
          target.removeAttribute('data-in-edit-mode');
          target.readOnly = true;
          target.style.setProperty('caret-color', 'transparent', 'important');
          target.blur();
          target.focus();
        }
        return;
      }

      if (e.key === 'Escape') {
        if (isEditing) {
          e.preventDefault();
          e.stopPropagation();
          const orig = target.getAttribute('data-original-value');
          if (orig !== null) {
            target.value = orig;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            target.dispatchEvent(new Event('change', { bubbles: true }));
          }
          target.removeAttribute('data-in-edit-mode');
          target.readOnly = true;
          target.style.setProperty('caret-color', 'transparent', 'important');
          target.blur();
          target.focus();
          return;
        }
      }
    }

    const isSelect = target?.tagName === 'SELECT' || 
                     target?.getAttribute('data-slot') === 'select-trigger' || 
                     target?.getAttribute('role') === 'combobox' ||
                     target?.classList.contains('company-selector-select') ||
                     target?.classList.contains('warehouse-selector-select') ||
                     target?.classList.contains('filter-select');

    if (isSelect) {
      const isRadixSelect = target.getAttribute('data-slot') === 'select-trigger';
      const isOpen = isRadixSelect ? (target.getAttribute('data-state') === 'open') : false;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        const direction = e.key === 'ArrowLeft' ? 'left' : 'right';
        const nextEl = NavigationEngine.navigate(direction, target);
        if (nextEl) {
          nextEl.focus();
        }
        return;
      }

      if (!isOpen && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        e.stopPropagation();
        const direction = e.key === 'ArrowUp' ? 'up' : 'down';
        const nextEl = NavigationEngine.navigate(direction, target);
        if (nextEl) {
          nextEl.focus();
        }
        return;
      }
    }

    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay');
      if (activeModal) {
        const cancelBtn = activeModal.querySelector('.modal-cancel-btn, button[variant="outline"], button[type="button"]');
        if (cancelBtn) {
          cancelBtn.click();
          e.preventDefault();
          return;
        }
      }
    }

    let shortcutKey = '';
    if (e.ctrlKey && e.shiftKey && e.key === '/') shortcutKey = 'ctrl+shift+/';
    else if (e.key === '?') shortcutKey = '?';
    else if (e.ctrlKey) shortcutKey = `ctrl+${e.key.toLowerCase()}`;
    else if (e.altKey) shortcutKey = `alt+${e.key.toLowerCase()}`;
    else if (e.key === 'Escape') shortcutKey = 'escape';
    else if (e.key === 'Enter') shortcutKey = 'enter';
    else if (e.key === 'F1') shortcutKey = 'f1';
    else if (e.key === 'F2') shortcutKey = 'f2';

    if (shortcutKey) {
      const handler = shortcutRegistry.get(shortcutKey);
      if (handler && !handler.docOnly && typeof handler.callback === 'function') {
        handler.callback(e);
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }

    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (arrowKeys.includes(e.key)) {
      let shouldNavigate = !isInput;
      if (isInput) {
        if (isEditable && !isEditing) {
          shouldNavigate = true;
        } else if (!isEditable) {
          shouldNavigate = true;
        }
      }

      if (shouldNavigate) {
        let direction = '';
        if (e.key === 'ArrowDown') direction = 'down';
        else if (e.key === 'ArrowUp') direction = 'up';
        else if (e.key === 'ArrowLeft') direction = 'left';
        else if (e.key === 'ArrowRight') direction = 'right';

        const nextEl = NavigationEngine.navigate(direction, document.activeElement);
        if (nextEl) {
          nextEl.focus();
          if (typeof nextEl.scrollIntoView === 'function') {
            nextEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    }

    const scrollKeys = ['PageUp', 'PageDown', 'Home', 'End'];
    if (this.keyboardOnlyMode && scrollKeys.includes(e.key) && !isInput) {
      this.scrollActiveContainer(e.key === 'PageUp' ? 'up' : 'down', e.key);
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (isInput && e.key === 'Enter' && target.type !== 'submit' && target.tagName !== 'TEXTAREA') {
      if (target.closest('table')) {
        const nextEl = NavigationEngine.navigate(e.shiftKey ? 'up' : 'down', target);
        if (nextEl) {
          nextEl.focus();
          e.preventDefault();
          return;
        }
      }

      if (e.shiftKey) {
        if (FocusEngine.focusPrevField(target)) {
          e.preventDefault();
        }
      } else {
        if (FocusEngine.focusNextField(target)) {
          e.preventDefault();
        }
      }
      return;
    }

    if (e.key === 'Enter') {
      const current = focusRegistry.getCurrent();
      console.log("Current focused component:", current ? (current.id || current.tagName) : 'none'); // Stage 3
      if (current) {
        console.log("Dispatching action for:", current.id || current.tagName); // Stage 4
        console.log("Executing component:", current.id || current.tagName); // Stage 5
        try {
          PointerBlocker.isProgrammatic = true;
          current.activate(e);
        } finally {
          PointerBlocker.isProgrammatic = false;
        }
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }

    if (e.key === ' ') {
      const activeEl = document.activeElement;
      if (activeEl && activeEl !== document.body && !isInput) {
        if (
          activeEl.getAttribute('role') === 'checkbox' || 
          activeEl.getAttribute('role') === 'switch' || 
          (activeEl.tagName === 'INPUT' && (activeEl.type === 'checkbox' || activeEl.type === 'radio')) ||
          activeEl.classList.contains('switch') || 
          activeEl.tagName === 'TR' || 
          activeEl.classList.contains('group/row')
        ) {
          activeEl.click();
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    }
  }
};
