import { Routes, Route, Navigate } from 'react-router-dom';
import { TRAINERS } from '../../utils/trainerRegistry';
import TrainerHome  from '../generic/TrainerHome';
import ReadData     from '../generic/ReadData';
import ReadCodes    from '../generic/ReadCodes';

// Dynamic routing for all trainers
export default function TrainerRouter() {
  return (
    <Routes>
      {TRAINERS.map(t => {
        const Home      = t.components.Home      ?? TrainerHome;
        const Data      = t.components.ReadData  ?? ReadData;
        const Codes     = t.components.ReadCodes ?? ReadCodes;

        return (
          <Route key={t.id} path={t.id}>
            <Route index             element={<Home trainer={t} />} />
            <Route path="read-data"  element={<Data trainer={t} />} />
            <Route path="read-codes" element={<Codes trainer={t} />} />
          </Route>
        );
      })}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}