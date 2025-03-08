import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App';
import { BrowserRouter, Route, Routes } from 'react-router'
import { StrictMode } from 'react'
import { Home } from './components/Home';
import { Search } from './components/Search';
import { FilterProvider } from './providers/Filter.provider';
import { Editor } from './components/Editor';
import { EditorHelp } from './components/EditorHelp';
import { Viewer } from './components/Viewer';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/signin' element={<Home type="signin" />} />
        <Route path='/login' element={<Home type="login" />} />
        <Route path='/search' element={
          <FilterProvider>
            <Search />
          </FilterProvider>
        }/>
        <Route path='/edit/:id' element={<Editor />}/>
        <Route path='/help' element={<EditorHelp />}/>
        <Route path='/view/:id' element={<Viewer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
