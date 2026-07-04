import React from 'react';
import { Button } from '@shared/components/ui/button';

export default function ActionButton({ label, onClick, icon, variant = 'default', disabled = false, className = '', type = 'button' }) {
  let btnClass = 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer';
  let innerVariant = 'default';

  if (variant === 'outline') {
    btnClass = 'border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer';
    innerVariant = 'outline';
  } else if (variant === 'destructive' || variant === 'danger') {
    btnClass = 'bg-red-600 hover:bg-red-700 text-white cursor-pointer';
    innerVariant = 'destructive';
  } else if (variant === 'secondary') {
    btnClass = 'bg-[var(--bg-input)] text-[var(--text-primary)] hover:bg-[var(--border-light)] cursor-pointer border border-[var(--border-light)]';
    innerVariant = 'secondary';
  } else if (variant === 'primary') {
    btnClass = 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer';
    innerVariant = 'default';
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={innerVariant}
      type={type}
      className={`${btnClass} flex items-center gap-1.5 font-semibold text-xs py-2 px-3 h-auto ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </Button>
  );
}
