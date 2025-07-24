import { useState, useEffect, useRef } from 'react';

import { onBleState } from '../bluetooth/core';
import { requestDTC, onDtc, clearCodes, CMD_PENDING, CMD_STORED, CMD_PERM} from '../bluetooth/powerSeat';
import { useNavigate } from 'react-router-dom';

const CATEGORY_NAMES = {
  pending: 'Pending',
  stored: 'Stored',
  permanent: 'Permanent'
}



export default function PS_RC() {
  const [dtc, setDtc] = useState({
    pending: [],
    stored: [],
    permanent: []
  });

  const lastCategoryRef = useRef('pending');

  const [currentCategory, setCurrentCategory] = useState('pending');

  const [codes, setCodes] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);  // used to track button loading state
  const [clearLoading, setClearLoading] = useState(false); // used to track clear button loading state
  const [storedLoading, setStoredLoading] = useState(false); // used to track stored button loading state
  const [permanentLoading, setPermanentLoading] = useState(false);
  const [highlight, setHighlight] = useState(false); // used to highlight the fetched DTCs

  /* ---- Helper ---- */
  
  function sleep(ms){ //Temporary sleep function for ui smoothness
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* -----  BLE related ----- */

  const [ble, setBle] = useState({ connected:false, notifying:false });

  useEffect(() => onBleState(setBle), []);

  useEffect(() => {
    return onDtc(({ cleared, list }) => {
      setDtc(prev => {
        const cat = lastCategoryRef.current;
        if (cleared) return { ...prev, [cat]: [] };
        else return { ...prev, [cat]: list };
      });
    });
  }, []);

  useEffect(() => {
    setCodes(dtc[currentCategory] || []);
  }, [dtc, currentCategory]);

  // helper to drive any of the 3 fetch buttons
  const fetchCategory = async(cmd, category, setLoader) => {
    if(!ble.notifying) {
      console.warn("BLE not ready");
      return;
    }
    lastCategoryRef.current = category;
    setCodes([]);
    setLoader(true);
    await sleep(1000);
    setCurrentCategory(category);
    
    
    try{
      await requestDTC(cmd);
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1000);
    }
    catch(e) {
      console.error(`[Request ${category}] failed:`, e);
    }
    finally {
      setLoader(false);
    }
  };

  const ClearCodes = async () => {
    if(!ble.notifying){
      console.warn("BLE not ready");
      return;
    }
    setClearLoading(true);
    await sleep(2000);  //Temporary delay for UI smoothness
    
    try { 
      await clearCodes();
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1000);
    }
    catch(e) {console.error("[Clear Codes] failed:", e);}
    finally{setClearLoading(false);}
  }

  const fetchStored = () => fetchCategory(CMD_STORED, 'stored', setStoredLoading);

  const fetchPending = () => fetchCategory(CMD_PENDING, 'pending', setLoading);

  const fetchPermanent = () => fetchCategory(CMD_PERM, 'permanent', setPermanentLoading);


  return (
    <div className="pt-16 flex items-center flex-col justify-center">
      <div className='flex flex-col items-center justify-center max-w-[600px]'>
        <div className='flex flex-row gap-2 items-center'>
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
          
          <h1 className='text-4xl font-semibold p-5'>Diagnostic Trouble Codes</h1>
        </div>
        <p className='text-slate-300 text-center '>
          A DTC or a Diagnostic Trouble Code, also known as OBDII codes, are your car's system for alerting you of vehicle issues.
          This page here can be used to get these trouble codes that are active or stored in the trainer.
        </p>
      </div>
    
      <div className='gap-5 pt-10 flex p-6 flex-row justify-center'>
        <button 
          disabled={!ble.connected || loading}
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''}inline-block w-full text-center text-lg min-w-[200px] px-6 py-5 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px`}
          onClick={fetchPending}>
            {loading ? "Analyzing..." : "Get Trouble Codes"}
        </button>
        <button 
          disabled={!ble.connected || storedLoading}
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''}inline-block w-full text-center text-lg min-w-[200px] px-6 py-5 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px`}
          onClick={fetchStored}>
            {storedLoading ? "Fetching Codes..." : "Show Stored Codes"}
        </button>
        <button 
          disabled={!ble.connected || permanentLoading}
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''}inline-block w-full text-center text-lg min-w-[200px] px-6 py-5 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px`}
          onClick={fetchPermanent}>
            {permanentLoading ? "Fetching Permanent..." : "Show Permanent Codes"}
        </button>
        <button 
          disabled={!ble.connected || clearLoading}
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''}inline-block w-full text-center text-lg min-w-[200px] px-6 py-5 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px`}
          onClick={ClearCodes}>
            {clearLoading ? "Clearing Codes..." : "Clear Codes"}
        </button>
      </div>
      
      <div className="w-[70%] h-[300px] mx-auto relative flex flex-col text-slate-300 bg-slate-800 shadow-md rounded-lg overflow-y-auto">
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
            {codes.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-slate-400">
                  {ble.connected ? "No codes present" : "Not connected"}
                </td>
              </tr>
            )}
            {codes.map((c,i) => (
              <tr key={i} className="hover:bg-slate-700">
                <td className="px-4 py-3 border-b border-slate-700 font-semibold text-slate-100">
                  {c[0]} {/* category letter */}
                </td>
                <td className={`px-4 py-3 border-b border-slate-700 transition-colors duration-500 ${highlight && "bg-green-700 text-white"}`}>
                  {c}
                </td>
                <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                  Diagnostic trouble-code description.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}