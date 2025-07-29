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
    className="min-h-screen w-full text-white font-sans antialiased flex flex-col fixed inset-0 overflow-auto">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 relative z-10">
        <Header setShowModal={setShowModal} />
      </div>
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 pb-4 sm:pb-6 relative z-10">
        <Outlet />
      </div>

      {showModal && (
        <Modal />
      )}

    </div>
  );
}

export default Layout;
