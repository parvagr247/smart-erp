import React from 'react';
import { useLoadingSkeletonData } from './services/LoadingSkeletonService';
import './styles/LoadingSkeleton.css';

export default function LoadingSkeleton(props) {
  const { variant = 'table' } = props;
  const { items } = useLoadingSkeletonData(props);

  if (variant === 'card') {
    return (
      <div className="skeleton-card-grid">
        {items.map((_, idx) => (
          <div key={idx} className="skeleton-card-box">
            <div className="skeleton-card-header">
              <div className="skeleton-circle" />
              <div className="skeleton-line h-6 w-2/3" />
            </div>
            <div className="skeleton-line" />
            <div className="skeleton-line w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-container">
      {items.map((_, idx) => (
        <div key={idx} className="skeleton-row">
          <div className="skeleton-line" />
          <div className="skeleton-line w-5/6" />
        </div>
      ))}
    </div>
  );
}
