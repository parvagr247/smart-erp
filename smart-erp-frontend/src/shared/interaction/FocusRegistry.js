export class FocusRegistry {
  constructor() {
    this.elements = new Set();
  }

  register(element) {
    if (element) {
      this.elements.add(element);
    }
  }

  unregister(element) {
    if (element) {
      this.elements.delete(element);
    }
  }

  clear() {
    this.elements.clear();
  }

  getAll() {
    const targetSelectors = [
      'a', 'button', 'input', 'select', 'textarea', 
      '[role="button"]', '[role="checkbox"]', '[role="switch"]', '[role="option"]',
      'tr[onClick]', '[onClick]', 
      'footer a', 'footer button'
    ];
    
    try {
      const elements = document.querySelectorAll(targetSelectors.join(','));
      elements.forEach(el => {
        if (el.tabIndex < 0 || el.getAttribute('tabindex') === null) {
          if (
            el.getAttribute('onClick') !== null ||
            el.onclick !== null ||
            el.classList.contains('cursor-pointer') ||
            ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)
          ) {
            el.tabIndex = 0;
          }
        }
      });
    } catch (e) {}

    const selector = 'a, button, input, select, textarea, [tabindex="0"], [role="button"], [role="checkbox"], [role="switch"], [role="option"], tr[tabindex="0"]';
    const domElements = Array.from(document.querySelectorAll(selector)).filter(el => {
      if (el.disabled || el.getAttribute('aria-hidden') === 'true') return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && el.tabIndex >= 0;
    });

    const combined = new Set([...domElements, ...this.elements]);
    return Array.from(combined).filter(el => document.body.contains(el) && el.tabIndex >= 0 && !el.disabled);
  }

  getCurrent() {
    const el = document.activeElement;
    if (el && el !== document.body) {
      if (typeof el.activate !== 'function') {
        el.activate = (event) => {
          const tagName = el.tagName;
          const role = el.getAttribute('role');

          if (el.classList.contains('accordion-trigger') || el.querySelector('.accordion-trigger')) {
            const trigger = el.classList.contains('accordion-trigger') ? el : el.querySelector('.accordion-trigger');
            if (trigger) trigger.click();
            return;
          }
          if (el.classList.contains('group/row')) {
            const expandBtn = el.querySelector('button');
            if (expandBtn) expandBtn.click();
            return;
          }
          if (tagName === 'TR') {
            const rowLink = el.querySelector('a, button, [role="button"]');
            if (rowLink) rowLink.click();
            return;
          }
          if (role === 'option' || el.classList.contains('select-item') || el.classList.contains('combobox-item') || el.classList.contains('dropdown-item')) {
            el.click();
            return;
          }
          el.click();
        };
      }
      return el;
    }
    return null;
  }
}

export const focusRegistry = new FocusRegistry();
