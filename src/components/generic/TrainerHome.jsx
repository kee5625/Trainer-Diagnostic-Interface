// src/components/generic/TrainerHome.jsx
import { useState } from 'react';
import { useBle } from '../../core/ble/useBle';      // the React hook we created
import { useNavigate } from 'react-router-dom';

export default function TrainerHome({ trainer }) {
  const { connected, notifying, connect, disconnect } = useBle(trainer.gapPrefix);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /** small helper so buttons show a spinner for UX */
  const withSpinner = fn => async () => {
    setLoading(true);
    try { await fn(); } finally { setLoading(false); }
  };

  const connectBle    = withSpinner(connect);
  const disconnectBle = withSpinner(disconnect);

  /* ─────────────────────────────── render ─────────────────────────────── */
  return (
    <div className="row-start-2 w-full h-full flex justify-center items-center">
      <div className="
          relative flex flex-row gap-10
          bg-white/5 backdrop-blur-lg backdrop-saturate-150
          ring-1 ring-white/15 shadow-2xl rounded-3xl
          min-w-[1250px] w-full min-h-[700px] h-full
        ">
        <div className="grid grid-cols-[1fr_300px] gap-2 items-center mx-auto max-w-[1000px] w-full">
          {/* ◂── Left – image + connect button ──────────────────────────── */}
          <div className="flex flex-col items-center gap-4 w-[88%]">
            <div className="relative overflow-hidden py-8 rounded-xl
                            bg-gradient-to-tr from-slate-800 to-slate-800
                            border border-slate-600 shadow-inner">
              <img
                src={trainer.hero}
                alt={trainer.name}
                className="w-[90%] h-full object-contain"
              />

              {/* Connect / Disconnect */}
              <div className="relative mt-4 flex flex-col items-center">
                <button
                  disabled={loading || connected}
                  onClick={connectBle}
                  className={`
                    flex items-center justify-center gap-2 rounded-full w-60 px-6 py-3 text-white text-lg
                    bg-gradient-to-r from-green-600 via-green-700 to-green-800 shadow-lg shadow-green-900
                    transition-all
                    ${loading || connected ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-green-800'}
                  `}
                >
                  {loading
                    ? 'Connecting…'
                    : connected
                    ? 'Connected'
                    : 'Connect'}
                  {loading && (
                    <svg className="w-5 h-5 animate-spin fill-blue-600" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    </svg>
                  )}
                </button>

                {/* Disconnect floating X */}
                <button
                  onClick={disconnectBle}
                  disabled={!connected || loading}
                  className={`
                    absolute -top-3 -right-3 rounded-full p-2
                    bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-md
                    transition-opacity
                    ${connected ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                  `}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ▸── Right – title / description / nav buttons ──────────────── */}
          <div className="flex flex-col justify-center text-white w-full max-w-[350px]">
            <h2 className="text-3xl font-bold mb-2">{trainer.name} Trainer</h2>
            <p className="text-gray-300 text-sm pb-5">
              {trainer.description ??
                `Interact with the ${trainer.name.toLowerCase()} system. Connect to begin
                 reading live data or trouble codes.`}
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate(`/trainers/${trainer.id}/read-data`)}
                disabled={!connected}
                className="btn-primary w-full"
              >
                Read Live Data
              </button>
              <button
                onClick={() => navigate(`/trainers/${trainer.id}/read-codes`)}
                disabled={!connected}
                className="btn-primary w-full"
              >
                Read Trouble Codes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
