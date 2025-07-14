import { useNavigate } from "react-router-dom"
import { disconnectBle, onBleState } from "./bluetooth/core";
import { useEffect, useState } from "react";


export default function Header({setShowModal}) {
    const navigate =useNavigate();
     const [ble, setBle] = useState({connected: false, notifying: false});

    const handleCleanup = async (path) => {
        try{
            if(ble.connected){
                setShowModal(true);
                await sleep(3000);
                await disconnectBle();
                console.log("Disconnected ble DEVICEEEE");
            }
            if(path) navigate(path);
        }catch(e){
            console.log("error disconnecting ble: ", e)
        }finally{
            setShowModal(false);
        }
    }

    useEffect(() => {
        const unsubscribe = onBleState(setBle);
        return () => {
            unsubscribe();
        };
    }, []);

    function sleep(ms){ //Temporary sleep function for ui smoothness
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return (
        <div className="flex flex-row items-center justify-center gap-5 p-6">
            <a href='https://www.atechtraining.com/' target='blank'><img src="../atechlogo.webp" className="w-32"/></a>
            <div className="flex items-center gap-10">
                <button 
                    onClick={() => handleCleanup("/")}
                    className="text-lg text-white">
                    Home
                </button>
                <button 
                    onClick={()=> handleCleanup("/trainers")}
                    className="text-lg text-white">
                    Trainers
                </button>
                <button 
                    onClick={() => handleCleanup(null)}
                    className="text-lg text-white">
                    Help
                </button>
            </div>
        </div>
    )
}