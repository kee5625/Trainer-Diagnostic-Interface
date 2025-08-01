// src/components/generic/ReadData.jsx
import { useState, useEffect, useMemo } from 'react';
import { onBleNotify, writeCommand } from '../../core/ble/core';
import { useNavigate } from 'react-router-dom';

export default function ReadData({ trainer }) {
  const navigate = useNavigate();
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [pidData, setPidData]     = useState({});
  const [supportedPids, setSupportedPids] = useState([]);

  // 1) subscribe to BLE notifications
  useEffect(() => {
    const unsub = onBleNotify(raw => {
      // mask frame? 0x00 + N bytes → supported PIDs
      if (raw[0] === 0x00) {
        // strip the leading byte and decode bitmask → [1,2,3…]
        const bits = raw.slice(1);
        const pids = bits.flatMap((b,byteIdx) =>
          Array.from({length:8}, (_,bit) =>
            (b & (1 << (7-bit))) ? byteIdx*8 + bit + 1 : null
          ).filter(Boolean)
        );
        setSupportedPids(pids);
        return;
      }

      // otherwise it’s [pid,val,pid,val…]
      setPidData(prev => {
        const next = { ...prev };
        for (let i = 0; i < raw.length; i += 2) {
          next[ raw[i] ] = raw[i+1];
        }
        return next;
      });

      // flash the highlight if this wasn’t a stream
      if (!streaming) {
        setHighlight(true);
        setTimeout(() => setHighlight(false), 800);
      }
    });
    return unsub;
  }, [streaming]);

  // 2) sorted list of live PIDs
  const activePids = useMemo(
    () => Object.keys(pidData)
                  .map(k => parseInt(k,10))
                  .sort((a,b) => a-b),
    [pidData]
  );

  // 3) one‐shot “get data”
  const fetchOnce = async () => {
    setLoading(true);
    try {
      await writeCommand(trainer.ble.status());
    } finally {
      setLoading(false);
    }
  };

  // 4) start / stop streaming
  const startStream = async () => {
    await writeCommand(trainer.ble.liveStart());
    setStreaming(true);
  };
  const stopStream = async () => {
    await writeCommand(trainer.ble.liveStop());
    setStreaming(false);
  };

  return (
    <div className="p-6">
      {/* ← back to home */}
      <button
        onClick={() => navigate(`/trainers/${trainer.id}`)}
        className="mb-4 text-blue-300 hover:underline"
      >
        &larr; Back to {trainer.name}
      </button>

      <h2 className="text-2xl font-bold mb-4">
        {trainer.name} — Live Data
      </h2>

      <div className="flex gap-4 mb-6">
        <button
          disabled={loading}
          onClick={fetchOnce}
          className="btn-primary"
        >
          {loading ? 'Analyzing…' : 'Get Data'}
        </button>
        <button
          disabled={false}
          onClick={streaming ? stopStream : startStream}
          className="btn-primary"
        >
          {streaming ? 'Stop Stream' : 'Live Stream'}
        </button>
      </div>

      {/* 5) Parameter table */}
      {activePids.length > 0 && (
        <table className="w-full bg-gray-800 text-white rounded overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 text-left">PID</th>
              <th className="p-2 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {activePids.map(pid => (
              <tr
                key={pid}
                className={highlight ? 'bg-green-700 transition-colors' : ''}
              >
                <td className="px-4 py-2">{`0x${pid.toString(16).toUpperCase().padStart(2,'0')}`}</td>
                <td className="px-4 py-2">{pidData[pid]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
