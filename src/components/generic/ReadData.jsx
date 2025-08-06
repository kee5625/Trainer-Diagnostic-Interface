// src/components/generic/ReadData.jsx
import { useState, useEffect, useMemo, useRef } from 'react';
import { pidMeta, getDecoder } from '../../data/pidDecoder';

import {requestMask, requestPid, onBLEData, stopLiveStream, startLiveStream} from '../../core/ble/commands';
import { onBleNotify, onBleState } from '../../core/ble/core';
import { useNavigate } from 'react-router-dom';

const FALLBACK = pid => `0x${pid.toString(16).toUpperCase().padStart(2,"0")}`; // In case PID LIbrary doesnt have a description


export default function ReadData({trainer}){
  const navigate = useNavigate();

  // BLE State
  const [ble, setBle] = useState({ connected: false, notifying: false });
  useEffect(() => onBleState(setBle), []);

  const MASK_ROWS = 7, ROW_BYTES = 4;

  // UI Flags
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);  // used to track button loading state
  const [highlight, setHighlight] = useState(false); // used to highlight the fetched data

  // List of PIDS (first 0x00 frame)
  const [pidData, setPidData]             = useState({});

  const maskBuf = useRef(new Uint8Array(MASK_ROWS * ROW_BYTES));
  const rowsSeen = useRef(new Set());
  const [supportedPids, setSupportedPids] = useState([]);
  const awaitingMask = useRef(false);

  /* ----- BLE notification handler ----- */
  // Parse incoming BLE notifications
  useEffect(() => {
    const unsub = onBLEData(raw => {
      // --- mask row: raw[0]=0x00, raw.length=5 (no index) or 6 (with index) ---
      if (raw[0] === 0x00 && (raw.length === ROW_BYTES + 1 || raw.length === ROW_BYTES + 2)) {
        let row, bytes;
        if (raw.length === ROW_BYTES + 2) {
          // legacy/full‐mask: [0x00, row, b0,b1,b2,b3]
          row   = raw[1];
          bytes = raw.slice(2);
        } else {
          // [0x00, b0,b1,b2,b3]
          row   = rowsSeen.current.size;
          bytes = raw.slice(1);
        }
        if (row >= 0 && row < MASK_ROWS) {
          maskBuf.current.set(bytes, row * ROW_BYTES);
          rowsSeen.current.add(row);
        }

        // once we've got all 7 rows, decode them:
        if (rowsSeen.current.size === MASK_ROWS) {
          const pidSet = new Set();
          maskBuf.current.forEach((byte, idx) => {
            const r = Math.floor(idx / ROW_BYTES);
            const b = idx % ROW_BYTES;
            for (let bit = 0; bit < 8; bit++) {
              if (byte & (1 << (7 - bit))) {
                pidSet.add(r * 0x20 + b * 8 + bit + 1);
              }
            }
          });
          const pids = Array.from(pidSet)
            .filter(pid => pid !== 0x02 && (pid & 0x1F) !== 0)
            .sort((a, b) => a - b);
          
          setSupportedPids(pids);
          if (awaitingMask.current) {
            awaitingMask.current = false;
            for (let pid of pids){
              requestPid(pid);
            }
            setLoading(false);
          }

          rowsSeen.current.clear();
          maskBuf.current.fill(0);
        }
        return;
      }

      // --- PID/value pairs: [pid,val, pid,val, …] ---
      if (raw.length >= 2 && raw[0] !== 0x00) {
      setPidData(prev => {
        const next = { ...prev };
        for (let i=0; i<raw.length; i+=2) {
          next[ raw[i] ] = [ raw[i+1] ];
        }
        next[ raw[0] ] = Array.from(raw.slice(1));
        return next;
      });
      if (!streaming) {
        setHighlight(true);
        setTimeout(() => setHighlight(false), 800);
      }
    }
    });
    return unsub;
  }, [streaming]);

  // PIDs we want
  const displayedPids = useMemo(() => {
    if (supportedPids.length) return supportedPids.slice(0, 20);
    return Array.from({length:20}, (_,i) => i+1);
  }, [supportedPids]);

  const fetchOnce = async (pids) => {
    if (!ble.notifying) return;
    setLoading(true);
    awaitingMask.current = true;
    requestMask();
  };

  // Start stream handler
  const startHandler = async () => {
    try {
      await startLiveStream();
      setStreaming(true);
    } catch {}
  };

  // Stop stream function for stream
  const stopHandler = async () => {
    try {
      await stopLiveStream();
      setStreaming(false);
    } catch {}
  };

  return (
    <div className="flex items-center flex-col justify-center w-full">
      <div className='flex flex-row gap-5 items-center'>
        <button onClick={() => navigate(`/trainers/${trainer.id}`)} className=''>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className='w-8 h-8'
          >
            <path
              fill="currentColor"
              d="M21 11H6.83l3.58-3.59L9 6l-6 6l6 6l1.41-1.41L6.83 13H21z"
            ></path>
          </svg>
        </button>
        <h1 className="text-3xl">Live Data</h1>
      </div>
      
      <div className="gap-4 flex pt-5 flex-row justify-center">
        <button
          disabled={!ble.connected || !ble.notifying }
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''} inline-block w-full text-center text-lg min-w-[150px] px-5 py-4 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b`}
          onClick={fetchOnce}
        >
          {loading ? "Analyzing..." : "Get Data"}
        </button>
        <button
          disabled={!ble.connected}
          className={`${!ble.notifying ? 'opacity-60 cursor-not-allowed' : ''} inline-block w-full text-center text-lg min-w-[150px] px-5 py-4 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b`}
          onClick={streaming ? stopHandler : startHandler}
        >
          {streaming ? "Stop Stream" : "Live Stream"}
        </button>
      </div>

      {/* 4. Dynamic table of active PIDs */}
        {displayedPids.length > 0 && (
          <div className="w-[80%] px-4">
            <h2 className="text-2xl text-white mb-2">Active Parameters</h2>
            <div className='overflow-y-auto max-h-[400px] lg:max-h-[500px]'>
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
                    const description = meta?.description ?? FALLBACK(pid);
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
            
          </div>
        )}
    </div>
  );
}