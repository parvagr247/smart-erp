import { useState, useEffect } from 'react';

export default function useSidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const [openSubmenus, setOpenSubmenus] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar-submenus');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const newVal = !prev;
      localStorage.setItem('sidebar-collapsed', String(newVal));
      return newVal;
    });
  };

  const toggleSubmenu = (menuId) => {
    setOpenSubmenus((prev) => {
      const newVal = { ...prev, [menuId]: !prev[menuId] };
      localStorage.setItem('sidebar-submenus', JSON.stringify(newVal));
      return newVal;
    });
  };

  return {
    collapsed,
    toggleSidebar,
    openSubmenus,
    toggleSubmenu,
  };
}
