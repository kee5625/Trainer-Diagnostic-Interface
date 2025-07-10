import { useState, useEffect } from 'react';
import ignitionSwitchImg  from '/ignition_switch.png';
import adjusterSwitchImg  from '/adjuster_switch.png';
import lumbarSwitchImg   from '/lumbar_switch.png';

import { requestStatus, onSeatStatus, subscribeAll } from '../bluetooth/powerSeat';
import { onBleState } from '../bluetooth/core';


export default function PS_RD(){
  const [ignition, setIgnition] = useState('OFF');
  const [adjuster, setAdjuster] = useState('NEUTRAL');
  const [lumbar,   setLumbar]   = useState('OFF');

  const [loading, setLoading] = useState(false);  // used to track button loading state
  const [liveLoading, setLiveLoading] = useState(false);
  const [highlight, setHighlight] = useState(false); // used to highlight the fetched data

  function sleep(ms){ //Temporary sleep function for ui smoothness
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const [ble, setBle] = useState({ connected:false, notifying:false });

  useEffect(() => onBleState(setBle), []);

  /* ----- attach BLE notification handler once ----- */
  useEffect(() => {
    //  onSeatStatus gives you { ignition:Boolean, lumbar:Boolean, seat:String }
    const unsubscribe = onSeatStatus(({ ignition, lumbar, seat }) => {
      setIgnition(ignition ? 'ON' : 'OFF');
      setLumbar(lumbar ? 'ON' : 'OFF');
      setAdjuster(seat);                // "UP" | "DOWN" | "LEFT" | "RIGHT" | "NEUTRAL"
    });
    return unsubscribe;                 // clean-up when component unmounts
  }, []);

  const fetchOnce   = async () => {
    setLoading(true);
    await sleep(2000);

    try{
      await requestStatus();
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1000);
    }catch(error){
      console.error("[Request Status] failed: ", error);
    }finally{setLoading(false);}
    
  };
  const startStream =  async() => {
    setLiveLoading(true);
    await sleep(2000);

    try{
      await subscribeAll();
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1000);
    }catch(error){
      console.error("[Live Data Request] failed: ", error);
    }
    finally{
      setLiveLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col justify-center">
      <h1 className="text-2xl">Live Data</h1>

      <div className="gap-5 flex p-5 flex-row justify-center">
        <button
          disabled={!ble.connected || loading}
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''} inline-block w-full text-center text-lg min-w-[200px] px-6 py-6 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b`}
          onClick={fetchOnce}
        >
          {loading ? "Analyzing..." : "Get Data"}
        </button>
        <button
          disabled={!ble.connected || liveLoading}
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''} inline-block w-full text-center text-lg min-w-[200px] px-6 py-6 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b`}
          onClick={startStream}
        >
          {liveLoading ? "Getting Data..." : "Live Stream"}
        </button>
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
          Status:&nbsp;<strong>{lumbar}</strong>
        </Card>
      </div>
    </div>
  );
}

function Card({ img, title, children, highlight }) {
 
  return (
    <div className="flex flex-col items-center justify-center my-6 bg-slate-700 shadow-lg border border-slate-600 rounded-xl w-[300px]">
      <div className="relative w-[80%] aspect-square m-4 bg-gradient-to-tr from-slate-600 to-slate-800 rounded-lg border border-slate-500 flex items-center justify-center shadow-inner">
        <img src={img} alt={title} className="object-contain w-3/4 h-3/4" />
      </div>
      <div className="px-4 pb-4">
        <h6 className="mb-1 text-white text-lg font-semibold text-center">{title}</h6>
        <p className={`${highlight ? "bg-green-700 text-white" : ""}text-white text-sm text-center`}>{children}</p>
      </div>
    </div>
  );
}