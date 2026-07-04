import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import CommandPalette from './CommandPalette';
import Breadcrumbs from '@shared/components/Breadcrumbs';
import useSidebar from '@shared/hooks/useSidebar';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import { useInteraction } from '@shared/interaction/InteractionContext';
import '@shared/styles/Layout.css';

export default function AppLayout() {
  const { collapsed, toggleSidebar, openSubmenus, toggleSubmenu } = useSidebar();
  const { activeCompany } = useActiveCompany();
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useInteraction();
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
          &copy; {new Date().getFullYear()} SmartERP. All rights reserved. Powered by Antigravity AI.
        </footer>
      </div>

      {/* Global search command modal palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(path) => navigate(path)}
      />
    </div>
  );
}
