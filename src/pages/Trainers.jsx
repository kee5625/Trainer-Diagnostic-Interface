import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Trainers(){
    const navigate = useNavigate();

    return(
        <div>
            <h1 className='flex justify-center items-center mb-4 text-3xl font-semibold leading-none tracking-tight  text-white '>Choose your trainer:</h1>
            <div className="grid grid-cols-1 gap-5 mt-12 list-none md:grid-cols-3 lg:mt-24 max-w-5xl mx-auto" role="list">
                <article 
                    onClick={() => navigate("/power-seat")}
                    className="rounded-xl mx-auto shadow-xl bg-contain bg-no-repeat bg-top max-h-[500px] relative border-8 border-black transform duration-500 hover:-translate-y-6 group" 
                    style={{backgroundImage: "url('/bg_power_seat.png')"}}>
                    
                    <div className="bg-black relative h-full group-hover:bg-opacity-0 max-h-[500px] flex flex-wrap flex-col pt-[21rem] hover:bg-opacity-75 transform duration-300">
                        <div className=" bg-black p-8 h-full justify-end flex flex-col">
                            <h1 className="text-white mt-2 text-xl mb-5 transform  translate-y-20 uppercase group-hover:translate-y-0 duration-300 group-hover:text-orange-500"> 01⏤ Power Seat  </h1>
                            <p className="opacity-0 text-white text-xl group-hover:opacity-80 transform duration-500 ">  Simulating power seat functions & controls </p>
                        </div>
                    </div>
                </article>
                <article
                    onClick={() => navigate("/air-conditioner")} 
                    className="rounded-xl mx-auto  shadow-xl bg-cover bg-center max-h-[500px] relative border-8 border-black  transform duration-500 hover:-translate-y-6   group" 
                    style={{backgroundImage: "url('/bg_ac.png')"}}>
                    <div className="bg-black relative h-full group-hover:bg-opacity-0 max-h-[500px]  flex flex-wrap flex-col pt-[21rem] hover:bg-opacity-75 transform duration-300">
                        <div className=" bg-black p-8 h-full justify-end flex flex-col">
                            <h1 className="text-white mt-2 text-xl mb-5 transform  translate-y-20 uppercase group-hover:translate-y-0 duration-300 group-hover:text-indigo-400"> 02⏤ Air Conditioning </h1>
                            <p className="opacity-0 text-white text-xl group-hover:opacity-80 transform duration-500 "> Demonstrating automotive diagnostics and simulations </p>
                        </div>
                    </div>
                </article>
                <article 
                    onClick={() => navigate("/wiper-washer")}
                    className="rounded-xl mx-auto  shadow-xl bg-cover bg-center max-h-[500px] relative border-8 border-black  transform duration-500 hover:-translate-y-6   group" 
                    style={{backgroundImage: "url('/bg_wiper_washer.png')"}}>
                    <div className="bg-black relative h-full group-hover:bg-opacity-0 max-h-[500px]  flex flex-wrap flex-col pt-[21rem] hover:bg-opacity-75 transform duration-300">
                        <div className=" bg-black p-8 h-full justify-end flex flex-col">
                            <h1 className="text-white mt-2 text-xl mb-5 transform  translate-y-20 uppercase group-hover:translate-y-0 duration-300 group-hover:text-cyan-400"> 03⏤ Windshield Wiper </h1>
                            <p className="opacity-0 text-white text-xl group-hover:opacity-80 transform duration-500 "> Running wiper simulations with accuracy </p>
                        </div>
                    </div>
                </article>
            </div> 
        </div>
    )
}

