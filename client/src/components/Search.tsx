import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { QMkmType } from '../types/markmap.interface'
import { fetchingMarkmap } from '../service/fetch.service'
import { getCookie } from '../service/cookie.service'
import { useContext } from 'react'
import { FilterContext } from '../context/Filter.context'
import { Filter } from './Filter'
import { Markmaps } from './Markmaps'
import { HiSearch, HiHome } from 'react-icons/hi'
import { NotFoundMarkmap } from './NotFoundMarkmap'
import '../styles/Search.css'
import { TbReload } from 'react-icons/tb'
import { ThemeSelector } from './Theme'
import { Link } from 'react-router'

export const Search = () => {
  const bearer = useRef(getCookie('bearer'));
  const ctx = useContext(FilterContext);

  if (!ctx) throw new Error('Filter context provided');

  const { stars, date, all } = ctx;

  const [founded, setFounded] = useState<QMkmType[] | null | undefined>(sessionStorage.getItem('foundedMkm') ? 
  (JSON.parse(sessionStorage.getItem('foundedMkm') as string) === null ? [] : JSON.parse(sessionStorage.getItem('foundedMkm') as string)) 
  : null)

  const [query, updateQuery] = useState<{ [k: string]: FormDataEntryValue | null; } | null>(null)

  useEffect(() => {
    if(!bearer.current) {
      window.location.replace('/')
    }
  }, [bearer])


  useEffect(() => {
    if (founded === undefined) {
      return;
    }

    if (!founded || founded.length === 0) {
      fetchingMarkmap({
        url: `query?order_stars=ASC&order_date=${date.split('-')[0].toUpperCase()}`,
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        setFounded(data);
        sessionStorage.setItem('foundedMkm', JSON.stringify(data));
      })
    }
  }, [founded, stars, date])

  useEffect(() => {
    if (query) {
      fetchingMarkmap({
        url: `query?order_stars=ASC&order_date=${date.split('-')[0].toUpperCase()}${query.name && `&name=${query.name}` || ''}${query.username && `&username=${query.username}` || ''}`,
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        if (data.statusCode === 404) {
          setFounded(undefined);
          return;
        }

        setFounded(data);
        sessionStorage.setItem('foundedMkm', JSON.stringify(data));
      })
    }
  }, [query])

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target))
    updateQuery((prevQuery) => {
      if (prevQuery === null) {
        return {
          name: data.name === '' ? null : data.name,
          username: data.username === '' ? null : data.username,
        }
      }

      if (prevQuery.name === data.name && prevQuery.username === data.username) {
        return null;
      } else {
        return {
          name: prevQuery.name !== data.name ? data.name : prevQuery.name,
          username: prevQuery.username !== data.username ? data.username : prevQuery.username,
        };
      }
    });
  }

  const handleReset = () => {
    sessionStorage.removeItem('foundedMkm');
    setFounded(null);
  }

  return (
    <main className='search-main'>
      <div className="utils">
        <ThemeSelector styles={{
          height: '30px'
        }} />
        <button className='btn-util' onClick={handleReset}>
          <TbReload />
        </button>
        <Link to={'/'} className='btn-util'>
          <HiHome />
        </Link>
      </div>
      <form onSubmit={handleSubmit} className='searcher'>
          <div className='data'>
            <label htmlFor="name" className='maven_pro'>Name</label>
            <input type="text" name="name" id="name" autoComplete='off' spellCheck='false' className='ubuntu'/>
            <label htmlFor="username" className='maven_pro'>Username</label>
            <input type="text" name="username" id="username" autoComplete='off' spellCheck='false' className='ubuntu'/>
          </div>
          <div className='submit'>
            <button type="submit" className='btn-util'>
              <HiSearch />
            </button>
            <Filter styles={{
              initialPos: -900,
              finalPos: 5,
              top: 90,
              left: -380,
              origin: 'right'
            }}/>
          </div>
        </form>
      {
        founded === undefined ?
          <NotFoundMarkmap />
          :
          <div id="container-search">
            <Markmaps query={true} markmaps={founded && (all ? founded : [...founded].filter(mkm => (Number(mkm.stars) >= stars)).sort((a,b) => (
            date === 'asc-date' ?
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
             :
             new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            )))} />
          </div>
      }
    </main>
  )
}