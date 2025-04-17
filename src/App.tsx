import { Routes, Route } from 'react-router-dom'
import Navbar from './components/NavbarComponent.tsx'
import Home from './pages/Home'
//import Refill from './pages/Refill'
import Machines from './pages/Machines.tsx'
import SelectedMachineView from './components/MachineDashboard/SelectedMachineViewComponent.tsx'
import Products from './pages/Products.tsx'
import Statistics from './pages/Statistics.tsx'

function App() {
//            <Route path="/refill" element={<Refill />} />

  return (
    <div style={{ padding: '2rem' }}>
      <>
        <Navbar />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/machines/:id" element={<SelectedMachineView />} />
            <Route path="/products" element={<Products />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </main>
      </>

    </div>
  );
}

export default App;
