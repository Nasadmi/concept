import { type ReactNode, useState } from 'react';

import { FilterContext, DateType } from '../context/Filter.context';

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [stars, setStars] = useState<number>(0);
  const [date, setDate] = useState<DateType>('desc-date');
  const [all, setAll] = useState<boolean>(true);
  return (
    <FilterContext.Provider value={{ stars, setStars, date, setDate, all, setAll }}>
      { children }
    </FilterContext.Provider>
  )
}