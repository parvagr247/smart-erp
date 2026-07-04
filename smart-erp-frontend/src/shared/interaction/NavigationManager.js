export const NavigationManager = {
  handleTableNavigation(e, trElement) {
    if (!trElement || trElement.tagName !== 'TR') return;

    const tbody = trElement.closest('tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));
    const index = rows.indexOf(trElement);

    if (e.key === 'ArrowDown') {
      if (index < rows.length - 1) {
        rows[index + 1].focus();
        e.preventDefault();
      }
    } else if (e.key === 'ArrowUp') {
      if (index > 0) {
        rows[index - 1].focus();
        e.preventDefault();
      }
    } else if (e.key === 'PageDown') {
      const targetIndex = Math.min(index + 5, rows.length - 1);
      if (rows[targetIndex]) {
        rows[targetIndex].focus();
        e.preventDefault();
      }
    } else if (e.key === 'PageUp') {
      const targetIndex = Math.max(index - 5, 0);
      if (rows[targetIndex]) {
        rows[targetIndex].focus();
        e.preventDefault();
      }
    } else if (e.key === 'Home') {
      if (rows.length > 0) {
        rows[0].focus();
        e.preventDefault();
      }
    } else if (e.key === 'End') {
      if (rows.length > 0) {
        rows[rows.length - 1].focus();
        e.preventDefault();
      }
    } else if (e.key === 'Enter') {
      const actionLink = trElement.querySelector('a, button:not([disabled])');
      if (actionLink) {
        actionLink.click();
        e.preventDefault();
      }
    } else if (e.key === 'Delete') {
      const deleteBtn = trElement.querySelector('button[title*="Delete"], button[aria-label*="delete"], .btn-delete, button.text-red-500, button.text-rose-600, .text-rose-600');
      if (deleteBtn) {
        deleteBtn.click();
        e.preventDefault();
      }
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      const checkbox = trElement.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.click();
        e.preventDefault();
      }
    } else if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
      const checkboxes = Array.from(tbody.querySelectorAll('input[type="checkbox"]'));
      checkboxes.forEach(cb => {
        if (!cb.checked) cb.click();
      });
      e.preventDefault();
    }
  }
};
