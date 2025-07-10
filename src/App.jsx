import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PowerSeatHome from './pages/PowerSeatTrainer';
import WiperWasherHome from './pages/WiperWasherTrainer';
import TrainerActionPage from './pages/TrainerActionPage';

import { Trainers } from './pages/Trainers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<h2 className="text-center text-red-500">Page Not Found</h2>} />

          {/* Trainers page */}
          <Route path='trainers' element={<Trainers />} />

          {/* Trainer Home Pages */}
          <Route path="power-seat" element={<PowerSeatHome />} />
          <Route path="wiper-washer" element={<WiperWasherHome />} />

          {/* Dynamic Route */}
          <Route path="trainer/:trainerId/:action" element={<TrainerActionPage />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;