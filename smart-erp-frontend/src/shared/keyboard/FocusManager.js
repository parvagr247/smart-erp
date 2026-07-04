export const FocusManager = {
  focusableSelector: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]',

  getFocusableElements(container = document) {
    return Array.from(container.querySelectorAll(this.focusableSelector))
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return el.tabIndex >= 0 && rect.width > 0 && rect.height > 0 && !el.disabled;
      });
  },

  focusFirst(container = document) {
    const elements = this.getFocusableElements(container);
    // Find the first input, select or textarea first, otherwise fallback to any focusable
    const inputEl = elements.find(el => ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName));
    if (inputEl) {
      inputEl.focus();
      return true;
    }
    if (elements.length > 0) {
      elements[0].focus();
      return true;
    }
    return false;
  },

  trapFocus(e, modalContainer) {
    if (!modalContainer) return;
    const focusable = this.getFocusableElements(modalContainer);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

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

  focusNextField(currentElement) {
    const form = currentElement.closest('form') || document;
    const elements = Array.from(form.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button[type="submit"]:not([disabled])'));
    const index = elements.indexOf(currentElement);
    if (index > -1 && index < elements.length - 1) {
      elements[index + 1].focus();
      return true;
    }
    return false;
  },

  focusPrevField(currentElement) {
    const form = currentElement.closest('form') || document;
    const elements = Array.from(form.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button[type="submit"]:not([disabled])'));
    const index = elements.indexOf(currentElement);
    if (index > 0) {
      elements[index - 1].focus();
      return true;
    }
    return false;
  }
};
