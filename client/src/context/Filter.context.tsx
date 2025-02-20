import { createContext, Dispatch, SetStateAction } from 'react';

export type StarsType = 'asc-stars' | 'desc-stars';

export type DateType = 'asc-date' | 'desc-date';

interface FilterContextType {
  stars: number;
  setStars: Dispatch<SetStateAction<number>>;
  date: DateType;
  setDate: Dispatch<SetStateAction<DateType>>;
  all: boolean;
  setAll: Dispatch<SetStateAction<boolean>>;
}

export const FilterContext = createContext<FilterContextType | null>(null);