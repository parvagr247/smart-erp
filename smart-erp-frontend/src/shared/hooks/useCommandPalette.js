import { useState, useEffect, useMemo } from 'react';
import { inventoryService } from '@modules/inventory/inventory.service';
import { useKeyboard } from '@shared/keyboard/KeyboardContext';

const SEARCHABLE_ITEMS = [
  { id: 'dash', category: 'Modules', title: 'Dashboard', path: '/dashboard', subtitle: 'View stats and quick overview' },
  { id: 'acct', category: 'Modules', title: 'Accounting', path: '/accounting/ledgers', subtitle: 'Ledgers, groups and journals' },
  { id: 'inv', category: 'Modules', title: 'Inventory', path: '/inventory/stock-items', subtitle: 'Stock balance and items' },
  { id: 'sales', category: 'Modules', title: 'Sales', path: '/sales', subtitle: 'Tax invoices and sales journals' },
  { id: 'pur', category: 'Modules', title: 'Purchase', path: '/purchase', subtitle: 'Vendor bills and vouchers' },
  { id: 'reports', category: 'Modules', title: 'Reports & Statements', path: '/reports', subtitle: 'Financial reports, trial balance, GST summaries' },
  
  { id: 'ledg_page', category: 'Pages', title: 'Ledger Registry', path: '/accounting/ledgers', subtitle: 'Create and manage ledger accounts' },
  { id: 'group_page', category: 'Pages', title: 'Chart of Accounts', path: '/accounting/groups', subtitle: 'Configure account classifications and hierarchy' },
  { id: 'cust_page', category: 'Pages', title: 'Business Partners', path: '/inventory/partners', subtitle: 'Manage customers and suppliers registry' },
  { id: 'sg_page', category: 'Pages', title: 'Stock Classifications', path: '/inventory/stock-groups', subtitle: 'Configure stock groups hierarchy' },
  { id: 'si_page', category: 'Pages', title: 'Stock Catalog', path: '/inventory/stock-items', subtitle: 'Configure stock items' },
  
  { id: 'act_ledger', category: 'Actions', title: 'Create Ledger', path: '/accounting/ledgers/create', subtitle: 'Quick add accounting ledger' },
  { id: 'act_invoice', category: 'Actions', title: 'Create Sales Invoice', path: '/sales', subtitle: 'Billing voucher creation' },
  { id: 'act_stock', category: 'Actions', title: 'Add Stock Item', path: '/inventory/stock-items/create', subtitle: 'Quick catalog stock additions' },
  
  { id: 'admin_dash', category: 'Administration', title: 'Admin Dashboard', path: '/admin/dashboard', subtitle: 'System administration stats' },
  { id: 'admin_users', category: 'Administration', title: 'Users Configuration', path: '/admin/users', subtitle: 'Manage system users and access' },
  { id: 'admin_audit', category: 'Administration', title: 'Audit logs', path: '/admin/audit-logs', subtitle: 'View system audit trails' },
];

export default function useCommandPalette(onNavigate) {
  const { isCommandPaletteOpen: isOpen, setIsCommandPaletteOpen: setIsOpen } = useKeyboard();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [dynamicHits, setDynamicHits] = useState([]);

  // Debounced backend query trigger
  useEffect(() => {
    if (!query.trim()) {
      setDynamicHits([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await inventoryService.searchGlobal(query.trim());
        if (res.success && res.data && res.data.hits) {
          const formatted = res.data.hits.map(hit => ({
            id: hit.id,
            category: 'Database Records',
            title: hit.title,
            path: hit.path,
            subtitle: hit.subtitle
          }));
          setDynamicHits(formatted);
        }
      } catch (e) {
        console.error("Global search fetch error", e);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const filteredItems = useMemo(() => {
    const cleanQuery = query.toLowerCase();
    const staticFiltered = SEARCHABLE_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(cleanQuery) ||
        item.category.toLowerCase().includes(cleanQuery) ||
        item.subtitle.toLowerCase().includes(cleanQuery)
    );
    return [...staticFiltered, ...dynamicHits];
  }, [query, dynamicHits]);

  // Reset selected index when search query updates
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelect = (item) => {
    setIsOpen(false);
    setQuery('');
    if (onNavigate) {
      onNavigate(item.path);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[activeIndex]) {
        handleSelect(filteredItems[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    activeIndex,
    filteredItems,
    handleSelect,
    handleKeyDown,
  };
}
