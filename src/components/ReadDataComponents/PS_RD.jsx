import { useState, useEffect, useMemo } from 'react';
import ignitionSwitchImg  from '/ignition_switch.png';
import adjusterSwitchImg  from '/adjuster_switch.png';
import lumbarSwitchImg   from '/lumbar_switch.png';

import {requestStatus, onSeatStatus, requestLiveStop, requestLiveStart } from '../bluetooth/powerSeat';
import { onBleState } from '../bluetooth/core';
import { useNavigate } from 'react-router-dom';


export default function PS_RD(){

  const navigate = useNavigate();
  const [streaming, setStreaming] = useState(false);
  const [ignition, setIgnition] = useState('OFF');
  const [adjuster, setAdjuster] = useState('NEUTRAL');
  const [lumbar,   setLumbar]   = useState('NEUTRAL');

  const [loading, setLoading] = useState(false);  // used to track button loading state
  const [liveLoading, setLiveLoading] = useState(false);
  const [highlight, setHighlight] = useState(false); // used to highlight the fetched data

  const [pidData, setPidData] = useState({});

  const PID_NAMES = {
    0xA0: 'Ignition Switch',
    0xA1: 'Seat Adjuster',
    0xA2: 'Lumbar Adjuster',
  };

  
  function sleep(ms){ //Temporary sleep function for ui smoothness
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const [ble, setBle] = useState({ connected:false, notifying:false });

  useEffect(() => onBleState(setBle), []);

  /* ----- attach BLE notification handler once ----- */
  useEffect(() => {
    //  onSeatStatus gives you { ignition:Boolean, lumbar:Boolean, seat:String }
    // const unsubscribe = onSeatStatus(({ ignition, lumbar, seat }) => {
    //   setIgnition(ignition ? 'ON' : 'OFF');
    //   setLumbar(lumbar);
    //   setAdjuster(seat);                // "UP" | "DOWN" | "LEFT" | "RIGHT" | "NEUTRAL"
    // });
    // return unsubscribe;                 // clean-up when component unmounts

    const unsub = onSeatStatus(raw => {
      setPidData(prev => {
        const next = {...prev};
        for (let i = 0; i < raw.length; i+= 2){
          next[raw[i]] = raw[i+1];
        }
        return next;
      });
      
      // flash on one-shot
      if (!streaming) {
        setHighlight(true);
        setTimeout(() => setHighlight(false), 800);
      }
    });
    
    return unsub;
  }, []);

  const fetchOnce   = async () => {
    if(!ble.notifying) {
      console.warn("BLE not ready - cannot fetch live data");
      return;
    }

    setLoading(true);
    try{
      await requestStatus();
    }catch(error){
      console.error("[Request Status] failed: ", error);
    }finally{setLoading(false);}
    
  };

  const activePids = useMemo(
    () => Object.keys(pidData).map(k => parseInt(k, 10)).sort((a,b) => a - b),
    [pidData]
  );
  
  const startStream = async () => {
    if (!ble.notifying) return;
    setLiveLoading(true);
    try {
      await requestLiveStart();
      setStreaming(true);
    } finally {
      setLiveLoading(false);
    }
  };


  // add a button to stop live data stream
  const stopStreamHandler = async () => {
    setLiveLoading(true);
    try {
      await requestLiveStop();
      setStreaming(false);
    }finally{
      setLiveLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streaming) {
        requestLiveStop();
      }
    };
  }, [streaming]);

  return (
    <div className="flex items-center flex-col justify-center">
      <div className='flex flex-row gap-5 items-center'>
        <button onClick={() => navigate("/power-seat")} className=''>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className='w-9 h-9'
          >
            <path
              fill="currentColor"
              d="M21 11H6.83l3.58-3.59L9 6l-6 6l6 6l1.41-1.41L6.83 13H21z"
            ></path>
          </svg>
        </button>
        <h1 className="text-4xl">Live Data</h1>
      </div>
      
      <div className="gap-5 flex p-5 flex-row justify-center">
        <button
          disabled={!ble.connected }
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''} inline-block w-full text-center text-lg min-w-[200px] px-6 py-6 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b`}
          onClick={fetchOnce}
        >
          {loading ? "Analyzing..." : "Get Data"}
        </button>
        <button
          disabled={!ble.connected}
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''} inline-block w-full text-center text-lg min-w-[200px] px-6 py-6 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b`}
          onClick={startStream}
        >
          {liveLoading ? "Getting Data..." : "Live Stream"}
        </button>
        {streaming && (
          <button onClick={stopStreamHandler} className="inline-block w-full text-center text-lg min-w-[200px] px-6 py-6 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b">
            Stop Stream</button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-10">
        {/* Ignition ---------------------------------------------------- */}
        <Card img={ignitionSwitchImg} title="Ignition Switch" highlight={highlight}>
          Status:&nbsp;<strong>{ignition}</strong>
        </Card>

        {/* Seat Adjuster ---------------------------------------------- */}
        <Card img={adjusterSwitchImg} title="Seat Adjuster Switch" highlight={highlight}>
          Position:&nbsp;<strong>{adjuster}</strong>
        </Card>

        {/* Lumbar ------------------------------------------------------ */}
        <Card img={lumbarSwitchImg} title="Lumbar Adjuster Switch" highlight={highlight}>
          Position:&nbsp;<strong>{lumbar}</strong>
        </Card>
      </div>

      {/* 4. Dynamic table of active PIDs */}
        {activePids.length > 0 && (
          <div className="w-full px-8 mt-8">
            <h2 className="text-2xl text-white font-semibold mb-4">
              Active Parameters
            </h2>
            <table className="min-w-full table-auto bg-slate-800 text-white rounded-lg overflow-hidden shadow">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-2 text-left">PID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {activePids.map(pid => (
                  <tr key={pid} className="border-t border-slate-700">
                    <td className="px-4 py-2">
                      0x{pid.toString(16).toUpperCase().padStart(2,'0')}
                    </td>
                    <td className="px-4 py-2">
                      {PID_NAMES[pid] ?? 'Unknown'}
                    </td>
                    <td
                      className={`px-4 py-2 ${highlight ? 'bg-green-700' : ''}`}
                    >
                      {pidData[pid]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}

function Card({ img, title, children, highlight }) {
 
  return (
    <div className="h-full flex flex-col items-center justify-center my-6 bg-slate-700 shadow-lg border border-slate-600 rounded-xl w-[300px]">
      <div className="relative w-[80%] aspect-square m-4 bg-gradient-to-tr from-slate-600 to-slate-800 rounded-lg border border-slate-500 flex items-center justify-center shadow-inner">
        <img src={img} alt={title} className="object-contain w-3/4 h-3/4" />
      </div>
      <div className="px-4 pb-4">
        <h6 className="mb-1 text-white text-lg font-semibold text-center">{title}</h6>
        <p className={`${highlight ? "bg-green-700 text-white" : ""}text-white text-sm text-center rounded-xl py-2 w-full`}>{children}</p>
      </div>
    </div>
  );
}