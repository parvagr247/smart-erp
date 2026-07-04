import { useLocation } from 'react-router-dom';

const ROUTE_MAP = {
  dashboard: 'Dashboard',
  masters: 'Masters',
  ledgers: 'Ledgers',
  groups: 'Groups',
  customers: 'Customers',
  suppliers: 'Suppliers',
  inventory: 'Inventory',
  'stock-groups': 'Stock Groups',
  'stock-items': 'Stock Items',
  accounting: 'Accounting',
  sales: 'Sales',
  purchase: 'Purchase',
  gst: 'GST',
  banking: 'Banking',
  reports: 'Reports',
  admin: 'Admin',
  'audit-logs': 'Audit Logs',
  users: 'Users',
  roles: 'Roles',
  permissions: 'Permissions',
  settings: 'Settings'
};

export function useBreadcrumbsData() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbs = () => {
    return pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      const title = ROUTE_MAP[value] || value.charAt(0).toUpperCase() + value.slice(1);
      return { to, isLast, title };
    });
  };

  return {
    show: pathnames.length > 0,
    breadcrumbs: getBreadcrumbs()
  };
}
