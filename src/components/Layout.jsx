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

function HeroWithSidebar() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-sans">
      {/* Wrapper */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-6 py-16 gap-10">

        {/* Left Hero Text */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-4">
            <span className="bg-blue-800 text-blue-300 text-sm px-3 py-1 rounded-full">
              What’s new
            </span>
            <span className="ml-2 text-sm text-gray-400">Just shipped v1.0 →</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Deploy to the cloud <br /> with confidence
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
            Elit sunt amet fugiat veniam occaecat.
          </p>

          <div className="flex gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg">
              Get started
            </button>
            <button className="text-white hover:underline flex items-center gap-1">
              Learn more →
            </button>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="bg-[#1e293b] rounded-2xl shadow-lg w-full md:w-[320px] p-6">
          <div className="mb-6 text-lg font-bold">Navigation</div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer">Projects</li>
            <li className="hover:text-white cursor-pointer">Deployments</li>
            <li className="hover:text-white cursor-pointer">Activity</li>
            <li className="hover:text-white cursor-pointer">Domains</li>
            <li className="hover:text-white cursor-pointer">Usage</li>
            <li className="hover:text-white cursor-pointer">Settings</li>
          </ul>

          <div className="mt-8 text-sm text-gray-400">Your teams</div>
          <ul className="mt-2 space-y-1 text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer">Planetaria</li>
            <li className="hover:text-white cursor-pointer">Protocol</li>
            <li className="hover:text-white cursor-pointer">Tailwind Labs</li>
          </ul>

          <div className="mt-6 pt-6 border-t border-gray-700 flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <p className="text-white">Benjamin Button</p>
              <p className="text-gray-400">@benjbutt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
