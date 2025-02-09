import { useEffect, useState } from 'react'
import { fetchingUser } from '../service/fetch.service'
import { UserInterface } from '../types/user.interface';

export function HomeUser({ token }: { token: string }) {
  const [info, setInfo] = useState<Pick<UserInterface, 'created_at' | 'username' | 'id'> | null>(null);
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
      <h1>Welcome: {info?.username}</h1>
    </>
  )
}