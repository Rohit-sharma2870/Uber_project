import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Capitandetails from '../components/Capitandetails';
import Ridepopup from '../components/Ridepopup';
import Confirmridepopup from '../components/Confirmridepopup';
import { useContext,useEffect } from 'react';
import { Capitancontext } from '../contexts/capitancontent';
import { SocketContext } from '../contexts/socketcontext';
import axios from 'axios';
const Capitanhome = () => {
  const Ridepopupref = useRef();
   const confirmridepopupref = useRef();
  const [ridepopup, setridepopup] = useState(false);
  const[ride,setride]=useState([])
  const[confirmride,setconfirmride]=useState(false);
    const{capitan}=useContext(Capitancontext);
    const{ sendMessage,onMessage}=useContext(SocketContext)
    //useeffect
useEffect(() => {
  if (!capitan?._id) return;
  // Join as capitan
  sendMessage("join", { usertype: "capitan", userid: capitan._id});
  // Send location
  const updateLocation = () => {
    if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log("📍 Position received:", position.coords);
    sendMessage("update-locations", {
      userid: capitan._id,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  },
  (error) => {
    console.error(" Geolocation error:", error);
  }
);

    }
  };
  updateLocation();
  const interval = setInterval(updateLocation, 10000);
  return () => clearInterval(interval);
}, [capitan?._id, sendMessage]);

onMessage('new-ride',(data)=>{
console.log(data)
setride(data)
setridepopup(true)
})
async function confirmridedata(){
const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/rides/confirm-ride`,
    { rideid: ride._id },
    { withCredentials: true }
  );
  console.log("Ride confirmed:", response.data);
setridepopup(false);
setconfirmride(true);
}
  useGSAP(() => {
    if (ridepopup) {
      gsap.to(Ridepopupref.current,{
      transform:"translateY(0)"
      });
    } else {
      gsap.to(Ridepopupref.current,{
  transform:"translateY(100%)"
      });
    }
  }, [ridepopup]);

  useGSAP(() => {
    if (confirmride) {
      gsap.to(confirmridepopupref.current, {
      transform:"translateY(0)"
      });
    } else {
      gsap.to(confirmridepopupref.current, {
  transform:"translateY(100%)"
      });
    }
  }, [confirmride]);

  return (
    <div className="relative w-full h-screen overflow-y-auto bg-gray-100">
      {/* Top Half - Image */}
      <div className="h-[60vh]">
        <img
          className="w-full h-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Loading Animation"
        />
      </div>
      {/* Bottom Half - Info Card */}
      <div className="min-h-[40vh] bg-white rounded-t-3xl shadow-xl py-6 px-6">
        <Capitandetails setridepopup={setridepopup} />
      </div>

      {/* Popup - fixed, animated from bottom */}
      <div
        ref={Ridepopupref}
        className="fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-2xl shadow-lg p-4 translate-y-full"
      >
        <Ridepopup 
        ride={ride}
        setridepopup={setridepopup}
         setconfirmride={setconfirmride}
         confirmridedata={confirmridedata}
         />
      </div>
        <div
       
        ref={confirmridepopupref}
        className=" h-screen fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-2xl shadow-lg  translate-y-full"
      >
        <Confirmridepopup  ride={ride} setconfirmride={setconfirmride} setridepopup={setridepopup}/>
      </div>
    </div>
  );
};
export default Capitanhome;
