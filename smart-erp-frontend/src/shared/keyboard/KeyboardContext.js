import { createContext, useContext } from 'react';

export const KeyboardContext = createContext(null);

export function useKeyboard() {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
}
