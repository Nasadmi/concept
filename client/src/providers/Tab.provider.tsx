import { type ReactNode, useState } from 'react';
import { TabContext } from '../context/Tab.context';

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [tab, setTab] = useState<'mkm' | 'config' | 'starred'>('mkm');
  return (
    <TabContext.Provider value={{ tab, setTab }}>
      { children }
    </TabContext.Provider>
  )
}