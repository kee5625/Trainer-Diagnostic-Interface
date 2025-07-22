import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import Modal from "./Modal";

function Layout() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div
    style={{
    background: `radial-gradient(at 71% 36%, #12233b 0px, transparent 50%),
                 radial-gradient(at 24% 42%, #11335f 0px, transparent 50%),
                 radial-gradient(at 65% 78%, #373434 0px, transparent 50%), 
                 radial-gradient(at 7% 88%, #0c1b1d 0px, transparent 50%), 
               #000000`,
    }} 
    className="min-h-screen text-white font-sans antialiased flex flex-col">
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto">
        <div className='grid grid-rows-[auto_1fr] h-full'>
          <Header setShowModal={setShowModal} className="row-start-1"/>
          <div className="row-start-2 w-full h-full flex justify-center items-center">
            <Outlet />
          </div>
        </div>
        
      </div>

      {showModal && (
        <Modal />
      )}

    </div>
  );
}

export default Layout;
