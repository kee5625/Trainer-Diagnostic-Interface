import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div
    style={{
    background: `radial-gradient(at 71% 36%, #12233b 0px, transparent 50%),
                 radial-gradient(at 24% 42%, #11335f 0px, transparent 50%),
                 radial-gradient(at 65% 78%, #373434 0px, transparent 50%), 
                 radial-gradient(at 7% 88%, #0c1b1d 0px, transparent 50%), 
               #000000`,
    }} 
    className="min-h-screen  text-white font-sans antialiased flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-6 py-16 gap-10">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
