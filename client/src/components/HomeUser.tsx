import { useContext, useEffect, useRef, useState } from 'react'
import { fetchingUser, fetchingMarkmap } from '../service/fetch.service'
import { UserInterface } from '../types/user.interface';
import { CMkmFunc, MkmType, QMkmType } from '../types/markmap.interface';
import { TabContext } from '../context/Tab.context';
import { NavBar } from './Navbar';
import { Markmaps } from './Markmaps';
import { Configuration } from './Configuration';
import { FilterContext } from '../context/Filter.context';
import { Filter } from './Filter';
import '../styles/HomeUser.css';

export function HomeUser({ token }: { token: string }) {
  const [info, setInfo] = useState<Pick<UserInterface, 'created_at' | 'username' | 'id' > | null>(null);
  const [mkm, setMkm] = useState<MkmType[] | null>(null);
  const [fav, setFav] = useState<QMkmType[] | null>(null);
  const loadedMkm = useRef<MkmType[] | null>(sessionStorage.getItem('loadedMkm') ? 
  (JSON.parse(sessionStorage.getItem('loadedMkm') as string).statusCode ? [] : JSON.parse(sessionStorage.getItem('loadedMkm') as string)) 
  : null);
  const loadedInfo = useRef<Pick<UserInterface, 'created_at' | 'username' | 'id' > | null>(sessionStorage.getItem('loadedInfo') ? JSON.parse(sessionStorage.getItem('loadedInfo') as string) : null)
  const loadedFav = useRef<QMkmType[] | null>(sessionStorage.getItem('loadedFav') ? 
  (JSON.parse(sessionStorage.getItem('loadedFav') as string).statusCode ? [] : JSON.parse(sessionStorage.getItem('loadedFav') as string)) 
  : null);

  const tabctx = useContext(TabContext);
  const filterctx = useContext(FilterContext);

  if (!tabctx || !filterctx) {
    throw new Error('Context not provided')
  }

  const { tab } = tabctx;
  const { date, stars } = filterctx

  const handleCMkm: CMkmFunc = (data) => {
    fetchingMarkmap({
      url: '',
      method: 'POST',
      bearer: token,
      data: { name: data.name, public: data.checkPublic ? 1 : 0, code: '_' },
    }).then((response) => response.json())
    .then((res) => {
      if (res.statusCode) {
        console.log(res);
        return;
      }

      if (!mkm) return;

      const newMkm = [...mkm, res];

      const sesMkm = JSON.stringify(newMkm);

      setMkm(newMkm);

      sessionStorage.setItem('loadedMkm', sesMkm)
    })
  }

  const handleDMkm = (id: string) => {
    fetchingMarkmap({
      url: `${id}`,
      method: 'DELETE',
      bearer: token,
    }).then((response) => response.clone().json())
    .then((res) => {
      if (res.statusCode === 500) {
        return;
      }

      if(!mkm) return;

      const newMkm = [...mkm].filter((i) => i.id !== id);

      const sesMkm = JSON.stringify(newMkm);

      setMkm(newMkm);
      sessionStorage.setItem('loadedMkm', sesMkm)
    })
  }

  useEffect(() => {
    if (loadedInfo.current) {
      setInfo(loadedInfo.current);
    } else {
      fetchingUser({
        url: `user/info`,
        bearer: token,
        method: 'GET'
      })
      .then((response) => response.json())
      .then((res) => {
        setInfo(res);
        sessionStorage.setItem('loadedInfo', JSON.stringify(res));
      })
    }
  }, [token])

  useEffect(() => {
    document.title = 'Concept'
    if (tab === 'mkm' && loadedMkm.current) {
      setMkm(loadedMkm.current);
    }

    if (tab === 'mkm' && !loadedMkm.current) {
      fetchingMarkmap({
        url: 'user',
        bearer: token,
        method: 'GET'
      })
      .then((response) => response.json())
      .then((res) => {
        if (res.statusCode === 404) {
          setMkm(null);
        }
        setMkm(res);
        sessionStorage.setItem('loadedMkm', JSON.stringify(res));
      })
      .catch(err => {
        console.error(err);
      })
    }

    if (tab === 'starred' && loadedFav.current) {
      setFav(loadedFav.current)
    }

    if (!loadedFav.current) {
      fetchingMarkmap({
        url: 'fav',
        bearer: token,
        method: 'GET'
      })
      .then((response) => response.json())
      .then((res) => {
        if (res.statusCode === 404) {
          setFav(null);
        }
        setFav(res);
        sessionStorage.setItem('loadedFav', JSON.stringify(res));
      })
      .catch(err => {
        console.error(err);
      })
    }
  }, [tab, token])
  return (
    <>
      {
        info && 
          <>
            <NavBar username={info.username} />
            {
              tab === 'config' ?
                <Configuration />
              :
              <>
                <div id="container-home-user">
                  <Filter styles={{
                    initialPos: -200,
                    finalPos: 0,
                    top: -10,
                    left: 50,
                    origin: 'left'
                  }} />
                </div>
                {
                  tab === 'mkm' ?
                  <Markmaps markmaps={mkm && (
                    [...mkm]
                      .filter(m => Number(m.stars) >= stars)
                      .sort((a, b) => (
                        date === 'asc-date' ?
                          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                          :
                          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                      ))
                  )} cmkm={handleCMkm} dmkm={handleDMkm} bearer={token}/>
                  :
                  <Markmaps markmaps={fav && (
                    [...fav]
                      .filter(m => Number(m.stars) >= stars)
                      .sort((a, b) => (
                        date === 'asc-date' ?
                          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                          :
                          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                      ))
                  )} query/>
                }
              </>
            }
          </>
      }
    </>
  )
}