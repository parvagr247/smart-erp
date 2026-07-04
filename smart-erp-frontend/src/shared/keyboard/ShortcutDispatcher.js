import { shortcutRegistry } from './ShortcutRegistry';

export const ShortcutDispatcher = {
  dispatch(e) {
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
    } else if (e.key === 'F1') {
      shortcutKey = 'f1';
    } else if (e.key === 'F2') {
      shortcutKey = 'f2';
    }

    if (shortcutKey) {
      const handler = shortcutRegistry.get(shortcutKey);
      if (handler) {
        handler.callback(e);
        e.preventDefault();
        e.stopPropagation();
        return true;
      }
    }
    return false;
  }
};
