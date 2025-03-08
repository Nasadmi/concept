import { createContext } from 'react';

interface TabContextType {
  tab: 'mkm' | 'config' | 'starred',
  setTab: (tab: 'mkm' | 'config' | 'starred') => void
}

export const TabContext = createContext<TabContextType | null>(null);