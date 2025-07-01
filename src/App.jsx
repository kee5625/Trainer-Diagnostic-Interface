import { BrowserRouter, Routes, Route, Outlet} from 'react-router-dom';
import HomeButton from './components/HomeButton';
import HomePage from './pages/HomePage';

import PowerSeatHome from './pages/PowerSeatTrainer';
import ReadDataTrainerPS from './pages/ReadData';
import ReadCodesTrainerPS from './pages/ReadCodes';
import {ClearCodesTrainerPS} from './pages/ClearCodes';

function AppLayout(){
  return(
    <>
      {/* global floating button */}
      <HomeButton />

      {/* current route’s UI */}
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />

          {/* Trainer Pages */}
          <Route path="/power-seat" element={<PowerSeatHome />} />

          {/*Read Live Data Pages */}
          <Route path="/data/PS" element={<ReadDataTrainerPS />} />
          <Route path="/dtc/PS" element={<ReadCodesTrainerPS />} />
          <Route path="/clear/PS" element={<ClearCodesTrainerPS />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
