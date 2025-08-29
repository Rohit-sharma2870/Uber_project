const ridemodel=require('../models/Ridemodel')
const mapservice=require('../services/mapservice')
const{validationResult}=require('express-validator')
const capitanmodel=require('../models/capitan-model')
const {sendMessageToSocketId}=require('../socket')
function generateOTP(num) {
    if (num <= 0) return ''; 
    let otp = '';
    for (let i = 0; i < num; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}   
async function getfare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('pickup and destination are required');
    }

    const { distance_km, duration_min } = await mapservice.getDistanceAndTime(pickup, destination);

    // Convert strings to numbers
    const distance = parseFloat(distance_km);
    const time = parseFloat(duration_min);

    // Validate conversion
    if (isNaN(distance) || isNaN(time)) {
        throw new Error('Invalid distance or time from map service');
    }

    const rates = {
        motorcycle: { perKm: 8, perMin: 1, minFare: 25 },
        auto:       { perKm: 10, perMin: 1.5, minFare: 30 },
        car:        { perKm: 15, perMin: 2, minFare: 50 }
    };

    const fares = {};
    for (const vehicle in rates) {
        let fare = (distance * rates[vehicle].perKm) + (time * rates[vehicle].perMin);
        fare = Math.max(fare, rates[vehicle].minFare);
        fares[vehicle] = Math.round(fare);
    }
    return fares;
}




exports.createride=async (req, res, next) => {
    try {

        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
         const user=req.session?.user;
         console.log(req.session)
        const { pickup, destination, vehicletype } = req.body;
        if (!user || !pickup || !destination || !vehicletype) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Calculate fare
         const fare = await getfare(pickup,destination);
        if (!fare[vehicletype]) {
            return res.status(400).json({ message: 'Invalid vehicle type' });
        }
        // Create ride
        const ride = await ridemodel.create({
            user:user._id,
            pickup,
            destination,
            fare: fare[vehicletype],
            otp:generateOTP(6)
        });
        res.status(201).json({
            message: 'Ride created successfully',
            ride
        });
     //map details
     const pickupcoordinates=await mapservice.getCoordinates(pickup);
    const capitansInRadius=await mapservice.getCapitansInRadius(pickupcoordinates.lat,pickupcoordinates.lng,10);
      ride.otp=" "
      const ridwithuser= await ridemodel.findOne({_id:ride._id}).populate('user');
      capitansInRadius.map((capitan)=>{
      sendMessageToSocketId(capitan.socketId,{
        event:'new-ride',
        data:ridwithuser
      })
      })
    } catch (error){
        next(error);
    }
};

exports.getfare = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { pickup, destination } = req.query;
    // Ensure both origin and destination exist
    if (!pickup || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required' });
    }
    // Fetch fare
    const fare = await getfare(pickup, destination);
    if (!fare) {
      return res.status(404).json({ message: 'Fare not found' });
    }
    return res.status(200).json(fare);
  } catch (error) {
    next(error);
  }
};
exports.confirmride = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rideid, capitan } = req.body;

    if (!rideid) {
      return res.status(400).json({ message: "rideid is required" });
    }
    if (!capitan) {
      return res.status(401).json({ message: "Unauthorized: capitan required" });
    }

    // Update ride
    await ridemodel.findOneAndUpdate(
      { _id: rideid },
      { status: "accepted", capitan: capitan._id }
    );

    // Fetch updated ride
    const ride = await ridemodel.findOne({ _id: rideid })
      .populate("user")
      .populate("capitan")
      .select("+otp");

    if (!ride) {
      return res.status(404).json({ message: "ride not found" });
    }

    // Notify user via socket
    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-confirmed",
        data: ride,
      });
    }

    return res.status(200).json({ message: "Ride confirmed", ride });

  } catch (error) {
    console.error("Error confirming ride:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.startride = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rideid, otp } = req.body;

    if (!rideid || !otp) {
      return res.status(400).json({ message: "rideid and otp are required" });
    }

    const ride = await ridemodel.findOne({ _id: rideid })
      .populate("user")
      .populate("capitan")
      .select("+otp");

    if (!ride) {
      return res.status(404).json({ message: "ride not found" });
    }

    if (ride.status === "ongoing") {
      return res.status(400).json({ message: "ride already started" });
    }

    if (ride.status !== "accepted") {
      return res.status(400).json({ message: "ride not accepted" });
    }

    if (ride.otp !== otp) {
      return res.status(400).json({ message: "invalid otp" });
    }

  // ✅ Update status
    const updatedRide = await ridemodel.findOneAndUpdate(
      { _id: rideid },
      { status: "ongoing" },
      { new: true } 
    ).populate("user").populate("capitan").select("+otp");


    // ✅ Notify user
    if (updatedRide.user?.socketId) {
      try {
        sendMessageToSocketId(updatedRide.user.socketId, {
          event: "start-ride",
          data: updatedRide,
        });
      } catch (socketErr) {
        console.warn("Socket error:", socketErr.message);
      }
    }

    return res.status(200).json({ message: "Ride started", ride: updatedRide });

  } catch (error) {
    console.error("Error starting ride:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.finishride = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rideid } = req.body;
    const capitan = req.session.capitan;

    const ride = await ridemodel
      .findOne({ _id: rideid, capitan: capitan._id })
      .populate("user")
      .populate("capitan")
      .select("+otp");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status !== "ongoing") {
      return res.status(400).json({ message: "Ride is not ongoing" });
    }

    // ✅ Update ride status to completed
    ride.status = "completed";
    await ride.save();

    // send notification to user
    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "end-ride",
        data: ride,
      });
    } else {
      console.warn("User has no socketId, cannot send end-ride event");
    }

    return res.status(200).json({ message: "Ride ended successfully" });
  } catch (error) {
    console.error("Error finishing ride:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};
