import { useState, useEffect } from 'react';
import ignitionSwitchImg  from '/ignition_switch.png';
import adjusterSwitchImg  from '/adjuster_switch.png';
import lumbarSwitchImg   from '/lumbar_switch.png';

import { setNotifyCallback } from '../bluetooth/core';
import { readData, streamData } from '../bluetooth/powerSeat';


export default function PS_RD(){
  const [ignition, setIgnition]   = useState('OFF');
  const [adjuster, setAdjuster]   = useState('DOWN');
  const [lumbar_adjuster, setLumbarAdjuster]   = useState('OFF');

  /* ----- attach BLE notification handler once ----- */
  useEffect(() => {
    setNotifyCallback((ascii) => {
      console.log("[Notify]", ascii);

      //parse ascii string and update state properly
      if (ascii.includes('IGNITION')) {
        setIgnition(ascii.includes('ON') ? 'ON' : 'OFF');
      }
      if (ascii.includes('ADJUSTER')) {
        setAdjuster(ascii.includes('UP') ? 'UP' : 'DOWN');
      }
      if (ascii.includes('LUMBAR')) {
        setLumbarAdjuster(ascii.includes('ON') ? 'ON' : 'OFF');
      }
    });
  }, []);

  const fetchOnce   = async () => {await readData(0x00);};
  const startStream =  async() => {await streamData();};

  return (
    <div className="flex items-center flex-col justify-center">
      <h1 className='text-2xl'>Live Data</h1>
      <div className='gap-5 flex p-5 flex-row justify-center'>
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
      

      <div className="grid grid-cols-3 gap-10 ">
        {/* Ignition ----------------------------------------------------- */}
        <div className="flex flex-col items-center justify-center my-6 bg-slate-700 shadow-lg border border-slate-600 rounded-xl w-[300px]">
          <div className="relative w-[80%] aspect-square m-4 bg-gradient-to-tr from-slate-600 to-slate-800 rounded-lg border border-slate-500 flex items-center justify-center shadow-inner">
            <img src={ignitionSwitchImg} alt="Ignition Switch" className='object-contain w-3/4 h-3/4'/>
          </div>
          <div className="px-4 pb-4">
            <h6 className="mb-1 text-white text-lg font-semibold text-center">Ignition Switch</h6>
            <p className="text-white text-sm text-center">Status: <strong>{ignition}</strong></p>
          </div>
        </div>

        {/* Seat Adjuster ------------------------------------------------------ */}
        <div className="flex flex-col items-center justify-center my-6 bg-slate-700 shadow-lg border border-slate-600 rounded-xl w-[300px]">
          <div className="relative w-[80%] aspect-square m-4 bg-gradient-to-tr from-slate-600 to-slate-800 rounded-lg border border-slate-500 flex items-center justify-center shadow-inner">
            <img
              src={adjusterSwitchImg}
              alt="Seat Adjuster Switch"
              className="object-contain w-3/4 h-3/4"
            />
          </div>
          <div className="px-4 pb-4">
            <h6 className="mb-1 text-white text-lg font-semibold text-center">Seat Adjuster Switch</h6>
            <p className="text-white text-sm text-center">
              Position: <strong>{adjuster}</strong>
            </p>
          </div>
        </div>

        {/* Lumbar Adjuster ----------------------------------------------------- */}
        <div className="flex flex-col items-center justify-center my-6 bg-slate-700 shadow-lg border border-slate-600 rounded-xl w-[300px]">
          <div className="relative w-[80%] aspect-square m-4 bg-gradient-to-tr from-slate-600 to-slate-800 rounded-lg border border-slate-500 flex items-center justify-center shadow-inner">
            <img src={lumbarSwitchImg} alt="Lumbar Adjuster Switch" className='object-contain w-3/5 h-3/5'/>
          </div>
          <div className="px-4 pb-4">
            <h6 className="mb-1 text-white text-lg font-semibold text-center">Lumbar Adjuster Switch</h6>
            <p className="text-white text-sm text-center">Position: <strong>{lumbar_adjuster}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}