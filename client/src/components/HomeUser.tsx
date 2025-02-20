import { useContext, useEffect, useRef, useState } from 'react'
import { fetchingUser, fetchingMarkmap } from '../service/fetch.service'
import { UserInterface } from '../types/user.interface';
import { MkmType } from '../types/markmap.interface';
import { TabContext } from '../context/Tab.context';
import { NavBar } from './Navbar';
import { Markmaps } from './Markmaps';
import { Configuration } from './Configuration';

export function HomeUser({ token }: { token: string }) {
  const [info, setInfo] = useState<Pick<UserInterface, 'created_at' | 'username' | 'id' > | null>(null);
  const [mkm, setMkm] = useState<MkmType[] | null>(null);
  const loadedMkm = useRef<MkmType[] | null>(sessionStorage.getItem('loadedMkm') ? 
  (JSON.parse(sessionStorage.getItem('loadedMkm') as string).statusCode ? [] : JSON.parse(sessionStorage.getItem('loadedMkm') as string)) 
  : null);
  const loadedInfo = useRef<Pick<UserInterface, 'created_at' | 'username' | 'id' > | null>(sessionStorage.getItem('loadedInfo') ? JSON.parse(sessionStorage.getItem('loadedInfo') as string) : null)
  const ctx = useContext(TabContext);

  if (!ctx) {
    throw new Error('Context not provided')
  }

  const { tab } = ctx;

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
  }, [tab, token])
  return (
    <>
      {
        info && 
          <>
            <NavBar username={info.username} />
            {
              tab === 'mkm' ?
              <Markmaps markmaps={mkm}/> :
              <Configuration />
            }
          </>
      }
    </>
  )
}