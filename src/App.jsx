import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PowerSeatHome from './pages/PowerSeatTrainer';
import ReadDataTrainerPS from './pages/ReadData';
import ReadCodesTrainerPS from './pages/ReadCodes';
import { ClearCodesTrainerPS } from './pages/ClearCodes';
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

          {/* Power Seat Trainer Home */}
          <Route path="power-seat" element={<PowerSeatHome />} />

          {/* Nested routes for Power Seat Trainer */}
          <Route path="data/PS" element={<ReadDataTrainerPS />} />
          <Route path="dtc/PS" element={<ReadCodesTrainerPS />} />
          <Route path="clear/PS" element={<ClearCodesTrainerPS />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
