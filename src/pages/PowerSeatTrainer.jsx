import React, { useState, useRef, useEffect } from 'react';
import { connectBle, disconnectBle, onBleState} from '../components/bluetooth/core'
import power_seat_trainer from '../assets/power_seat_trainer.webp';
import { useNavigate } from 'react-router-dom';

export default function PowerSeatHome(){
    //const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();

    const [ble, setBle] = useState({connected: false, notifying: false});
    const [loading, setLoading] = useState(false);


    useEffect(() => onBleState(s => { console.log('BLE', s); setBle(s); }), []);

    const handleConnect = async () => {
        setLoading(true);
        try {
            await connectBle();
        } finally {
            setLoading(false);
        }
    };
    const handleDisconnect = async () => {
        setLoading(true);
        try {
            await disconnectBle();
        } finally {
            setLoading(false);
        }
    };

    const connectionLabel = ble.connected ? 'Connected' : 'Disconnected';
    const connectionColor = ble.connected ? '#35b931' : '#d13a30';

    const label  = ble.connected ? (ble.notifying ? "Ready" : "Connecting…") : "Disconnected";
    const colour = ble.connected ? (ble.notifying ? "#35b931" : "#f5a623") : "#d13a30";

    useEffect(() =>  onBleState(s => { console.log("BLE", s); setBle(s); }),[]);

    return(
        <div className='flex items-center  justify-center'>
            <div className="w-fit">
                {/* 2-column grid ― first row = image + action buttons */}
                <div className="grid md:grid-cols-[auto_260px] gap-10 items-center ">

                    {/* ── left column ── image */}
                    <img
                    src={power_seat_trainer}
                    alt="Power-Seat trainer"
                    className="rounded-xl shadow-lg  md:w-[800px] "
                    />

                    {/* ── right column ── action buttons */}
                    <div className="flex flex-col items-center gap-8 min-w-[250px] self-center">
                        <button
                            onClick={() => ble.connected ? handleDisconnect() : handleConnect()}
                            className={ble.connected ? "bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-lg shadow-red-900 text-white px-6 py-4 rounded-2xl hover:shadow-red-800 hover:shadow-lg"
                            : "bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white shadow-lg shadow-green-800 font-semi px-6 py-4 rounded-2xl disabled:opacity-40 hover:shadow-lg hover:shadow-green-900"}
                            >
                            {loading ? (
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                            ) : ble.connected ? "Disconnect Bluetooth Device" : "Connect To Bluetooth Device"}
                        </button>
                        <button
                            onClick={() => navigate('/trainer/power-seat/read-data')}
                            className='inline-block w-full text-center min-w-[200px] px-6 py-8 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px'>
                            Read Live Data
                        </button>
                        <button
                            onClick={() => navigate('/trainer/power-seat/read-codes')}
                            className='inline-block w-full text-center min-w-[200px] px-6 py-8 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px'>
                            Read Trouble Codes
                        </button>
                        <button
                            onClick={() => navigate('/trainer/power-seat/clear-codes')}
                            className='inline-block w-full text-center min-w-[200px] px-6 py-8 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px'>
                            Clear Trouble Codes
                        </button>
                    </div>

                    {/* ── second row, first column ── connection controls */}
                    <div className="pt-2 items-center flex justify-center flex-col hidden">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleConnect}
                                disabled={ble.connected}
                                className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white shadow-lg shadow-green-800 font-semi px-6 py-4 rounded-2xl disabled:opacity-40 hover:shadow-lg hover:shadow-green-900"
                                >
                                Connect To Bluetooth Device
                            </button>

                            <button
                            onClick={handleDisconnect}
                            className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-lg shadow-red-900 text-white px-6 py-4 rounded-2xl hover:shadow-red-800 hover:shadow-lg"
                            >
                            Disconnect Bluetooth Device
                            </button>
                        </div>

                        <p className="pt-5 items-center">
                            Connection State:{' '}
                            <strong style={{ color: connectionColor }}>{connectionLabel}</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
    )
}