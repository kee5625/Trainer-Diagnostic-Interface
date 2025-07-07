import { useState, useEffect } from 'react';

import { setNotifyCallback } from '../bluetooth/core';
import { readCodes} from '../bluetooth/powerSeat';

export default function PS_RC() {
  const [code, setCode] = useState("N/A");

  /* ----- attach BLE notification handler once ----- */
  useEffect(() => {
    setNotifyCallback((ascii) => {
      console.log("[Notify]", ascii);
      setCode(ascii);
    });
  }, []);

  const fetchOnce   = async () => {await readCodes();};

  return (
    <div className="page">
      <h1>Diagnostic Trouble Codes</h1>
      <div className='startBtns'>
        <button className="actionBtn" onClick={fetchOnce}>Get Data</button>
        {/*<button className="actionBtn" onClick={startStream}>Stream Live</button>*/}
      </div>
      

      <div className="DataLineBox">
        {/* Read Demo Trouble Code ----------------------------------------------------- */}
        <div className='dataLine'>
            <div className="DataBox">
                <h2>Trouble Codes</h2>
                <p>Code: <strong>{code}</strong></p>
            </div>
        </div>
        
      </div>
    </div>
  );
}