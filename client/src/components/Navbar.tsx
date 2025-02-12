import { Link } from 'react-router';
import { TabContext } from '../context/Tab.context';
import { useContext } from 'react';
import '../styles/Navbar.css';
import { ThemeSelector } from './Theme';

export function NavBar({ username }: { username: string }) {
  const ctx = useContext(TabContext)

  if (!ctx) {
    throw new Error('Context not provided');
  }

  const { setTab } = ctx;

  return (
    <nav className='navbar-main'>
      <h1 className='username maven_pro'>{ username }</h1>
      <ul className='menu'>
        <Link to="/search" className='maven_pro'>Explore</Link>
        <button className='btn-tab maven_pro' onClick={() => setTab('mkm')}>My Markmaps</button>
        <button className='btn-tab maven_pro' onClick={() => setTab('config')}>Configuration</button>
        <ThemeSelector />
      </ul>
    </nav>
  )
}