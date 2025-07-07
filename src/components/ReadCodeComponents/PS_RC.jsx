import { useState, useEffect } from 'react';

import { setNotifyCallback } from '../bluetooth/core';
import { requestDTC} from '../bluetooth/powerSeat';

export default function PS_RC() {
  const [pCode, setPCode] = useState("N/A");
  const [cCode, setCCode] = useState("N/A");
  const [bCode, setBCode] = useState("N/A");
  const [uCode, setUCode] = useState("N/A");

  /* ----- attach BLE notification handler once ----- */
  useEffect(() => {
    setNotifyCallback((ascii) => {
      console.log("[Notify]", ascii);
      setCode(ascii);
    });
  }, []);

  const fetchOnce   = async () => {await requestDTC();};

  return (
    <div className="flex items-center flex-col justify-center">
      <h1 className='text-2xl'>Diagnostic Trouble Codes</h1>
      <div className='gap-5 pb-16 flex p-5 flex-row justify-center'>
        <button 
          className="inline-block w-full text-center text-lg min-w-[200px] px-6 py-6 text-white transition-all rounded-2xl shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-b dark:shadow-blue-900 shadow-blue-200 hover:shadow-2xl hover:shadow-blue-400 hover:-tranneutral-y-px"
          onClick={fetchOnce}>
            Get Data
        </button>
      </div>
      
      <div className="w-[820px] h-[300px] mx-auto relative flex flex-col text-slate-300 bg-slate-800 shadow-md rounded-lg overflow-hidden">
        <table className="w-full h-full table-fixed text-left">
          <thead className=''>
            <tr className="bg-slate-700">
              <th className="w-[20%] px-4 py-2 border-b border-slate-600 text-lg font-medium text-slate-200">
                Category
              </th>
              <th className="w-[20%] px-4 py-2 border-b border-slate-600 text-lg font-medium text-slate-200">
                Code
              </th>
              <th className="w-[60%] px-4 py-2 border-b border-slate-600 text-lg font-medium text-slate-200">
                Definition
              </th>
            </tr>
          </thead>
          <tbody className="align-middle">
            <tr className="hover:bg-slate-700">
              <td className="px-4 py-3 border-b border-slate-700 font-semibold text-slate-100">
                P - Powertrain
              </td>
              <td className="px-4 py-3 border-b border-slate-700">
                {pCode}
              </td>
              <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                Powertrain system diagnostic trouble code description.
              </td>
            </tr>
            <tr className="hover:bg-slate-700">
              <td className="px-4 py-3 border-b border-slate-700 font-semibold text-slate-100">
                C - Chassis
              </td>
              <td className="px-4 py-3 border-b border-slate-700">
                {cCode}
              </td>
              <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                Chassis system diagnostic trouble code description.
              </td>
            </tr>
            <tr className="hover:bg-slate-700">
              <td className="px-4 py-3 border-b border-slate-700 font-semibold text-slate-100">
                B - Body
              </td>
              <td className="px-4 py-3 border-b border-slate-700">
                {bCode}
              </td>
              <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                Body system diagnostic trouble code description.
              </td>
            </tr>
            <tr className="hover:bg-slate-700">
              <td className="px-4 py-3 font-semibold text-slate-100">
                U - Network
              </td>
              <td className="px-4 py-3">
                {uCode}
              </td>
              <td className="px-4 py-3 text-slate-300">
                Network communication diagnostic trouble code description.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}