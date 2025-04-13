import { Routes, Route } from 'react-router-dom'
import Navbar from './components/NavbarComponent.tsx'
import Home from './pages/Home'
import Refill from './pages/Refill'
import Inventory from './pages/Inventory'
import Pricing from './pages/Pricing'
import Stats from './pages/Stats'

function App() {

  return (
    <div style={{ padding: '2rem' }}>
      <>
        <Navbar />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/refill" element={<Refill />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>
      </>

    </div>
  );
}

export default App;
