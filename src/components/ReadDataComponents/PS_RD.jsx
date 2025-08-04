import { useState, useEffect, useMemo } from 'react';
import ignitionSwitchImg  from '/ignition_switch.png';
import adjusterSwitchImg  from '/adjuster_switch.png';
import lumbarSwitchImg   from '/lumbar_switch.png';

import { pidMeta, getDecoder } from '../../data/pidDecoder';

import {requestStatus, onSeatStatus, requestLiveStop, requestLiveStart } from '../bluetooth/powerSeat';
import { onBleNotify, onBleState } from '../bluetooth/core';
import { useNavigate } from 'react-router-dom';

const FALLBACK_NAME = pid => `0x${pid.toString(16).toUpperCase().padStart(2,'0')}` // In case PID LIbrary doesnt have a description


export default function PS_RD(){
  const navigate = useNavigate();

  // BLE State
  const [ble, setBle] = useState({ connected:false, notifying:false });
  useEffect(() => onBleState(setBle), []);

  // UI Flags
  const [streaming, setStreaming] = useState(false);
  const [ignition, setIgnition] = useState('OFF');
  const [adjuster, setAdjuster] = useState('NEUTRAL');
  const [lumbar,   setLumbar]   = useState('NEUTRAL');
  const [loading, setLoading] = useState(false);  // used to track button loading state
  const [highlight, setHighlight] = useState(false); // used to highlight the fetched data

  // List of PIDS (first 0x00 frame)
  const [supportedPids, setSupportedPids] = useState([]);
  const [pidData, setPidData] = useState({})  //latest raw‐value map
  let maskBuf = []  
  const MASK_LEN = 1 + 7*4  


  //helper function for ui smoothness
  function sleep(ms){ //Temporary sleep function for ui smoothness
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ----- BLE notification handler ----- */
  useEffect(() => {
    const unsub = onBleNotify(raw => {
      // --- 1) Bitmask comes in as [0x00, B0, B1, ..., B27] ---
      if (raw[0] === 0x00) {
        maskBuf = maskBuf.concat(Array.from(raw))
        if (maskBuf.length >= MASK_LEN) {
          // once we’ve got all 29 bytes, parse them:
          const maskBytes = maskBuf.slice(1, MASK_LEN)
          const pids = []
          maskBytes.forEach((b,i) => {
            for (let bit=0; bit<8; bit++) {
              if (b & (1 << (7-bit))) {
                pids.push(i*8 + bit + 1)
              }
            }
          })
          setSupportedPids(pids)
          maskBuf = []      // reset for next time
        }
        return
      }

      // --- 2) Otherwise this is a PID/value frame: [PID, val, PID, val, ...] ---
      if (raw.length < 2 || (raw.length & 1)) return;
      if (supportedPids.length === 0 && raw[0] !== 0x00) {
         setSupportedPids(p => p.includes(raw[0]) ? p : [...p, raw[0]]);
       }
      setPidData(prev => {
        const next = { ...prev }
        for (let i = 0; i < raw.length; i += 2) {
          next[ raw[i] ] = [ raw[i+1] ]
        }
        return next
      })

      // flash highlight for one‐shot
      if (!streaming) {
        setHighlight(true)
        setTimeout(() => setHighlight(false), 800)
      }
    })

    return unsub
  }, [])

  // sorted list of PIDs we actually have data for
  const displayedPids = useMemo(() => {
    // if we already have a full mask, slice out the first 20 supported PIDs
    if (supportedPids.length) {
      return supportedPids.slice(0, 20);
    }
    // otherwise default to 0x01–0x14
    return Array.from({ length: 20 }, (_, i) => i + 1);
  }, [supportedPids]);

  const fetchOnce = async () => {
    if (!ble.notifying) return
    setLoading(true)
    try {
      /* Try the first 20 supported PIDs, or 0x01-0x14 if mask not fetched yet */
      const wanted = supportedPids.length
        ? supportedPids.slice(0,20)
        : Array.from({length: 20}, (_,i) => i + 1);
      await requestStatus(wanted);
    }finally{setLoading(false)}
  }

  useEffect(() => {
    if (ble.connected && ble.notifying && displayedPids.length) {
      setLoading(true);
      requestStatus(displayedPids).finally(() => setLoading(false));
    }
  }, [ble.connected, ble.notifying, displayedPids]);
  
  const startStream = async () => {
    try {
      await requestLiveStart();  // writes 0x06
      setStreaming(true);
      
    }catch(error){
      console.log("Error trying to start stream: ", error);
    }
  };

  // add a button to stop live data stream
  const stopStreamHandler = async () => {
    try {
      await requestLiveStop();   // writes 0x07
      setStreaming(false);
    } catch (error) {
      console.log("Error trying to stop stream: ", error);
    }
  };

  // always clean up
  useEffect(() => {
    return () => {
      if (streaming) requestLiveStop()
    }
  }, [streaming])

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
          disabled={!ble.connected || !ble.notifying }
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''} inline-block w-full text-center text-lg min-w-[200px] px-6 py-6 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b`}
          onClick={fetchOnce}
        >
          {loading ? "Analyzing..." : "Get Data"}
        </button>
        <button
          disabled={!ble.connected}
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''} inline-block w-full text-center text-lg min-w-[200px] px-6 py-6 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b`}
          onClick={streaming ? stopStreamHandler : startStream}
        >
          {streaming ? "Stop Stream" : "Live Stream"}
        </button>
      </div>
      

      {/* 
      <div  className="grid grid-cols-3 gap-10">
        {/* Ignition ---------------------------------------------------- }
        <Card img={ignitionSwitchImg} title="Ignition Switch" highlight={highlight}>
          Status:&nbsp;<strong>{ignition}</strong>
        </Card>

        {/* Seat Adjuster ---------------------------------------------- }
        <Card img={adjusterSwitchImg} title="Seat Adjuster Switch" highlight={highlight}>
          Position:&nbsp;<strong>{adjuster}</strong>
        </Card>

        {/* Lumbar ------------------------------------------------------ }
        <Card img={lumbarSwitchImg} title="Lumbar Adjuster Switch" highlight={highlight}>
          Position:&nbsp;<strong>{lumbar}</strong>
        </Card>
      </div>*/}

      {/* 4. Dynamic table of active PIDs */}
        {displayedPids.length > 0 && (
          <div className="w-full px-4">
            <h2 className="text-2xl text-white mb-2">Active Parameters</h2>
            <table className="w-full bg-gray-800 text-white rounded overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-2 text-left">PID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Value</th>
                  <th className="p-2 text-left">Unit</th>
                </tr>
              </thead>
              <tbody>
                {displayedPids.map(pid => {
                  const raw = pidData[pid] ?? []
                  const decoded = getDecoder(pid)(raw)
                  

                  // metadata lookup
                  const meta = pidMeta[pid];
                  const description = meta?.description ?? FALLBACK_NAME(pid);
                  const unit = meta?.unit ?? '';

                  return (
                    <tr key={pid} className="border-t border-slate-700">
                      <td className="px-4 py-2">
                        0x{pid.toString(16).toUpperCase().padStart(2,'0')}
                      </td>
                      <td className="px-4 py-2">{description}</td>
                      <td className={`px-4 py-2 ${highlight ? 'bg-green-700' : ''}`}>
                        {raw.length ? decoded : '—'}
                      </td>
                      <td className="px-4 py-2">{unit}</td>
                    </tr>
                  );
                })}
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