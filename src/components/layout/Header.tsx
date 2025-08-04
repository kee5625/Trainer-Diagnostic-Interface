import { useNavigate, useLocation } from "react-router-dom"
import { disconnectBle, onBleState } from "../../core/ble/core";
import { useEffect, useState } from "react";


export default function Header({setShowModal}) {
    const navigate =useNavigate();
    const location = useLocation();
    const [ble, setBle] = useState({connected: false, notifying: false});
    const [currentTab, setCurrentTab] = useState("home");

    const handleCleanup = async (path, tabName) => {
        try{
            if(ble.connected){
                setShowModal(true);
                await sleep(3000);
                await disconnectBle();
                console.log("Disconnected ble DEVICEEEE");
            }
            if(path) {
                navigate(path);
                setCurrentTab(tabName);
            }
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

    useEffect(() => {
        // Set current tab based on current route
        const path = location.pathname;
        if (path === "/") {
            setCurrentTab("home");
        } else if (path === "/trainers") {
            setCurrentTab("trainers");
        } else if (path === "/help") {
            setCurrentTab("help");
        } else {
            // For other routes (like trainer pages), don't highlight any nav tab
            setCurrentTab("");
        }
    }, [location.pathname]);

    function sleep(ms){ //Temporary sleep function for ui smoothness
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return (
        <div className="flex flex-row items-center justify-center gap-5 p-6">
            <a href='https://www.atechtraining.com/' target='blank'><img src="../atechlogo.webp" className="w-32"/></a>
            <div className="flex items-center gap-10">
                <button 
                    onClick={() => handleCleanup("/", "home")}
                    className={`text-lg transition-colors duration-200 ${
                        currentTab === "home" 
                            ? "text-blue-500 font-semibold border-b-2 border-blue-500 pb-1" 
                            : "text-white hover:text-blue-300"
                    }`}>
                    Home
                </button>
                <button 
                    onClick={()=> handleCleanup("/trainers", "trainers")}
                    className={`text-lg transition-colors duration-200 ${
                        currentTab === "trainers" 
                            ? "text-blue-500 font-semibold border-b-2 border-blue-500 pb-1" 
                            : "text-white hover:text-blue-300"
                    }`}>
                    Trainers
                </button>
                <button 
                    onClick={() => handleCleanup("/help", "help")}
                    className={`text-lg transition-colors duration-200 ${
                        currentTab === "help" 
                            ? "text-blue-500 font-semibold border-b-2 border-blue-500 pb-1" 
                            : "text-white hover:text-blue-300"
                    }`}>
                    Help
                </button>
            </div>
        </div>
    )
}