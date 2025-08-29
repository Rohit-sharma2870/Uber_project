import React, { useRef } from 'react';
import { FaUserCircle, FaRupeeSign, FaChevronDown } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsCashStack } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Confirmridepopup({ setconfirmride,setridepopup,ride}) {
  const navigate=useNavigate()
  const OTPref=useRef();
const handlesubmit = async (e) => {
  e.preventDefault();
  const otp = OTPref.current.value;

  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/rides/start-ride",
      {
      rideid:ride._id,
        otp,
      },
      { withCredentials: true }
    );
if(res.status==200){
   setconfirmride(false);
    setridepopup(false);
    navigate('/capitan-ride',{state:{ride:ride}})
}
   OTPref.current.value='';
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className=" flex flex-col bg-white rounded-t-2xl shadow-2xl p-5 mx-auto">
      
      {/* Close Icon */}
      <div
        onClick={() =>{setconfirmride(false)}}
        className="text-3xl self-center text-gray-400 hover:text-gray-600 cursor-pointer mb-4"
      >
        <FaChevronDown />
      </div>

      {/* Heading */}
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-5">
        Confirm this ride to start
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
            <h4 className="font-semibold text-lg capitalize">{ride?.user?.firstname +" " +ride?.user?.lastname}</h4>
            <p className="text-sm text-gray-500">Nearby driver</p>
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
          <p className="text-sm text-gray-600">{ride?.pickup}</p>
        </div>
      </div>

      {/* Drop Location */}
      <div className="flex gap-4 items-start border-b border-gray-200 py-3">
        <FaLocationDot className="text-2xl text-red-500 mt-1" />
        <div>
          <h5 className="text-lg font-medium">Plot 78, Arera Colony</h5>
          <p className="text-sm text-gray-600">{ride?.destination}</p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="flex gap-4 items-start border-b border-gray-200 py-3">
        <BsCashStack className="text-2xl text-green-600 mt-1" />
        <div>
          <div className="flex items-center text-xl font-bold text-gray-800">
            <FaRupeeSign className="mr-1" />{ride?.fare}
          </div>
          <p className="text-sm text-gray-600">Payment Method: Cash</p>
        </div>
      </div>

    <form action="" onSubmit={(e)=>{handlesubmit(e)}}>
      <input ref={OTPref} type="text" placeholder='Enter OTP'  className='px-12 py-3  bg-[#eee] rounded-lg text-lg w-full mt-6'/>
       {/* Confirm Button */}
      <button
        type='submit'
        className="flex justify-center items-center w-full mt-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 transition text-white text-lg font-semibold shadow"
      >
        Confirm 
      </button>
      {/* Ignore Button */}
      <button
        onClick={()=>
        {setconfirmride(false);
        setridepopup(false)
        }}
        className="w-full mt-3 py-3 rounded-lg bg-red-500 hover:bg-red-600 transition text-white text-lg font-semibold shadow"
      >
       Cancel
      </button>
    </form>
    </div>
  );
}
export default Confirmridepopup;
