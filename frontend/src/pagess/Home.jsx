import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useContext } from "react";
import { Usercontext } from "../contexts/usercontext";
import { SocketContext } from "../contexts/socketcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Locationsearchpannel from "../components/Locationsearchpannel";
import Vehiclepannel from "../components/Vehiclepannel";
import Confirmride from "../components/Confirmride";
import Lookingfordriver from "../components/Lookingfordriver";
import Waitingforadriver from "../components/Waitingforadriver";
function Home(){
  const navigate=useNavigate()
  const pannel = useRef();
  const vehiclepanel = useRef();
  const confirmridepannel = useRef();
  const vehiclefoundref = useRef();
  const Waitingforadriverref = useRef();
  const [panelopen, setpanelopen] = useState(false);
  const [vehicleopen, setvehicleopen] = useState(false);
  const [confirmride, setconfirmride] = useState(false);
  const [vehiclefound, setvehiclefound] = useState(false);
  const [Waitingfordriver, setwaitingfordriver] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [activeField, setActiveField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fare, setfare] = useState({});
  const [vehicletype, setvehicletype] = useState(null);
  const[ride,setride]=useState(null)
  const{sendMessage,onMessage}=useContext(SocketContext)
  const{user}=useContext(Usercontext)
  //useeffect
useEffect(() => {
  if (user && user._id){
      setTimeout(() => {
      sendMessage("join", { usertype: "user", userid: user._id });
    }, 500);
  }
  onMessage('ride-confirmed',ride=>{
    setride(ride)
  setvehiclefound(false)
   setvehicleopen(false)
   setconfirmride(false)
   setwaitingfordriver(true);
  })
  onMessage('start-ride',ride=>{
   setwaitingfordriver(false);
   navigate('/riding',{state:{ride:ride}})
  })
}, [user]);
  // Animations
  useGSAP(() => {
    gsap.to(pannel.current, {
      height: panelopen ? "70%" : "0",
      padding:panelopen ? 20 : 0,
      duration: 0.4,
    });
  }, [panelopen]);
  useGSAP(() => {
    gsap.to(vehiclepanel.current, {
      transform: vehicleopen ? "translateY(0)" : "translateY(100%)",
         padding:vehicleopen? 20 : 0,
      duration: 0.3,
    });
  }, [vehicleopen]);
  useGSAP(() => {
    gsap.to(confirmridepannel.current, {
      transform: confirmride ? "translateY(0)" : "translateY(100%)",
         padding:confirmride ? 20 : 0,
      duration: 0.3,
    });
  }, [confirmride]);
  useGSAP(() => {
    gsap.to(vehiclefoundref.current, {
      transform: vehiclefound ? "translateY(0)" : "translateY(100%)",
         padding:vehiclefound ? 20 : 0,
      duration: 0.3,
    });
  }, [vehiclefound]);
  useGSAP(() => {
    gsap.to(Waitingforadriverref.current, {
      transform: Waitingfordriver ? "translateY(0)" : "translateY(100%)",
         padding:Waitingfordriver ? 20 : 0,
      duration: 0.3,
    });
  }, [Waitingfordriver]);
  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      let query = activeField === "origin" ? origin : destination;
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/maps/get-suggestions`,
          {
            params: { input: query },
          }
        );
        setSuggestions(res.data.suggestions || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [origin, destination, activeField]);
  const handleLocationSelect = (location) => {
    if (activeField === "origin") {
      setOrigin(location.display_name);
    } else if (activeField === "destination") {
      setDestination(location.display_name);
    }
  };
  async function findtrip() {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/rides/getfare`, {
      params: { pickup: origin, destination: destination },
       withCredentials: true
    });
    setfare(response.data);
    setpanelopen(false);
    setvehicleopen(true);
  }
  async function createride(){
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/rides/createride`, {
      pickup: origin,
      destination: destination,
      vehicletype:vehicletype.toLowerCase(),
    },{
      withCredentials:true
    });
  }
  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-100">
      {/* Background */}
      <div className="w-full h-full">
        <img
          className="w-full h-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map"
        />
      </div>
      <div className="flex flex-col justify-end h-screen  w-full top-0 absolute">
        {/* Search Form */}
        <div className=" p-5 h-[30%] bg-white relative">
          {" "}
          <FaChevronDown
            onClick={() => setpanelopen(false)}
            className="absolute right-6 top-6 text-3xl cursor-pointer hover:opacity-70"
          />{" "}
          <h4 className="text-3xl font-semibold">Find a trip</h4>{" "}
          <form onSubmit={(e) => e.preventDefault()}>
            {" "}
            <div className=" line w-1 h-16 absolute top-[40%] left-10 bg-black rounded-lg"></div>{" "}
            {/* Origin */}{" "}
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              onFocus={() => {
                setpanelopen(true);
                setActiveField("origin");
              }}
              className="px-12 py-2 bg-[#eee] rounded-lg text-lg w-full mt-6"
              placeholder="Add a pick-up location"
            />{" "}
            {/* Destination */}{" "}
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => {
                setpanelopen(true);
                setActiveField("destination");
              }}
              className="px-12 py-2 bg-[#eee] rounded-lg text-lg w-full mt-4"
              placeholder="Enter your destination"
            />{" "}
            <button
              onClick={findtrip}
              type="submit"
              className=" w-full p-4 bg-black rounded-lg text-white font-semibold mt-5"
            >
              Find trip
            </button>{" "}
          </form>{" "}
        </div>
        {/* Suggestions */}
        <div
          ref={pannel}
          className="h-[70%]   bg-white"
        >
          <Locationsearchpannel
            suggestions={suggestions}
            loading={loading}
            onSelectLocation={handleLocationSelect}
          />
        </div>
      </div>
      {/* Other Panels */}
      <div
        ref={vehiclepanel}
        className="w-full fixed  p-6 bottom-0 translate-y-[100%]  z-10 bg-white"
      >
        <Vehiclepannel
          fare={fare}
          setvehicletype={setvehicletype}
          setvehicleopen={setvehicleopen}
          setconfirmride={setconfirmride}
        />
      </div>
      <div
        ref={confirmridepannel}
        className="w-full fixed p-6  bottom-0 translate-y-[100%] z-10 bg-white"
      >
        <Confirmride
          origin={origin}
          vehicletype={vehicletype}
          destination={destination}
          fare={fare}
          setconfirmride={setconfirmride}
          setvehiclefound={setvehiclefound}
          createride={createride}
        />
      </div>
      <div
        ref={vehiclefoundref}
        className="w-full p-6 fixed bottom-0 translate-y-[100%] z-10 bg-white"
      >
        <Lookingfordriver
          origin={origin}
          vehicletype={vehicletype}
          destination={destination}
          fare={fare}
          setvehiclefound={setvehiclefound}
          setconfirmride={setconfirmride}
        />
      </div>
      <div
        ref={Waitingforadriverref}
        className="w-full p-6 fixed bottom-0 translate-y-[100%] z-10  bg-white"
      >
        <Waitingforadriver ride={ride} setwaitingfordriver={setwaitingfordriver} />
      </div>
    </div>
  );
}

export default Home;
