class ShortcutRegistry {
  constructor() {
    this.shortcuts = new Map();
  }

  register(shortcutKey, callback, description = '') {
    const key = shortcutKey.toLowerCase().replace(/\s+/g, '');
    this.shortcuts.set(key, { callback, description });
  }

  unregister(shortcutKey) {
    const key = shortcutKey.toLowerCase().replace(/\s+/g, '');
    this.shortcuts.delete(key);
  }

  get(shortcutKey) {
    const key = shortcutKey.toLowerCase().replace(/\s+/g, '');
    return this.shortcuts.get(key);
  }

  getAll() {
    return Array.from(this.shortcuts.entries()).map(([key, value]) => ({
      key,
      description: value.description
    }));
  }

  clear() {
    this.shortcuts.clear();
  }
}

export const shortcutRegistry = new ShortcutRegistry();
