import React from "react";
import { FaUserCircle, FaRupeeSign, FaChevronDown } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsCashStack } from "react-icons/bs";

function Confirmride({
  setconfirmride,
  setvehiclefound,
  vehicletype,
  origin,
  destination,
  fare,
  createride,
}) {
  // normalize vehicle type to lowercase for correct fare lookup
  const normalizedType = vehicletype?.toLowerCase();
  const rideFare = fare?.[normalizedType] ?? 0;

  return (
    <div className="bg-white rounded-2xl">
      {/* Close */}
      <div
        onClick={() => setconfirmride(false)}
        className="w-full text-3xl p-2 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        <FaChevronDown />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-center mb-4">Confirm Your Ride</h3>

      {/* Vehicle Image */}
      <div className="flex items-center justify-center mb-4">
        <img
          className="w-48 h-32 object-contain"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
          alt="Uber Ride"
        />
      </div>

      {/* Origin */}
      <div className="flex items-start gap-3 border-b border-gray-300 px-2 py-3">
        <FaUserCircle className="text-2xl text-gray-600 mt-1" />
        <div>
          <h4 className="text-lg font-semibold">Pickup</h4>
          <p className="text-gray-600">{origin}</p>
        </div>
      </div>

      {/* Destination */}
      <div className="flex items-start gap-3 border-b border-gray-300 px-2 py-3">
        <FaLocationDot className="text-xl text-red-500 mt-1" />
        <div>
          <h4 className="text-lg font-semibold">Drop</h4>
          <p className="text-gray-600">{destination}</p>
        </div>
      </div>

      {/* Fare */}
      <div className="flex items-start gap-3 border-b border-gray-300 px-2 py-3">
        <BsCashStack className="text-xl text-green-600 mt-1" />
        <div>
          <div className="flex items-center text-xl font-semibold text-gray-800">
            <FaRupeeSign className="mr-1" />
            <span>{rideFare}</span>
          </div>
          <p className="text-gray-600 text-sm">Payment Method: Cash</p>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={() => {
          setvehiclefound(true);
          setconfirmride(false);
          createride();
        }}
        className="w-full mt-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 transition text-white text-lg font-semibold"
      >
        Confirm Ride
      </button>
    </div>
  );
}

export default Confirmride;
