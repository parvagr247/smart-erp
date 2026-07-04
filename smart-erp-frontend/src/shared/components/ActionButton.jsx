import React from 'react';
import { Button } from '@shared/components/ui/button';
import { useActionButtonData } from './services/ActionButtonService';
import { useInteraction } from '@shared/interaction/InteractionContext';
import './styles/ActionButton.css';

export default function ActionButton(props) {
  const { label, onClick, icon, disabled = false, className = '', type = 'button', shortcut } = props;
  const { btnClass, innerVariant } = useActionButtonData(props);
  const { settings } = useInteraction();

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
      {shortcut && settings.showKeyboardShortcuts && settings.keyboardFirstMode && (
        <kbd className="ml-1.5 px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono text-[9px] uppercase tracking-wider font-bold select-none">
          {shortcut}
        </kbd>
      )}
    </Button>
  );
}
