import { focusRegistry } from './FocusRegistry';

export const FocusEngine = {
  lastFocusedElement: null,

  focusFirst(container = document) {
    const elements = focusRegistry.getAll().filter(el => container.contains(el));
    const firstInput = elements.find(el => ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName));
    if (firstInput) {
      firstInput.focus();
      return true;
    }
    if (elements.length > 0) {
      elements[0].focus();
      return true;
    }
    return false;
  },

  trapFocus(e, container) {
    if (!container) return;
    const elements = focusRegistry.getAll().filter(el => container.contains(el));
    if (elements.length === 0) return;

    const first = elements[0];
    const last = elements[elements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  },

  focusNextField(current) {
    const form = current.closest('form') || document;
    const elements = focusRegistry.getAll().filter(el => form.contains(el) && ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName));
    const idx = elements.indexOf(current);
    if (idx > -1 && idx < elements.length - 1) {
      elements[idx + 1].focus();
      return true;
    }
    return false;
  },

  focusPrevField(current) {
    const form = current.closest('form') || document;
    const elements = focusRegistry.getAll().filter(el => form.contains(el) && ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName));
    const idx = elements.indexOf(current);
    if (idx > 0) {
      elements[idx - 1].focus();
      return true;
    }
    return false;
  },

  saveFocus() {
    this.lastFocusedElement = document.activeElement;
  },

  restoreFocus() {
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function' && document.body.contains(this.lastFocusedElement)) {
      this.lastFocusedElement.focus();
    } else {
      this.focusFirst();
    }
  }
};
