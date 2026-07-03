import React from 'react';
import '@shared/styles/CommonComponents.css';

export default function LoadingSkeleton({ rows = 3, variant = 'table' }) {
  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-6 bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
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
    <div className="w-full space-y-4 mt-4">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex gap-4 items-center">
          <div className="skeleton-line" />
          <div className="skeleton-line w-5/6" />
        </div>
      ))}
    </div>
  );
}
