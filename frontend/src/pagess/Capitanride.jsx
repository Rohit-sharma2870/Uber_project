
import React, { useState } from 'react'
import { useRef } from 'react';
import { FaChevronUp } from "react-icons/fa";
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Finishride from '../components/Finishride';
import { useLocation } from 'react-router-dom';
function Capitanride() {
const location=useLocation()
const data=location.state?.ride;
    const finishpannelref=useRef()
    const [finishride,setfinishride]=useState(false);
    useGSAP(() => {
    if (finishride) {
      gsap.to(finishpannelref.current, {
      transform:"translateY(0)"
      });
    } else {
      gsap.to(finishpannelref.current, {
  transform:"translateY(100%)"
      });
    }
  }, [finishride]);

  return (
     <div className="w-full h-screen overflow-y-auto bg-gray-100">
      {/* Top Half - Image */}
      <div className="h-4/5">
        <img
          className="w-full h-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Loading Animation"
        />
      </div>
      {/* Bottom Half - Info Card */}
      <div className="h-1/5  bg-yellow-400  shadow-xl" onClick={()=>{
        setfinishride(true)
      }}>
     <div className='text-2xl font-semibold p-4 flex items-center justify-center'><FaChevronUp /></div>
     <div className='flex p-6 justify-between items-center'>
<div className='font-semibold text-2xl'>4 km away</div>
      <button className='px-8 py-2 rounded-lg text-xl text-white  font-semibold  bg-green-800'>Complete ride</button>
     </div>
      </div>
      {/* pop up */}
        <div
        ref={finishpannelref}
        className="fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-2xl shadow-lg p-4 translate-y-full"
      >
       <Finishride 
       data={data}
       setfinishride={setfinishride}/>
      </div>
      </div>
  )
}

     


export default Capitanride
