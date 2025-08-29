import React from 'react'
import { FaUserCircle, FaRupeeSign } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsCashStack } from "react-icons/bs";
import { IoMdHome } from "react-icons/io";
import { CiTimer } from "react-icons/ci";
import { useContext } from 'react';
import { Capitancontext } from '../contexts/capitancontent';
function Capitandetails({setridepopup}) {
  const{capitan}=useContext(Capitancontext);
  return (
 <div>
       <div onClick={()=>{
        setridepopup(true);
       }} className='flex justify-between items-center mb-6 mt-6'>
          <div className='flex items-center gap-4'>
            <img 
              className='w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-sm' 
              src="https://media.istockphoto.com/id/1470035625/photo/driver-transporting-a-business-man-on-a-crowdsourced-taxi.jpg?s=612x612&w=0&k=20&c=HbVWN87JGim9g0CDhh2NHPM8oZ1g4qVGx86vxJ5RM24=" 
              alt="Driver" 
            />
            <h4 className='font-semibold text-xl text-gray-800 capitalize'>{capitan?.firstname +" " +capitan?.lastname}</h4>
          </div>
          <div className='text-right'>
            <h4 className='font-bold text-2xl text-green-600'>₹295.20</h4>
            <p className='text-gray-600 font-medium'>Earned today</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className='flex justify-around text-center bg-gray-100 p-4 rounded-lg mt-4'>
          <StatBlock icon={<CiTimer />} value="10.2" label="Hours Online" />
          <StatBlock icon={<BsCashStack />} value="12" label="Trips Completed" />
          <StatBlock icon={<FaLocationDot />} value="35 km" label="Distance Driven" />
        </div>
 </div>
  )
}
// Reusable Stat Block
const StatBlock = ({ icon, value, label }) => (
  <div className='flex flex-col items-center gap-1'>
    <div className='text-2xl text-blue-500'>{icon}</div>
    <h4 className='font-semibold text-lg text-gray-800'>{value}</h4>
    <p className='text-sm text-gray-500'>{label}</p>
  </div>
);

export default Capitandetails
