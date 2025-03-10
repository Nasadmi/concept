import './App.css'
import { Home } from './components/Home';
import { HomeUser } from './components/HomeUser';
import { TabProvider } from './providers/Tab.provider';
import { getCookie } from './service/cookie.service'
import { FilterProvider } from './providers/Filter.provider';

export function App() {
  const bearer = getCookie('bearer');
  return (
    !bearer ? 
      <Home />
    :
      <TabProvider>
        <FilterProvider>
          <HomeUser token={ bearer } />
        </FilterProvider>
      </TabProvider>
  )
}

export default App
