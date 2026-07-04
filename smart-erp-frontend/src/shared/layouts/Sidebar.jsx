import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, 
  Landmark, Box, ShoppingBag, ShoppingCart, 
  BarChart3, ShieldCheck, Settings, ChevronDown, ChevronUp 
} from 'lucide-react';

const getSidebarItems = (role) => {
  const items = [
    { id: 'dash', title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  ];

  // Accounting group (Admin or Accountant)
  if (role === 'ADMIN' || role === 'ACCOUNTANT') {
    items.push({
      id: 'accounting',
      title: 'Accounting',
      icon: <Landmark size={18} />,
      children: [
        { title: 'Dashboard', path: '/accounting' },
        { title: 'Groups Tree', path: '/accounting/groups' },
        { title: 'Ledgers Registry', path: '/accounting/ledgers' }
      ]
    });
  }

  // Inventory group (Admin or Inventory Manager)
  if (role === 'ADMIN' || role === 'INVENTORY_MANAGER') {
    items.push({
      id: 'inventory',
      title: 'Inventory',
      icon: <Box size={18} />,
      children: [
        { title: 'Dashboard', path: '/inventory' },
        { title: 'Stock Groups', path: '/inventory/stock-groups' },
        { title: 'Stock Items', path: '/inventory/stock-items' },
        { title: 'Business Partners', path: '/inventory/partners' }
      ]
    });
    items.push({ id: 'sales', title: 'Sales', path: '/sales', icon: <ShoppingBag size={18} /> });
    items.push({ id: 'purchase', title: 'Purchase', path: '/purchase', icon: <ShoppingCart size={18} /> });
  }

  items.push({ id: 'reports', title: 'Reports', path: '/reports', icon: <BarChart3 size={18} /> });

  if (role === 'ADMIN') {
    items.push({ id: 'admin', title: 'Administration', path: '/admin/dashboard', icon: <ShieldCheck size={18} /> });
  }

  items.push({ id: 'settings', title: 'Settings', path: '/settings', icon: <Settings size={18} /> });

  return items;
};

export default function Sidebar({ collapsed, onToggle, openSubmenus, onToggleSubmenu }) {
  const { user } = useAuth();
  const menuItems = getSidebarItems(user?.role);

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
        {menuItems.map((item) => {
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
