import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import '../../styles/CommonComponents.css';

// Map path tokens to user-friendly titles
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

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumbs-container font-heading" aria-label="breadcrumb">
      <Link to="/dashboard" className="breadcrumb-item flex items-center gap-1">
        <Home size={12} />
        <span>Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const title = ROUTE_MAP[value] || value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <React.Fragment key={to}>
            <ChevronRight size={10} className="breadcrumb-separator" />
            {isLast ? (
              <span className="text-[var(--text-primary)] font-bold truncate max-w-[120px] sm:max-w-none">
                {title}
              </span>
            ) : (
              <Link to={to} className="breadcrumb-item truncate max-w-[120px] sm:max-w-none">
                {title}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
