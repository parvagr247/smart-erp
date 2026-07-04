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
      const deleteBtn = trElement.querySelector('button[title*="Delete"], button[aria-label*="delete"], .btn-delete');
      if (deleteBtn) {
        deleteBtn.click();
        e.preventDefault();
      }
    } else if (e.key === ' ') {
      const checkbox = trElement.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.click();
        e.preventDefault();
      }
    }
  }
};
