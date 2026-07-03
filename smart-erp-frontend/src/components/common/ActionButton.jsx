import React from 'react';
import { Button } from '@/components/ui/button';

export default function ActionButton({ label, onClick, icon, variant = 'default', disabled = false, className = '' }) {
  let btnClass = 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer';

  if (variant === 'outline') {
    btnClass = 'border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer';
  } else if (variant === 'destructive') {
    btnClass = 'bg-red-600 hover:bg-red-700 text-white cursor-pointer';
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`${btnClass} flex items-center gap-1.5 font-semibold text-xs py-2 px-3 h-auto ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </Button>
  );
}
