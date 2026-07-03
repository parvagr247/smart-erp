import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import CommandPalette from './CommandPalette';
import Breadcrumbs from '../common/Breadcrumbs';
import useSidebar from '../../hooks/useSidebar';
import '../../styles/Layout.css';

export default function AppLayout() {
  const { collapsed, toggleSidebar, openSubmenus, toggleSubmenu } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="layout-wrapper">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
        openSubmenus={openSubmenus}
        onToggleSubmenu={toggleSubmenu}
      />

      {/* Main Panel Content */}
      <div className="layout-main">
        {/* Top Navbar */}
        <TopNavbar onSearchClick={() => setIsSearchOpen(true)} />

        {/* Content View Body */}
        <main className="layout-content-scroll bg-[var(--bg-base)]">
          <div className="space-y-4 mb-4">
            <Breadcrumbs />
          </div>
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="layout-footer">
          &copy; {new Date().getFullYear()} SmartERP. All rights reserved. Powered by Antigravity AI.
        </footer>
      </div>

      {/* Global search command modal palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(path) => navigate(path)}
      />
    </div>
  );
}
