import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

function Locationsearchpannel({ suggestions, loading, onSelectLocation }) {
  return (
    <div className="w-full max-w-lg mx-auto mt-4 bg-white rounded-2xl  border border-gray-100">
      <ul className="divide-y divide-gray-100 max-h-72 ">
        {suggestions.map((loc, index) => (
          <li
            key={index}
            onClick={() => onSelectLocation(loc)}
            className="flex items-center my-2 gap-3 px-4 py-3 bg-white text-base cursor-pointer hover:bg-gray-50 hover:shadow-md "
          >  
            <div className="  p-2 rounded-full shadow-sm">
              <FaMapMarkerAlt className="text-blue-600 text-lg"/>
            </div>
            <span className="text-gray-700 font-medium">
              {loc.display_name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Locationsearchpannel;

