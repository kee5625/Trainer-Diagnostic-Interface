// src/pages/home/HomePage.tsx
import AtechLogo from '/atechlogo.webp';

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { disconnectBle } from '../components/bluetooth'


function HomePage (){
  useEffect(() => {
    disconnectBle();
  })
  
  const navigate = useNavigate();
  return (
    <>
      <a href="https://www.atechtraining.com/" target="_blank" rel="noreferrer">
        <img src={AtechLogo} className="logo" alt="Atech logo" />
      </a>
      <h1>Trainer Diagnostic Interface</h1>
      <h2>Choose a Trainer:</h2>
      <div className="tab-buttons">
          <button className='NavigationBtn' onClick={() => navigate("/power-seat")}>Power Seat Trainer</button>
      </div>
    </>
  );
};

export default HomePage;