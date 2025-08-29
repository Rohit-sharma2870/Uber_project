import React from 'react';
import { FaChevronDown, FaUser } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

function Vehiclepannel({ setvehicleopen, setconfirmride, fare, setvehicletype }) {
  const vehicleOptions = [
    {
      name: 'Car',
      seats: 4,
      time: '2 min away',
      description: 'Affordable, compact rides',
      price: fare?.car || 0,
      image: 'https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png'
    },
    {
      name: 'Motorcycle',
      seats: 1,
      time: '3 min away',
      description: 'Quick, solo motorcycle rides',
      price: fare?.motorcycle || 0,
      image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png'
    },
    {
      name: 'Auto',
      seats: 3,
      time: '2 min away',
      description: 'Affordable, three-wheeler rides',
      price: fare?.auto || 0,
      image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png'
    }
  ];

  return (
    <div className="p-5 bg-white rounded-2xl shadow-lg max-w-xl mx-auto">
      
      {/* Close Button */}
      <div
        onClick={() => setvehicleopen(false)}
        className="w-full p-2 text-3xl flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
      >
        <FaChevronDown />
      </div>

      {/* Header */}
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Choose a Vehicle
      </h3>

      {/* Vehicle Cards */}
      <div className="space-y-4">
        {vehicleOptions.map((vehicle, index) => (
          <div
            key={index}
            onClick={() => {
              setconfirmride(true);
              setvehicletype(vehicle.name);
            }}
            className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            {/* Image */}
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-20 h-20 object-contain drop-shadow-sm"
            />

            {/* Info + Price in one row */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                {/* Vehicle Name + Seats */}
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {vehicle.name}
                  </h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUser className="mr-1 text-gray-500" />
                    <span>{vehicle.seats}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center text-lg font-semibold text-gray-800">
                  <FaIndianRupeeSign className="mr-1" />
                  {vehicle.price}
                </div>
              </div>

              {/* Time + Description */}
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500">{vehicle.time}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">{vehicle.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vehiclepannel;



