class ShortcutRegistry {
  constructor() {
    this.shortcuts = new Map();
    this.registryList = [
      // General
      { id: 'help', label: 'Toggle Help Panel', keys: ['F1'], description: 'Toggle keyboard shortcut help guide', module: 'General', category: 'General', priority: 1 },
      { id: 'search', label: 'Command Search', keys: ['Ctrl', 'K'], description: 'Toggle global search palette', module: 'General', category: 'General', priority: 2 },
      { id: 'escape', label: 'Dismiss Dialog / Overlay', keys: ['Esc'], description: 'Close any active modal, menu or dialog', module: 'General', category: 'General', priority: 3 },
      { id: 'enter', label: 'Primary Action Selector', keys: ['Enter'], description: 'Confirm selection or activate focused action', module: 'General', category: 'General', priority: 4 },
      
      // Navigation
      { id: 'nav-dash', label: 'Go to Dashboard', keys: ['Alt', 'D'], description: 'Navigate directly to central ERP dashboard', module: 'Navigation', category: 'Navigation', screen: '/dashboard', priority: 10 },
      { id: 'nav-acct', label: 'Go to Chart of Accounts', keys: ['Alt', 'A'], description: 'Open accounts chart configurations', module: 'Navigation', category: 'Navigation', screen: '/accounting', priority: 11 },
      { id: 'nav-inv', label: 'Go to Inventory Control', keys: ['Alt', 'I'], description: 'Open stock catalog and inventory control dashboard', module: 'Navigation', category: 'Navigation', screen: '/inventory', priority: 12 },
      { id: 'nav-sales', label: 'Go to Sales Registry', keys: ['Alt', 'S'], description: 'Open billing registry and sales invoices', module: 'Navigation', category: 'Navigation', screen: '/sales', priority: 13 },
      { id: 'nav-pur', label: 'Go to Purchases', keys: ['Alt', 'P'], description: 'Open supplier invoices and purchases', module: 'Navigation', category: 'Navigation', screen: '/purchase', priority: 14 },
      
      // Accounting
      { id: 'create-ledger', label: 'Create Account Ledger', keys: ['Alt', 'L'], description: 'Register a new accounts ledger group', module: 'Accounting', category: 'Accounting', screen: '/accounting', permission: 'LEDGER_CREATE', priority: 20 },
      { id: 'edit-ledger', label: 'Edit Selected Ledger', keys: ['F2'], description: 'Modify the highlighted account ledger configuration', module: 'Accounting', category: 'Accounting', screen: '/accounting', priority: 21 },

      // Inventory
      { id: 'create-stock', label: 'Create Stock Item', keys: ['Ctrl', 'N'], description: 'Register a new item stock inventory profile', module: 'Inventory', category: 'Inventory', screen: '/inventory', permission: 'ITEM_CREATE', priority: 30 },

      // Sales
      { id: 'sales-voucher', label: 'Create Sales Voucher', keys: ['F8'], description: 'Open draft invoice sales voucher creator', module: 'Sales', category: 'Sales', screen: '/sales', priority: 40 },

      // Purchase
      { id: 'purchase-voucher', label: 'Create Purchase Voucher', keys: ['F9'], description: 'Open new supplier purchase voucher intake', module: 'Purchase', category: 'Purchase', screen: '/purchase', priority: 50 },

      // Banking
      { id: 'bank-reconcile', label: 'Bank Reconciliation', keys: ['Alt', 'R'], description: 'Match statement entries with ledger books', module: 'Banking', category: 'Banking', screen: '/accounting', priority: 60 },

      // GST
      { id: 'gst-returns', label: 'GST Returns filing', keys: ['Alt', 'G'], description: 'Export tax returns and transactions report summaries', module: 'GST', category: 'GST', screen: '/reports', priority: 70 },

      // Reports
      { id: 'balance-sheet', label: 'View Balance Sheet', keys: ['Alt', 'B'], description: 'Generate active asset, liability and equity statement', module: 'Reports', category: 'Reports', screen: '/reports', priority: 80 },

      // Administration
      { id: 'user-roles', label: 'User Roles Configuration', keys: ['Ctrl', 'Shift', 'R'], description: 'Configure active authorization control parameters', module: 'Administration', category: 'Administration', screen: '/admin', priority: 90 },

      // Tables & Forms
      { id: 'save-form', label: 'Save / Submit Record', keys: ['Ctrl', 'S'], description: 'Commit changes and save active voucher form', module: 'Tables & Forms', category: 'Tables & Forms', priority: 100 },
      { id: 'delete-row', label: 'Delete Selected Row', keys: ['Delete'], description: 'Delete the currently active data table row', module: 'Tables & Forms', category: 'Tables & Forms', priority: 101 },
    ];
  }

  register(key, callback, description = '', module = 'Global', category = 'General', docOnly = false) {
    const cleanKey = key.toLowerCase().replace(/\s+/g, '');
    this.shortcuts.set(cleanKey, { callback, description, module, category, docOnly: docOnly || !callback });
  }

  unregister(key) {
    const cleanKey = key.toLowerCase().replace(/\s+/g, '');
    this.shortcuts.delete(cleanKey);
  }

  get(key) {
    const cleanKey = key.toLowerCase().replace(/\s+/g, '');
    return this.shortcuts.get(cleanKey);
  }

  getAll() {
    return this.registryList;
  }

  clear() {
    this.shortcuts.clear();
  }
}

export const shortcutRegistry = new ShortcutRegistry();
