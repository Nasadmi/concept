import { ChangeEvent, useContext, useState } from 'react';
import { DateType, FilterContext } from '../context/Filter.context';
import { HiStar, HiCalendar, HiFilter } from 'react-icons/hi';
import '../styles/Filter.css'

interface OStyles {
  initialPos: number; 
  finalPos: number; 
  top: number; 
  left: number;
  origin: 'left' | 'right'
}

export const Filter = ({ styles }: { styles: OStyles }) => {
  const ctx = useContext(FilterContext);

  if (!ctx) throw new Error('Filter context no provided');
  
  const [showFilter, setShowFilters] = useState(false)

  const { setDate, setStars, setAll } = ctx;

  const handleChangeStars = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setAll(true);
      setStars(0);
      return;
    }

    const value = parseInt(e.target.value)
    if (isNaN(value)) {
      return;
    }

    setStars(prevState => {
      if (prevState === value) {
        return prevState;
      } else {
        return value;
      }
      })
    setAll(false)
  }

  const handleChangeDate = (e: ChangeEvent<HTMLSelectElement>) => {
    setDate(e.target.value as DateType)
    setAll(false)
  }


  return (
    <div id='filter-main'>
      <button className='filter-btn maven_pro' onClick={() => setShowFilters(!showFilter)}>
        <HiFilter />
      </button>
      <section className='filter-data' style={{
        'transform': `${showFilter ? `translateY(${styles.finalPos}px)` : `translateY(${styles.initialPos}px)`}`,
        'top': `${styles.top}px`,
        'left': `${styles.left}px`,
        'transformOrigin': 'right'
      }}>
        <div>
          <label htmlFor="stars"><HiStar /></label>
          <input type="text" name="stars" id="stars" onChange={handleChangeStars} className='ubuntu' autoComplete='off' />
        </div>
        <div>
        <label htmlFor="date" ><HiCalendar /></label>
          <select id="date" onChange={handleChangeDate} className='ubuntu'>
            <option value="asc-date">Latest</option>
            <option value="desc-date">Oldest</option>
          </select>
        </div>
        <button className="show-all ubuntu" onClick={() => setAll(true)}>Show All</button>
     </section>
    </div>
    
  )
}