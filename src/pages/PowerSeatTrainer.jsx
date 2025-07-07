import React, { useState, useRef, useEffect } from 'react';
import { connectBle, disconnectBle, onBleState} from '../components/bluetooth/core'
import power_seat_trainer from '../assets/power_seat_trainer.webp';
import { useNavigate } from 'react-router-dom';

export default function PowerSeatHome(){
    //const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();

    const [ble, setBle] = useState({connected: false, notifying: false});

    useEffect(() => onBleState(s => { console.log('BLE', s); setBle(s); }), []);

    const handleConnect = () => connectBle();
    const handleDisconnect = () => disconnectBle();

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
                            {ble.connected ? "Disconnect Bluetooth Device" : "Connect To Bluetooth Device"}
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