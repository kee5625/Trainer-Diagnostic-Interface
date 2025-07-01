// ReadDataTrainerPS.tsx
import { useState, useEffect } from 'react';
import ignitionSwitchImg  from '/ignition_switch.png';
import adjusterSwitchImg  from '/adjuster_switch.png';

import {
  setNotifyCallback, readAlias, subscribeAll
} from '../components/bluetooth';

export default function ReadDataTrainerPS() {
  const [ignition, setIgnition]   = useState<'ON' | 'OFF'>('OFF');
  const [adjuster, setAdjuster]   = useState<'UP' | 'DOWN'>('DOWN');

  /* ----- attach BLE notification handler once ----- */
  useEffect(() => {
    setNotifyCallback((alias, value) => {
      if (alias === 0x00) setIgnition(value ? 'ON' : 'OFF');
      else if (alias === 0x01) setAdjuster(value ? 'UP' : 'DOWN');
    });
  }, []);

  const fetchOnce   = async () => {await readAlias(0x00);};
  const startStream = () => subscribeAll();

  return (
    <div className="page">
      <h1>Live Data</h1>
      <div className='startBtns'>
        <button className="actionBtn" onClick={fetchOnce}>Get Data</button>
        <button className="actionBtn" onClick={startStream}>Stream Live</button>
      </div>
      

      <div className="DataLineBox">
        {/* Ignition ----------------------------------------------------- */}
        <div className="dataLine">
          <div className="switch-wrapper">
            <img src={ignitionSwitchImg} alt="Ignition Switch" />
          </div>
          <div className="DataBox">
            <h2>Ignition Switch</h2>
            <p>Status: <strong>{ignition}</strong></p>
          </div>
        </div>

        {/* Adjuster ------------------------------------------------------ */}
        <div className="dataLine">
          <div className="switch-wrapper">
            <img src={adjusterSwitchImg} className="adjuster-img" alt="Seat Adjuster Switch" />
          </div>
          <div className="DataBox">
            <h2>Seat Adjuster Switch</h2>
            <p>Position: <strong>{adjuster}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}