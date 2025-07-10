import React, { useState, useRef, useEffect } from 'react';
import { connectBle, disconnectBle, onBleState} from '../components/bluetooth/core'
import wiper_washer_trainer from '../assets/wiper_washer_trainer.webp';
import { useNavigate } from 'react-router-dom';

export default function AirConditionerHome(){
    const navigate = useNavigate();

    const [ble, setBle] = useState({connected: false, notifying: false});
    const [loading, setLoading] = useState(false);

    useEffect(() => onBleState(s => {console.log('BLE', s); setBle(s); }), []);

    //Event handler for connect btn
    const handleConnect = async () => {
        setLoading(true);
        try {
            await connectBle();
        } finally {
            setLoading(false);
        }
    };

    //Event handler for disconnect btn
    const handleDisconnect = async () => {
        setLoading(true);
        await sleep(2000);
        try {
            await disconnectBle();
        } finally {
            setLoading(false);
        }
    };


    const label  = ble.connected ? (ble.notifying ? "Ready" : "Connecting…") : "Disconnected";
    const colour = ble.connected ? (ble.notifying ? "#35b931" : "#f5a623") : "#d13a30";

    useEffect(() =>  onBleState(s => { console.log("BLE", s); setBle(s); }),[]);

    function sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return(
        <div className="flex justify-center items-center">
            <div className="relative flex flex-row gap-10 bg-gradient-to-br from-slate-700/50 to-slate-900/50 backdrop-blur-lg shadow-2xl rounded-3xl min-w-[1250px] min-h-[700px]">
                <div className="grid grid-cols-[1fr_300px] gap-2 items-center mx-auto max-w-[1000px] w-full">
                    {/* Left: Image & controls */}
                    <div className="flex flex-col items-center gap-4 w-[88%]">
                        {/* Image */}
                        <div className="relative overflow-hidden py-8 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-500 flex flex-col gap-2 items-center justify-center shadow-inner">
                            <img
                                src={wiper_washer_trainer}
                                alt="Wiper-Washer Trainer"
                                className="w-[90%] rounded-lg h-full object-contain"
                            />
                        

                        {/* Buttons */}
                        <div className="relative mt-4 flex flex-col items-center">
                        <button
                            disabled={loading || ble.connected}
                            onClick={handleConnect}
                            className={`
                            flex flex-row items-center justify-center gap-2 rounded-full
                            px-6 py-3 text-white shadow-md transition-all duration-300 ease-in-out 
                            bg-gradient-to-r from-green-600 via-green-700 to-green-800 shadow-green-900 hover:shadow-green-800
                            w-60 text-lg
                            ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                            `}
                        >
                            {loading ? (
                            <>
                                {ble.connected ? "Disconnecting..." : "Connecting..."}
                                <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                            </>
                            ) : ble.connected ? (
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

                        {/* Disconnect button */}
                        <button
                            onClick={handleDisconnect}
                            disabled={!ble.connected}
                            className={`
                            absolute -top-3 -right-3 rounded-full p-2 bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-md text-white
                            transition-opacity duration-300 ${ble.connected ? 'opacity-100' : 'opacity-0 pointer-events-none'}
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

                    {/* Right: Description */}
                    <div className="flex flex-col justify-center text-white w-full max-w-[350px]">
                        <h2 className="text-3xl font-bold mb-2 text-center">Air Conditioner Trainer</h2>
                        <p className="text-gray-300 text-sm pb-5">
                        Simulates and diagnoses air conditioner trainer. Use the connect button to establish a Bluetooth connection and monitor live data or read/clear trouble codes.
                        </p>
                        <div className="flex flex-col w-full gap-4">
                            <button
                                onClick={() => navigate('/trainer/wiper-washer/read-data')}
                                className='inline-block w-full text-center min-w-[200px] px-5 py-4 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px'>
                                Read Live Data
                            </button>
                            <button
                                onClick={() => navigate('/trainer/wiper-washer/read-codes')}
                                className='inline-block w-full text-center min-w-[200px] px-5 py-4 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px'>
                                Read Trouble Codes
                            </button>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
        
    )
}