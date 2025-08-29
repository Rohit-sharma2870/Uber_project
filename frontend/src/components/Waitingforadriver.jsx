import React from 'react'
import { FaUserCircle, FaRupeeSign, FaChevronDown } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsCashStack } from "react-icons/bs";

import {Link} from 'react-router-dom'

function Waitingforadriver({setwaitingfordriver,ride}){
 return (
     <div className="p-4 flex flex-col justify-between mt-3 bg-white rounded-lg">
      
       <div
         onClick={()=>{setwaitingfordriver(false)}}
         className="w-full text-3xl p-2 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
       >
         <FaChevronDown />
       </div >
       <h3 className="text-2xl font-bold text-center mb-4">Waiting for a driver</h3>
      <div className='flex items-center justify-between p-4'>
        <div className='flex items-center justify-center'><img className='w-40 h-30 mb-2' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" /></div>
        <div>
            <h4 className='text-2xl font-semibold'>{ride?.capitan?.firstname +" "+ride?.capitan?.lastname}</h4>
            <h3 className='text-xl font-medium'>{ride?.capitan?.vehicle.plate}</h3>
            <h2 className='text-lg font-normal'>maruti suzuki alto</h2>
            <h2 className='text-lg font-normal'>OTP: {ride?.otp}</h2>
        </div>
      </div>
       <div className="flex items-start gap-3 border-b border-gray-300 px-2 py-3">
         <FaUserCircle className="text-2xl text-gray-600 mt-1" />
         <div>
           <h4 className="text-lg font-semibold">562/11-A</h4>
           <p className="text-gray-600">{ride?.pickup}</p>
         </div>
       </div>
 
       <div className="flex items-start gap-3 border-b border-gray-300 px-2 py-3">
         <FaLocationDot className="text-xl text-red-500 mt-1" />
         <div>
           <h4 className="text-lg font-semibold">562/11-A</h4>
           <p className="text-gray-600">{ride?.destination}</p>
         </div>
       </div>
       
       <div className="flex items-start gap-3 border-b border-gray-300 px-2 py-3">
         <BsCashStack className="text-xl text-green-600 mt-1" />
         <div>
           <div className="flex items-center text-xl font-semibold text-gray-800">
             <FaRupeeSign className="mr-1" />{ride?.fare}
           </div>
           <p className="text-gray-600 text-sm">Payment Method: Cash</p>
         </div>
       </div>
       <button className="w-full mt-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 transition text-white text-lg font-semibold">make a payment</button>
     </div>
   );
}
export default Waitingforadriver
