import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useBreadcrumbsData } from './services/BreadcrumbsService';
import './styles/Breadcrumbs.css';

export default function Breadcrumbs() {
  const { show, breadcrumbs } = useBreadcrumbsData();

  if (!show) return null;

  return (
    <nav className="breadcrumbs-container font-heading" aria-label="breadcrumb">
      <Link to="/dashboard" className="breadcrumb-home">
        <Home size={12} />
        <span>Home</span>
      </Link>
      
      {breadcrumbs.map((crumb) => (
        <React.Fragment key={crumb.to}>
          <ChevronRight size={10} className="breadcrumb-separator" />
          {crumb.isLast ? (
            <span className="breadcrumb-active">
              {crumb.title}
            </span>
          ) : (
            <Link to={crumb.to} className="breadcrumb-item breadcrumb-link">
              {crumb.title}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
