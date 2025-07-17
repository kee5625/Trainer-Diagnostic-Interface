// src/pages/home/HomePage.tsx
import AtechLogo from '/atechlogo.webp';

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { disconnectBle } from '../components/bluetooth/core';
import Header from '../components/Header';


function HomePage (){
  useEffect(() => {
    disconnectBle();
  })
  
  const navigate = useNavigate();
  return (
    <div className="row-start-2 flex items-center justify-end min-h-[500px] flex-col px-4">
        {/*<a href="https://www.atechtraining.com/" target="_blank" rel="noreferrer">
          <img src={AtechLogo} className="" alt="Atech logo" />
        </a>*/}
        <h1 className='text-4xl md:text-6xl font-bold leading-tight mb-6'>Trainer Diagnostic Interface</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl text-center">
          This is the Trainer Diagnostic Interface, a tool designed to help you view live data, read and clear trouble codes
          from various Atech Trainers.
        </p>
        
        <div className='flex flex-col md:flex-row gap-4'>
          <button 
            onClick={() => navigate("/trainers")}
            className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg">
            Get started
          </button>

          {/*Hyperlink to Atech Website */}
          <a href='https://www.atechtraining.com/' target='blank' className='flex items-center gap-3  hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg'>
            Learn more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
              />
            </svg>

          </a>
        </div>
      </div>
    
  );
};



export default HomePage;