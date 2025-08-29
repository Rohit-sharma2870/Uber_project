const axios = require("axios");
const capitanModel=require('../models/capitan-model')
module.exports.getCoordinates=async (address)=> {
  if (!address) {
    throw new Error("Address is required");
  }
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          addressdetails: 1,
          limit: 1,
        },
        headers: {
          "User-Agent": "UberPro/1.0 (rohitbral5212@gmail.com)",
        },
      }
    );

    if (!response.data.length) {
      throw new Error("Address not found");
    }

    const { lat, lon } = response.data[0];
    return { lat, lng: lon };
  } catch (error) {
    console.error("Error getting coordinates:", error.message);
    throw new Error(error.message);
  }
}


module.exports.getDistanceAndTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Both origin and destination are required");
  }
  try {
    const getCoords = async (place) => {
      const resp = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: place, format: "json", limit: 1 },
          headers: { "User-Agent": "UberPro/1.0 (rohitbral5212@gmail.com)" },
        }
      );

      if (!resp.data.length) {
        throw new Error(`Location not found: ${place}`);
      }

      return { lat: resp.data[0].lat, lon: resp.data[0].lon };
    };

    const originCoords = await getCoords(origin);
    const destCoords = await getCoords(destination);
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destCoords.lon},${destCoords.lat}?overview=false`;

    const routeResp = await axios.get(osrmUrl);
    const routeData = routeResp.data;

    if (!routeData.routes || !routeData.routes.length) {
      throw new Error("No route found");
    }

    const route = routeData.routes[0];

    return {
      from: origin,
      to: destination,
      distance_km: (route.distance / 1000).toFixed(2),
      duration_min: (route.duration / 60).toFixed(2),
    };
  } catch (error) {
    console.error("Error getting distance/time:", error.message);
    throw error;
  }
};

module.exports.getSuggestions = async (input) => {
  if (!input) {
    throw new Error("Search input is required");
  }

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: input,
        format: "json",
        addressdetails: 1,
        limit: 5,
      },
      headers: {
        "User-Agent": "UberPro/1.0 (rohitbral5212@gmail.com)",
      },
    });

    if (!response.data.length) {
      return [];
    }

    // Return an array of place names
    return response.data.map((place) => ({
      display_name: place.display_name,
      lat: place.lat,
      lon: place.lon,
    }));
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    throw error;
  }
};
module.exports.getCapitansInRadius = async (lat, lng, radiusKm) => {
  const radiusInRadians = radiusKm / 6378.1;

  // console.log("Searching around:", { lat, lng, radiusKm, radiusInRadians });

  const result = await capitanModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians]
      }
    }
  });

  // console.log("Found captains:", result);
  return result;
};



