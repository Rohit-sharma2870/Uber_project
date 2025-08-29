import React from 'react'
import { FaUserCircle, FaRupeeSign, FaChevronDown } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsCashStack } from "react-icons/bs";
import { IoMdHome } from "react-icons/io";
import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react';
import { SocketContext } from '../contexts/socketcontext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
function Riding() {
  const{onMessage}=useContext(SocketContext)
  const navigate=useNavigate()
  const location=useLocation();
  const data=location.state?.ride;

  useEffect(()=>{
    onMessage('end-ride',()=>{
      navigate('/home')
    })
  })
  return (
    <div className='h-screen flex flex-col'>
       <div className='fixed top-2 right-2 p-3 flex items-center justify-center bg-gray-100 rounded-full'>
         <Link  to="/home" className=' font-medium text-2xl'><IoMdHome /></Link>
       </div>
      {/* Top Half - Image */}
      <div className='h-1/2'>
        <img 
          className='w-full h-full object-cover' 
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" 
          alt="Loading Animation" 
        />
      </div>
      {/* Bottom Half - Info Card */}
      <div className="h-1/2 bg-white rounded-t-lg shadow-lg p-4 overflow-y-auto relative">
        <h3 className="text-2xl font-bold text-center mb-4">your's ride</h3>

        {/* Driver Info */}
        <div className='flex items-center justify-between p-4'>
          <img 
            className='w-28 h-auto' 
            src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" 
            alt="Car" 
          />
          <div>
            <h4 className='text-2xl font-semibold capitalize'>{data?.user?.firstname + " "+data?.user?.lastname}</h4>
            <h3 className='text-xl font-medium'>{data?.capitan.vehicle.plate}</h3>
            <h2 className='text-lg font-normal'>Maruti Suzuki Alto</h2>
          </div>
        </div>

        {/* Pickup Location
        <div className="flex items-start gap-3 border-b border-gray-300 px-2 py-3">
          <FaUserCircle className="text-2xl text-gray-600 mt-1" />
          <div>
            <h4 className="text-lg font-semibold">562/11-A</h4>
            <p className="text-gray-600">Kankariya Tolab, Bhopal</p>
          </div>
        </div> */}

        {/* Drop Location */}
        <div className="flex items-start gap-3 border-b border-gray-300 px-2 py-3">
          <FaLocationDot className="text-xl text-red-500 mt-1" />
          <div>
            <h4 className="text-lg font-semibold">562/11-A</h4>
            <p className="text-gray-600">{data?.destination}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="flex items-start gap-3 border-b border-gray-300 px-2 py-3">
          <BsCashStack className="text-xl text-green-600 mt-1" />
          <div>
            <div className="flex items-center text-xl font-semibold text-gray-800">
              <FaRupeeSign className="mr-1" />{data?.fare}
            </div>
            <p className="text-gray-600 text-sm">Payment Method: Cash</p>
          </div>
        </div>

        {/* Payment Button */}
        <button className="w-full mt-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 transition text-white text-lg font-semibold">
          Make a Payment
        </button>
      </div>
    </div>
  )
}
export default Riding;

