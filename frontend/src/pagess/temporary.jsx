import React, { useState,useRef } from 'react';
import {useGSAP} from '@gsap/react'
import { gsap } from 'gsap/gsap-core';
import Capitandetails from '../components/Capitandetails';
import Ridepopup from '../components/Ridepopup';
const Capitanhome = () => {
 const Ridepopupref=useRef();
  const[ridepopup,setridepopup]=useState(false);
      useGSAP(()=>{
    if(ridepopup){
      gsap.to(Ridepopupref.current,{
   transform:"translateY(0)"
    })
    }
    else{
       gsap.to(Ridepopupref.current,{
   transform:"translateY(100%)"
    })
    }
  },[ridepopup])
  return (
    <div className='h-screen fixed  w-full flex flex-col'>
      {/* Top Half - Image */}
      <div className='h-3/5'>
        <img 
          className='w-full h-full object-cover' 
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" 
          alt="Loading Animation" 
        />
      </div>
      {/* Bottom Half - Info Card */}
      <div className="h-2/5 bg-white rounded-t-3xl shadow-xl py-5 px-6 overflow-y-auto relative">
        <Capitandetails setridepopup={setridepopup}/>
      </div>
            <div ref={Ridepopupref} className="w-full p-2 absolute bottom-0 translate-y-full z-10 bg-white">
        <Ridepopup/>
</div>  
    </div>  
  );
};


export default Capitanhome;