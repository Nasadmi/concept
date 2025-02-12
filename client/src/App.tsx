import './App.css'
import { Home } from './components/Home';
import { HomeUser } from './components/HomeUser';
import { TabProvider } from './providers/Tab.provider';
import { getCookie } from './service/cookie.service'

export function App() {
  const bearer = getCookie('bearer');
  return (
    !bearer ? 
      <Home />
    :
      <TabProvider>
        <HomeUser token={ bearer } />
      </TabProvider>
  )
}

export default App
