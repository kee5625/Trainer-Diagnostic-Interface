import TabNav from "../components/TabNav"
import { useState } from 'react';
import { connectBle, disconnectBle} from '../components/bluetooth'

export default function PowerSeatHome(){
    const [isConnected, setIsConnected] = useState(false);

    //Event handler for connect btn
    const handleConnect = async () => {
        const connected = await connectBle();
        setIsConnected(connected);
    };

    //Event handler for disconnect btn
    const handleDisconnect = async () => {
        await disconnectBle();
        setIsConnected(false);
    };

    const connectionLabel = isConnected ? 'Connected' : 'Disconnected';
    const connectionColor = isConnected ? '#35b931' : '#d13a30';

    return(
        <div className="page">
            <h1>Power Seat Trainer</h1>
            <div className="card">
                <button onClick={handleConnect} className="connectionOnButton" disabled={isConnected}>
                Connect To Bluetooth Device
                </button>
                <button onClick={handleDisconnect} className="connectionOffButton" disabled={!isConnected}>
                Disconnect Bluetooth Device
                </button>
            </div>

            <p className="gray-label">
                Connection State:{' '}
                <strong style={{color: connectionColor}}>{connectionLabel}</strong>
            </p>
            <TabNav trainer="PS" Disabled ={!isConnected}/>
        </div>
    )
}