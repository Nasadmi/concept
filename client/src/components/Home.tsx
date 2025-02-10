import { useRef } from 'react'
import { getCookie } from '../service/cookie.service'
import { Register } from './Register';
import { Login } from './Login';
import '../styles/Home.css'

export function Home({ type }: { type?: 'signin' | 'login' }) {
  const visit = useRef(getCookie('first_visit'));
  return (
    <main className='home-main'>
      {
        typeof type !== 'undefined' ? 
        type === 'signin' ? <Register /> : <Login />
        :  !visit.current ? <Register /> : <Login />
      }
    </main>
  )
}