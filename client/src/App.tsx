import './App.css'
import { Home } from './components/Home';
import { HomeUser } from './components/HomeUser';
import { getCookie } from './service/cookie.service'

export function App() {
  const bearer = getCookie('bearer');
  return (
    !bearer ? 
      <Home />
    :
      <HomeUser token={ bearer } />
  )
}

export default App
