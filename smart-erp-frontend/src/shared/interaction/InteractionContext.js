import { createContext, useContext } from 'react';

export const InteractionContext = createContext(null);

export function useInteraction() {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  return context;
}
