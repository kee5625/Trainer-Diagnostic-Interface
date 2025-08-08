import Layout from './components/layout/Layout';
import TrainerRouter from './components/router/TrainerRouter';
import HomePage from './pages/HomePage';
import { Trainers } from './pages/Trainers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Help from './components/generic/Help';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="trainers/*" element={<TrainerRouter />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="*" element={<h2>Not found</h2>} />
          <Route path='/help' element={<Help />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}