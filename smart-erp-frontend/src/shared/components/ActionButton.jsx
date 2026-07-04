import React from 'react';
import { Button } from '@shared/components/ui/button';
import { useActionButtonData } from './services/ActionButtonService';
import './styles/ActionButton.css';

export default function ActionButton(props) {
  const { label, onClick, icon, disabled = false, className = '', type = 'button' } = props;
  const { btnClass, innerVariant } = useActionButtonData(props);

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={innerVariant}
      type={type}
      className={`action-button-base ${btnClass} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </Button>
  );
}
