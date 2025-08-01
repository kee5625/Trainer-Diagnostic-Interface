// src/components/generic/ReadCodes.jsx
import { useState, useEffect, useRef } from 'react';
import { onBleState, writeCommand } from '../../core/ble/core';
import { useNavigate } from 'react-router-dom';
import definitions from '../../data/dtcDefinitions.json';

const CAT_NAME = {
  pending:   'Pending',
  stored:    'Stored',
  permanent: 'Permanent',
};

export default function ReadCodes({ trainer }) {
  /* ───── BLE state & notify hookup ───── */
  const [ble, setBle] = useState({ connected:false, notifying:false });
  useEffect(() => onBleState(setBle), []);

  const [dtc, setDtc] = useState({});          // { pending:[], stored:[], … }
  const lastCatRef = useRef('pending');
  const [current, setCurrent] = useState('pending');

  /* subscribe to incoming code lists */
  useEffect(() => {
    // trainer.ble.onCodes(rawHandler) returns unsubscribe fn
    return trainer.ble.onCodes(({ cleared, list }) => {
      setDtc(prev => ({
        ...prev,
        [lastCatRef.current]: cleared ? [] : list,
      }));
    });
  }, [trainer]);

  /* codes to render for the active tab */
  const codes = dtc[current] ?? [];

  /* ───── helpers ───── */
  const [busy,   setBusy]   = useState({});
  const withSpinner = (cat, fn) => async () => {
    setBusy(b => ({ ...b, [cat]: true }));
    try   { await fn(); }
    finally { setBusy(b => ({ ...b, [cat]: false })); }
  };

  const fetchCat = (cat) => withSpinner(cat, async () => {
    lastCatRef.current = cat;
    setCurrent(cat);
    setDtc(d => ({ ...d, [cat]: [] }));              // clear existing
    await writeCommand(trainer.ble.cmd[cat]());       // send BLE cmd
  });

  const clearAll = withSpinner('clear', async () => {
    await writeCommand(trainer.ble.cmd.clear());
  });

  const getDesc = code => definitions[code] ?? 'Description not available';

  /* ───── UI ───── */
  const navigateHome = () => navigate(`/trainers/${trainer.id}`);
  const navigate = useNavigate();

  /* build list of tabs present in metadata */
  const TABS = Object.keys(trainer.ble.cmd)
                     .filter(k => ['pending','stored','permanent'].includes(k));

  return (
    <div className="flex flex-col items-center px-6">
      {/* header */}
      <button onClick={navigateHome} className="self-start my-4 text-blue-300 hover:underline">
        &larr; Back to {trainer.name}
      </button>

      <h1 className="text-3xl font-semibold mb-2">Diagnostic Trouble Codes</h1>
      <p className="text-slate-300 max-w-xl text-center">
        Retrieve, inspect, and clear DTCs on the&nbsp;{trainer.name.toLowerCase()} trainer.
      </p>

      {/* buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        {TABS.map(cat => (
          <button
            key={cat}
            disabled={!ble.notifying || busy[cat]}
            onClick={fetchCat(cat)}
            className="btn-primary min-w-[200px]"
          >
            {busy[cat] ? 'Fetching…' : `Show ${CAT_NAME[cat]}`}
          </button>
        ))}
        {'clear' in trainer.ble.cmd && (
          <button
            disabled={!ble.notifying || busy.clear}
            onClick={clearAll}
            className="btn-secondary min-w-[200px]"
          >
            {busy.clear ? 'Clearing…' : 'Clear Codes'}
          </button>
        )}
      </div>

      {/* table */}
      <div className="w-full md:w-3/4 max-h-[360px] mt-8 overflow-y-auto bg-slate-800 rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-slate-700 sticky top-0">
            <tr>
              <th className="px-4 py-2 w-1/5">Category</th>
              <th className="px-4 py-2 w-1/5">Code</th>
              <th className="px-4 py-2 w-3/5">Definition</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-slate-400">
                  {ble.connected ? 'No codes present' : 'Not connected'}
                </td>
              </tr>
            )}
            {codes.map((c,i) => (
              <tr key={i} className="hover:bg-slate-700">
                <td className="px-4 py-3 border-b border-slate-700 font-semibold">
                  {CAT_NAME[current]}
                </td>
                <td className="px-4 py-3 border-b border-slate-700">{c}</td>
                <td className="px-4 py-3 border-b border-slate-700">{getDesc(c)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
