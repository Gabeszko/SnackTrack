import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Machines from "./pages/Machines.tsx";
import SelectedMachineView from "./components/MachineDashboard/SelectedMachineViewDashboard/SelectedMachineViewComponent.tsx";
import Products from "./pages/Products.tsx";
import Statistics from "./pages/Statistics.tsx";
import NavbarNew from "./components/NavbarComponent.tsx";

function App() {
  return (
    <>
      <NavbarNew />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/machines" element={<Machines />} />
          <Route path="/machines/:id" element={<SelectedMachineView />} />
          <Route path="/products" element={<Products />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
