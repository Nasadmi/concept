import { Link } from 'react-router';
import { TabContext } from '../context/Tab.context';
import { useContext } from 'react';
import '../styles/Navbar.css';
import { ThemeSelector } from './Theme';
import { HiLogout } from 'react-icons/hi';
import { alert } from '../service/alert.service'
import { removeCookie } from '../service/cookie.service';

export function NavBar({ username }: { username: string }) {
  const ctx = useContext(TabContext)

  if (!ctx) {
    throw new Error('Context not provided');
  }

  const { setTab } = ctx;

  const handleLogout = () => {
    alert.fire({
      title: 'Log Out',
      icon: 'warning',
      text: 'Are you sure to log out?',
      background: 'var(--bg)',
      color: 'var(--text)',
      showConfirmButton: true,
      confirmButtonText: 'Sure',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(result => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('foundedMkm');
        sessionStorage.removeItem('loadedInfo');
        sessionStorage.removeItem('loadedMkm');
        removeCookie('bearer');
        window.location.replace('/login');
      }
    })
  }

  return (
    <nav className='navbar-main'>
      <h1 className='username maven_pro'>{ username }</h1>
      <ul className='menu'>
        <Link to="/search" className='maven_pro'>Explore</Link>
        <button className='btn-tab maven_pro' onClick={() => setTab('mkm')}>My Markmaps</button>
        <button className='btn-tab maven_pro' onClick={() => setTab('config')}>Configuration</button>
        <ThemeSelector />
        <button className='btn-logout maven_pro' onClick={handleLogout}>
          <HiLogout />
        </button>
        
      </ul>
    </nav>
  )
}