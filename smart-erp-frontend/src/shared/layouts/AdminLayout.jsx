import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import CommandPalette from './CommandPalette';
import Breadcrumbs from '@shared/components/Breadcrumbs';
import useSidebar from '@shared/hooks/useSidebar';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { useInteraction } from '@shared/interaction/InteractionContext';
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, Users, 
  Key, ShieldAlert, FileText, Settings, ArrowLeft 
} from 'lucide-react';
import '@shared/styles/Layout.css';

const ADMIN_MENU_ITEMS = [
  { title: 'Admin Home', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Users Configuration', path: '/admin/users', icon: <Users size={18} /> },
  { title: 'Roles Masters', path: '/admin/roles', icon: <Key size={18} /> },
  { title: 'Permissions Map', path: '/admin/permissions', icon: <ShieldAlert size={18} /> },
  { title: 'System Audit Logs', path: '/admin/audit-logs', icon: <FileText size={18} /> },
  { title: 'System Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  { title: 'Return to App', path: '/dashboard', icon: <ArrowLeft size={18} />, isBackLink: true }
];

export default function AdminLayout() {
  const { collapsed, toggleSidebar } = useSidebar();
  const { activeCompany } = useActiveCompany();
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useInteraction();
  const navigate = useNavigate();

  return (
    <div className="layout-wrapper">
      {/* Admin Sidebar Navigation */}
      <aside className={`sidebar-panel border-purple-500/10 ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <div className="sidebar-header">
          {!collapsed && <span className="sidebar-title text-purple-600 font-heading">Admin Portal</span>}
          <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg border border-[var(--border-light)] hover:bg-[var(--bg-input)] cursor-pointer text-[var(--text-secondary)]"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="sidebar-menu-list">
          {ADMIN_MENU_ITEMS.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-link ${item.isBackLink ? 'mt-8 border-t border-[var(--border-light)] pt-4' : ''} ${
                  isActive && !item.isBackLink ? 'bg-purple-500/10 text-purple-600' : ''
                }`
              }
              title={item.title}
            >
              <span className="sidebar-link-icon text-[var(--text-muted)]">{item.icon}</span>
              {!collapsed && <span className="sidebar-link-text">{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Panel Content */}
      <div className="layout-main">
        {/* Top Navbar */}
        <TopNavbar onSearchClick={() => setIsCommandPaletteOpen(true)} />

        {/* Content View Body */}
        <main className="layout-content-scroll bg-[var(--bg-base)]">
          <div className="space-y-4 mb-4">
            <Breadcrumbs />
          </div>
          <Outlet key={activeCompany?.id || 'no-active-company'} />
        </main>

        {/* Footer */}
        <footer className="layout-footer">
          &copy; {new Date().getFullYear()} SmartERP Admin Portal. SECURED ENV.
        </footer>
      </div>

      {/* Command palette search dialog */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(path) => navigate(path)}
      />
    </div>
  );
}
