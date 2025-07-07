// ReadDataTrainerPS.tsx
import { useState, useEffect } from 'react';
import ignitionSwitchImg  from '/ignition_switch.png';
import adjusterSwitchImg  from '/adjuster_switch.png';

import {
  setNotifyCallback, readAlias, subscribeAll
} from '../components/bluetooth';

export default function ReadDataTrainerPS() {
  const [ignition, setIgnition]   = useState('OFF');
  const [adjuster, setAdjuster]   = useState('DOWN');

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
    <div className="flex items-center flex-col justify-center">
      <h1 className='text-2xl p-5'>Live Data</h1>
      <div className='gap-5 flex flex-row justify-center'>
        <button 
          className="inline-block w-full text-center text-lg min-w-[200px] px-6 py-6 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px" 
          onClick={fetchOnce}>
            Get Data
        </button>
        <button 
          className="inline-block w-full text-center text-lg min-w-[200px] px-6 py-6 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px" 
          onClick={startStream}>
            Stream Live
        </button>
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