import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App';
import { BrowserRouter, Route, Routes } from 'react-router'
import { StrictMode } from 'react'
import { Home } from './components/Home';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/signin' element={<Home type="signin" />} />
        <Route path='/login' element={<Home type="login" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
