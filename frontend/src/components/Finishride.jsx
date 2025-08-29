import React from 'react'
import { FaUserCircle, FaRupeeSign, FaChevronDown } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsCashStack } from "react-icons/bs";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
function Finishride({setfinishride,data}){
const navigate=useNavigate()
  const endride=async()=>{
    const res=await axios.post("http://localhost:5000/rides/finish-ride",{
      rideid:data?._id
    },{
      withCredentials:true
    })
    if(res.status===200){
    setfinishride(false)
   navigate('/capitanhome')
    }
  }
 return (
    <div className=" flex flex-col bg-white rounded-t-2xl shadow-2xl p-5 mx-auto">
      {/* Close Icon */}
      <div
        onClick={() =>{setfinishride(false)}}
        className="text-3xl self-center text-gray-400 hover:text-gray-600 cursor-pointer mb-4"
      >
        <FaChevronDown />
      </div>
      {/* Heading */}
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-5">
       Finsih your Ride
      </h3>

      {/* Driver Info */}
      <div className="flex items-center justify-between bg-yellow-100 p-3 rounded-xl mb-5">
        <div className="flex items-center gap-4">
          <img
            className="w-14 h-14 rounded-full object-cover border-2 border-gray-300 shadow-sm"
            src="https://media.istockphoto.com/id/1470035625/photo/driver-transporting-a-business-man-on-a-crowdsourced-taxi.jpg?s=612x612&w=0&k=20&c=HbVWN87JGim9g0CDhh2NHPM8oZ1g4qVGx86vxJ5RM24="
            alt="Driver"
          />
          <div>
            <h4 className="font-semibold text-lg capitalize">{data?.user?.firstname+" "+data?.user?.lastname}</h4>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-700">2.2 km</span>
        </div>
      </div>
      {/* Pickup Location */}
      <div className="flex gap-4 items-start border-b border-gray-200 py-3">
        <FaUserCircle className="text-2xl text-blue-600 mt-1" />
        <div>
          <h5 className="text-lg font-medium">562/11-A</h5>
          <p className="text-sm text-gray-600">{data?.pickup}</p>
        </div>
      </div>
      {/* Drop Location */}
      <div className="flex gap-4 items-start border-b border-gray-200 py-3">
        <FaLocationDot className="text-2xl text-red-500 mt-1" />
        <div>
          <h5 className="text-lg font-medium">562/11-A</h5>
          <p className="text-sm text-gray-600">{data?.destination}</p>
        </div>
      </div>
      {/* Payment Info */}
      <div className="flex gap-4 items-start border-b border-gray-200 py-3">
        <BsCashStack className="text-2xl text-green-600 mt-1" />
        <div>
          <div className="flex items-center text-xl font-bold text-gray-800">
            <FaRupeeSign className="mr-1" />{data?.fare}
          </div>
          <p className="text-sm text-gray-600">Payment Method: Cash</p>
        </div>
      </div>
    <div >
       {/* Confirm Button */}
      <button 
     onClick={endride}
        className="flex justify-center items-center w-full mt-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 transition text-white text-lg font-semibold shadow"
      >
      Finish ride
      </button>
    </div>
    </div>
  );
}
export default Finishride
