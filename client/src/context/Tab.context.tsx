import { createContext } from 'react';

interface TabContextType {
  tab: 'mkm' | 'config',
  setTab: (tab: 'mkm' | 'config') => void
}

export const TabContext = createContext<TabContextType | null>(null);