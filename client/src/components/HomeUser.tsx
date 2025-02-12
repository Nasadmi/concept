import { useContext, useEffect, useState } from 'react'
import { fetchingUser } from '../service/fetch.service'
import { UserInterface } from '../types/user.interface';
import { TabContext } from '../context/Tab.context';
import { NavBar } from './Navbar';

export function HomeUser({ token }: { token: string }) {
  const [info, setInfo] = useState<Pick<UserInterface, 'created_at' | 'username' | 'id' > | null>(null);
  const ctx = useContext(TabContext);

  if (!ctx) {
    throw new Error('Context not provided')
  }

  const { tab } = ctx;

  useEffect(() => {
    fetchingUser({
      url: `user/info`,
      bearer: token,
      method: 'GET'
    })
    .then((response) => response.json())
    .then((res) => {
      setInfo(res);
    })
  }, [token])
  return (
    <>
      {
        info && 
          <>
            <NavBar username={info.username} />
            <h2>Tab: { tab }</h2>
          </>
      }
    </>
  )
}