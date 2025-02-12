import { useEffect, useState, useRef } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';
import '../styles/Theme.css';

export const ThemeSelector = () => {
  const [theme, setTheme] = useState<string>('');
  const root = useRef(document.documentElement.classList);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (theme) {
      root.current.remove('dark', 'light');
      root.current.add(theme);
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const handleClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <button onClick={handleClick} id='theme-selector'>
      {theme === 'dark' ? <HiSun /> : <HiMoon />}
    </button>
  );
};