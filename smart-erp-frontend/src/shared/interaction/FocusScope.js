export const FocusScope = {
  getScope(element) {
    if (!element) return 'Main Content';

    if (element.closest('.modal-overlay') || element.closest('[role="dialog"]') || element.closest('.dialog-content')) {
      return 'Dialogs';
    }
    if (element.closest('.sidebar-panel') || element.closest('aside') || element.closest('.sidebar')) {
      return 'Sidebar';
    }
    if (element.closest('.navbar-top') || element.closest('header') || element.closest('.navbar')) {
      return 'Navbar';
    }
    if (element.closest('footer') || element.closest('.footer') || element.closest('.workspace-footer')) {
      return 'Footer';
    }
    if (element.closest('.fixed') || (element.closest('.absolute') && element.closest('.z-50'))) {
      return 'Floating Components';
    }

    const mainContent = element.closest('main') || element.closest('.main-content') || element.closest('.workspace-content');
    if (mainContent) {
      if (element.closest('.stat-card') || element.closest('.dashboard-card') || element.closest('.card')) {
        return 'Dashboard Cards';
      }
      if (element.closest('.quick-actions') || element.closest('.quick-action-card')) {
        return 'Quick Actions';
      }
      if (element.closest('table') || element.closest('.data-table') || element.closest('tr')) {
        return 'Tables';
      }
      if (element.closest('form')) {
        return 'Forms';
      }
      if (element.closest('[role="tree"]') || element.closest('.tree-node')) {
        return 'Trees';
      }
      if (element.closest('ul') || element.closest('ol') || element.closest('.list-container')) {
        return 'Lists';
      }
    }

    return 'Main Content';
  }
};
