import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PowerSeatHome from './pages/PowerSeatTrainer';
import WiperWasherHome from './pages/WiperWasherTrainer';
import {ReadDataTrainerPS, ReadDataTrainerWW} from './pages/ReadData';
import {ReadCodesTrainerPS, ReadCodesTrainerWW} from './pages/ReadCodes';
import { ClearCodesTrainerPS, ClearCodesTrainerWW } from './pages/ClearCodes';
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

          {/* Nested routes for Power Seat Trainer */}
          <Route path="data/PS" element={<ReadDataTrainerPS />} />
          <Route path="dtc/PS" element={<ReadCodesTrainerPS />} />
          <Route path="clear/PS" element={<ClearCodesTrainerPS />} />

          {/* Nested routes for Wiper Washer Trainer */}
          <Route path="data/WW" element={<ReadDataTrainerWW />} />
          <Route path="dtc/WW" element={<ReadCodesTrainerWW />} />
          <Route path="clear/WW" element={<ClearCodesTrainerWW />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
