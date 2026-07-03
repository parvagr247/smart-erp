import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, Database, 
  Landmark, Box, ShoppingBag, ShoppingCart, FileSpreadsheet, 
  CreditCard, BarChart3, ShieldCheck, Settings, ChevronDown, ChevronUp 
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dash', title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  {
    id: 'masters',
    title: 'Masters',
    icon: <Database size={18} />,
    children: [
      { title: 'Ledgers', path: '/accounting/ledgers' },
      { title: 'Groups', path: '/accounting/groups' },
      { title: 'Business Partners', path: '/inventory/partners' }
    ]
  },
  {
    id: 'accounting',
    title: 'Accounting',
    icon: <Landmark size={18} />,
    children: [
      { title: 'Dashboard', path: '/accounting' },
      { title: 'Groups Tree', path: '/accounting/groups' },
      { title: 'Ledgers Registry', path: '/accounting/ledgers' }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory',
    icon: <Box size={18} />,
    children: [
      { title: 'Dashboard', path: '/inventory' },
      { title: 'Stock Groups', path: '/inventory/stock-groups' },
      { title: 'Stock Items', path: '/inventory/stock-items' }
    ]
  },
  { id: 'sales', title: 'Sales', path: '/sales', icon: <ShoppingBag size={18} /> },
  { id: 'purchase', title: 'Purchase', path: '/purchase', icon: <ShoppingCart size={18} /> },
  { id: 'gst', title: 'GST', path: '/gst', icon: <FileSpreadsheet size={18} /> },
  { id: 'banking', title: 'Banking', path: '/banking', icon: <CreditCard size={18} /> },
  { id: 'reports', title: 'Reports', path: '/reports', icon: <BarChart3 size={18} /> },
  { id: 'admin', title: 'Administration', path: '/admin/dashboard', icon: <ShieldCheck size={18} /> },
  { id: 'settings', title: 'Settings', path: '/settings', icon: <Settings size={18} /> }
];

export default function Sidebar({ collapsed, onToggle, openSubmenus, onToggleSubmenu }) {
  return (
    <aside className={`sidebar-panel ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-title font-heading">SmartERP</span>}
        <button 
          onClick={onToggle}
          className="p-1.5 rounded-lg border border-[var(--border-light)] hover:bg-[var(--bg-input)] cursor-pointer text-[var(--text-secondary)]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-menu-list">
        {MENU_ITEMS.map((item) => {
          if (item.children) {
            const isExpanded = openSubmenus[item.id] && !collapsed;
            return (
              <div key={item.id} className="space-y-1">
                <div
                  onClick={() => !collapsed && onToggleSubmenu(item.id)}
                  className="sidebar-link justify-between"
                  title={item.title}
                >
                  <div className="flex items-center gap-3">
                    <span className="sidebar-link-icon text-[var(--text-muted)]">{item.icon}</span>
                    {!collapsed && <span className="sidebar-link-text">{item.title}</span>}
                  </div>
                  {!collapsed && (isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
                {isExpanded && (
                  <div className="submenu-container">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => `submenu-link ${isActive ? 'submenu-link-active' : ''}`}
                      >
                        {child.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              title={item.title}
            >
              <span className="sidebar-link-icon text-[var(--text-muted)]">{item.icon}</span>
              {!collapsed && <span className="sidebar-link-text">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
