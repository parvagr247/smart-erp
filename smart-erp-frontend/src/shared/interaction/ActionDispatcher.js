export const ActionDispatcher = {
  executePrimaryAction(element, event) {
    if (!element || element === document.body) return false;

    if (typeof element.execute === 'function') {
      console.log("Executing component:", element.id || element.tagName); // Stage 5
      element.execute(event);
      return true;
    }

    if (typeof element.onEnter === 'function') {
      console.log("Executing component:", element.id || element.tagName); // Stage 5
      element.onEnter(event);
      return true;
    }

    if (typeof element.executePrimaryAction === 'function') {
      console.log("Executing component:", element.id || element.tagName); // Stage 5
      element.executePrimaryAction(event);
      return true;
    }

    const tagName = element.tagName;
    const role = element.getAttribute('role');

    if (element.classList.contains('accordion-trigger') || element.querySelector('.accordion-trigger')) {
      const trigger = element.classList.contains('accordion-trigger') ? element : element.querySelector('.accordion-trigger');
      if (trigger) {
        trigger.click();
        return true;
      }
    }

    if (role === 'checkbox' || role === 'switch' || role === 'radio' || (tagName === 'INPUT' && ['checkbox', 'radio'].includes(element.type))) {
      element.click();
      return true;
    }

    if (role === 'option' || element.classList.contains('select-item') || element.classList.contains('combobox-item') || element.classList.contains('dropdown-item')) {
      element.click();
      return true;
    }

    if (element.classList.contains('group/row')) {
      const expandBtn = element.querySelector('button');
      if (expandBtn) {
        expandBtn.click();
        return true;
      }
    }

    if (tagName === 'TR') {
      const rowLink = element.querySelector('a, button, [role="button"]');
      if (rowLink) {
        rowLink.click();
        return true;
      }
    }

    if (tagName === 'BUTTON' || tagName === 'A' || role === 'button' || element.getAttribute('tabindex') === '0' || element.getAttribute('onClick')) {
      console.log("Executing component:", element.id || element.tagName); // Stage 5
      element.click();
      return true;
    }

    return false;
  }
};
