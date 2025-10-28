import React, { useEffect, useState } from 'react';
import { MapIcon } from 'lucide-react';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="text-zinc-900 flex items-center justify-center h-screen">
      <div
        className={`flex flex-col items-center text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
      >
        <MapIcon
          size={100}
          className="text-green-600 flex items-center drop-shadow-md mb-4"
        />
        <span className="text-5xl font-semibold mb-2">Report potholes,</span>
        <span className="text-3xl mb-4">Build Better Pakistan</span>
        <span className="text-lg max-w-xl mb-6">
          Join the movement to make Pakistan's roads safer. Upload photos, tag
          authorities, and help create better infrastructure for everyone.
        </span>
        <button className="bg-green-500 hover:scale-105 active:scale-95 transition-all px-6 rounded-2xl text-white text-2xl py-2 shadow-md">
          Report a pothole
        </button>
        <span className='text-2xl mt-10 mb-5' >How it Works</span>
        <div className="flex flex-row gap-4">
          <div className="w-fit h-fit p-4 flex items-center justify-center  rounded-2xl">
            <span className='text-xl items-center justify-center flex flex-col ' ><span className='bg-green-500 text-white mb-2 rounded-2xl px-4 py-1 w-fit ' >1</span>Spot & Snap <span className='text-sm w-fit' >See a pothole? Take a photo with your phone</span> </span>
          </div>
          <div className="w-fit h-fit p-4 flex items-center justify-center  rounded-2xl">
            <span className='text-xl items-center justify-center flex flex-col ' ><span className='bg-green-500 text-white mb-2 rounded-2xl px-4 py-1 w-fit ' >2</span>Upload & Tag <span className='text-sm w-fit' >Upload the photo and tag your location</span> </span>
          </div>
          <div className="w-fit h-fit p-4 flex items-center justify-center  rounded-2xl">
            <span className='text-xl items-center justify-center flex flex-col ' ><span className='bg-green-500 text-white mb-2 rounded-2xl px-4 py-1 w-fit ' >3</span>Get It Fixed <span className='text-sm w-fit' >Authorities are notified and track the repair</span> </span>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default Home;
