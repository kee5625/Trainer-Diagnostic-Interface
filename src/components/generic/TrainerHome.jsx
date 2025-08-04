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

  const handleDisconnect = withSpinner(async () => {
    await new Promise(res => setTimeout(res, 2000));  // keep spinner up
    await disconnect();
  });

  function sleep(ms){
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ─────────────────────────────── render ─────────────────────────────── */
  return (
    <div className="w-full h-full flex justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="
          relative flex flex-row gap-10
          bg-white/2 backdrop-blur-lg backdrop-saturate-150
          ring-1 ring-white/15
          shadow-2xl rounded-3xl
          min-w-[1250px] w-full min-h-[700px] h-full
          overflow-hidden
        ">
        <div className="grid grid-cols-[1fr_300px] gap-2 items-center mx-auto max-w-[1000px] w-full">
          {/* ◂── Left – image + connect button ──────────────────────────── */}
          <div className="flex flex-col items-center gap-4 w-[88%]">
            <div className="relative overflow-hidden py-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-800 border border-slate-600 flex flex-col gap-2 items-center justify-center shadow-inner">
              <img
                src={trainer.hero}
                alt={trainer.name}
                className="w-[90%] min-w-[600px] max-h-[400px] object-contain p-5"
              />

              {/* Connect / Disconnect */}
              <div className="relative mt-4 flex flex-col items-center">
                <button
                  disabled={loading || connected}
                  onClick={connectBle}
                  className={`
                    relative flex flex-row items-center justify-center gap-3 min-w-[200px]
                    rounded-full px-6 py-3 sm:px-8 sm:py-4
                    text-white font-medium shadow-lg 
                    transition-all duration-300 ease-in-out 
                    bg-gradient-to-r from-green-600 via-green-700 to-green-800 
                    shadow-green-900/50 hover:shadow-green-800/60
                    w-full max-w-xs text-base sm:text-lg
                    transform ${!connected ? "hover:scale-105 active:scale-95" : ""}
                    ${loading || connected ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}
                  `}
                >
                  {loading ? (
                    <>
                        {connected ? "Disconnecting..." : "Connecting..."}
                        <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                    </>
                    ) : connected ? (
                    <>
                        Connected
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </>
                    ) : (
                    <>
                        Connect
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17.657 6.343a8 8 0 1 1-11.314 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </>
                    )}

                </button>

                {/* Disconnect floating X */}
                <button
                    onClick={handleDisconnect}
                    disabled={!connected}
                    className={`
                    absolute -top-3 -right-3 rounded-full p-2 bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-md text-white
                    transition-opacity duration-300 ${connected ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.657 6.343a8 8 0 1 1-11.314 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ▸── Right – title / description / nav buttons ──────────────── */}
          <div className="flex flex-col justify-center text-white w-full max-w-[350px]">
            <h2 className="text-2xl font-bold mb-2">{trainer.name} Trainer</h2>
            <p className="text-gray-300 text-sm pb-5">
              {trainer.description ??
                `Interact with the ${trainer.name.toLowerCase()} system. Connect to begin
                 reading live data or trouble codes.`}
            </p>
              
            <div className="mb-6">
              <div className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-300
                ${connected 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }
              `}>
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                {connected ? 'Device Connected' : 'Device Disconnected'}
              </div>
            </div>

            <div className="flex flex-col w-full gap-4">
              <button
                onClick={() => navigate(`/trainers/${trainer.id}/read-data`)}
                className={`
                  w-full px-5 py-4 text-white font-medium text-base
                  transition-all duration-300 rounded-xl shadow-lg
                  bg-gradient-to-r from-blue-600 to-blue-500 
                  hover:from-blue-700 hover:to-blue-600
                  shadow-blue-900/30 hover:shadow-blue-800/40 hover:shadow-xl
                  transform hover:scale-105 active:scale-95
                `}
              >
                Read Live Data
              </button>
              <button
                onClick={() => navigate(`/trainers/${trainer.id}/read-codes`)}
                className={`
                  w-full px-5 py-4 text-white font-medium text-base
                  transition-all duration-300 rounded-xl shadow-lg
                  bg-gradient-to-r from-blue-600 to-blue-500 
                  hover:from-blue-700 hover:to-blue-600
                  shadow-blue-900/30 hover:shadow-blue-800/40 hover:shadow-xl
                  transform hover:scale-105 active:scale-95
                  
                `}
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
