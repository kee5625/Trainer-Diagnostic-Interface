import { useState, useEffect } from 'react';

import { onBleState } from '../bluetooth/core';
import { requestDTC, onDtc} from '../bluetooth/powerSeat';


export default function PS_RC() {
  const [pCode, setPCode] = useState("N/A");
  const [cCode, setCCode] = useState("N/A");
  const [bCode, setBCode] = useState("N/A");
  const [uCode, setUCode] = useState("N/A");

  const [loading, setLoading] = useState(false);  // used to track button loading state
  const [highlight, setHighlight] = useState(false); // used to highlight the fetched DTCs

  /* ---- Helper ---- */
  
  function sleep(ms){ //Temporary sleep function for ui smoothness
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* -----  BLE related ----- */

  const [ble, setBle] = useState({ connected:false, notifying:false });

  useEffect(() => onBleState(setBle), []);

  
  useEffect(() => onDtc(code => {
    console.log("[Notify]", code);
    setPCode(code);
  }), []);

  const fetchOnce   = async () =>{
    if(!ble.notifying){
      console.warn("BLE not ready");
      return;
    }
    setLoading(true);
    await sleep(2000);  //Temporary delay for UI smoothness
    
    try { 
      await requestDTC(0x00);
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1000);
    }
    catch(e) {console.error("[Request DTC] failed:", e);}
    finally{setLoading(false);}
  };

  const clearCodes = async () => {

  }

  

  return (
    <div className="flex items-center flex-col justify-center">
      <div className='flex flex-col items-center justify-center max-w-[600px]'>
        <h1 className='text-4xl font-semibold p-5'>Diagnostic Trouble Codes</h1>
        <p className='text-slate-300 text-center '>
          A DTC or a Diagnostic Trouble Code, also known as OBDII codes, are your car's system for alerting you of vehicle issues.
          This page here can be used to get these trouble codes that are currently active in the trainer.
        </p>
      </div>
      
      <div className='gap-5 pt-10 flex p-6 flex-row justify-center'>
        <button 
          disabled={!ble.connected || loading}
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''}inline-block w-full text-center text-lg min-w-[200px] px-6 py-5 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px`}
          onClick={fetchOnce}>
            {loading ? "Analyzing..." : "Get Trouble Codes"}
        </button>
        <button 
          disabled={!ble.connected || loading}
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''}inline-block w-full text-center text-lg min-w-[200px] px-6 py-5 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px`}
          onClick={clearCodes}>
            {loading ? "Clearing Codes..." : "Clear Codes"}
        </button>
      </div>
      
      <div className="w-[820px] h-[300px] mx-auto relative flex flex-col text-slate-300 bg-slate-800 shadow-md rounded-lg overflow-hidden">
        <table className="w-full h-full table-fixed text-left">
          <thead>
            <tr className="bg-slate-700">
              <th className="w-[20%] px-4 py-2 border-b border-slate-600 text-lg font-medium text-slate-200">
                Category
              </th>
              <th className="w-[20%] px-4 py-2 border-b border-slate-600 text-lg font-medium text-slate-200">
                Code
              </th>
              <th className="w-[60%] px-4 py-2 border-b border-slate-600 text-lg font-medium text-slate-200">
                Definition
              </th>
            </tr>
          </thead>
          <tbody className="align-middle">
            <tr className="hover:bg-slate-700">
              <td className="px-4 py-3 border-b border-slate-700 font-semibold text-slate-100">
                P - Powertrain
              </td>
              <td className={`px-4 py-3 border-b border-slate-700 transition-colors text-md duration-500 ${highlight && "bg-green-700 text-white"}`}>
                {pCode || "N/A"}
              </td>
              <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                Powertrain system diagnostic trouble code description.
              </td>
            </tr>
            <tr className="hover:bg-slate-700">
              <td className="px-4 py-3 border-b border-slate-700 font-semibold text-slate-100">
                C - Chassis
              </td>
              <td className="px-4 py-3 border-b border-slate-700">
                {cCode}
              </td>
              <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                Chassis system diagnostic trouble code description.
              </td>
            </tr>
            <tr className="hover:bg-slate-700">
              <td className="px-4 py-3 border-b border-slate-700 font-semibold text-slate-100">
                B - Body
              </td>
              <td className="px-4 py-3 border-b border-slate-700">
                {bCode}
              </td>
              <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                Body system diagnostic trouble code description.
              </td>
            </tr>
            <tr className="hover:bg-slate-700">
              <td className="px-4 py-3 font-semibold text-slate-100">
                U - Network
              </td>
              <td className="px-4 py-3">
                {uCode}
              </td>
              <td className="px-4 py-3 text-slate-300">
                Network communication diagnostic trouble code description.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}