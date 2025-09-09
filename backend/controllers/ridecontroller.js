const ridemodel = require("../models/Ridemodel");
const mapservice = require("../services/mapservice");
const { validationResult } = require("express-validator");
const { sendMessageToSocketId } = require("../socket");

// ========================== Helper Functions ==========================
function generateOTP(num) {
  let otp = "";
  for (let i = 0; i < num; i++) otp += Math.floor(Math.random() * 10);
  return otp;
}

async function calculateFare(pickup, destination) {
  if (!pickup || !destination)
    throw new Error("pickup and destination are required");

  const { distance_km, duration_min } =
    await mapservice.getDistanceAndTime(pickup, destination);

  const distance = parseFloat(distance_km);
  const time = parseFloat(duration_min);

  if (isNaN(distance) || isNaN(time))
    throw new Error("Invalid distance or time from map service");

  const rates = {
    motorcycle: { perKm: 8, perMin: 1, minFare: 25 },
    auto: { perKm: 10, perMin: 1.5, minFare: 30 },
    car: { perKm: 15, perMin: 2, minFare: 50 },
  };

  const fares = {};
  for (const vehicle in rates) {
    let fare =
      distance * rates[vehicle].perKm + time * rates[vehicle].perMin;
    fares[vehicle] = Math.max(Math.round(fare), rates[vehicle].minFare);
  }
  return fares;
}

// ========================== CREATE RIDE ==========================
exports.createride = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const user = req.user; // ✅ comes from JWT middleware
    const { pickup, destination, vehicletype } = req.body;

    if (!user || !pickup || !destination || !vehicletype) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fare = await calculateFare(pickup, destination);
    const vehicleKey = vehicletype.toLowerCase();
    if (!fare[vehicleKey]) {
      return res.status(400).json({ message: "Invalid vehicle type" });
    }

    const ride = await ridemodel.create({
      user: user._id,
      pickup,
      destination,
      fare: fare[vehicleKey],
      otp: generateOTP(6),
      status: "pending",
    });

    const pickupCoords = await mapservice.getCoordinates(pickup);
    const capitansInRadius = await mapservice.getCapitansInRadius(
      pickupCoords.lat,
      pickupCoords.lng,
      10
    );

    const rideWithUser = await ridemodel
      .findById(ride._id)
      .populate("user");

    // ✅ Notify nearby captains
    capitansInRadius.forEach((capitan) => {
      if (capitan.socketId) {
        sendMessageToSocketId(capitan.socketId, {
          event: "new-ride",
          data: rideWithUser,
        });
      }
    });

    res
      .status(201)
      .json({ message: "Ride created successfully", ride: rideWithUser });
  } catch (error) {
    next(error);
  }
};

// ========================== GET FARE ==========================
exports.getfare = async (req, res, next) => {
  try {
    const { pickup, destination } = req.query;
    if (!pickup || !destination)
      return res
        .status(400)
        .json({ message: "Origin and destination are required" });

    const fare = await calculateFare(pickup, destination);
    res.status(200).json(fare);
  } catch (error) {
    next(error);
  }
};

// ========================== CONFIRM RIDE ==========================
exports.confirmride = async (req, res, next) => {
  try {
    const { rideid } = req.body;
    const capitan = req.user; // ✅ capitan JWT

    if (!rideid || !capitan)
      return res
        .status(400)
        .json({ message: "rideid and capitan are required" });

    const ride = await ridemodel
      .findByIdAndUpdate(
        rideid,
        { status: "accepted", capitan: capitan._id },
        { new: true }
      )
      .populate("user capitan");

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-confirmed",
        data: ride,
      });
    }

    res.status(200).json({ message: "Ride confirmed", ride });
  } catch (error) {
    next(error);
  }
};

// ========================== START RIDE ==========================
exports.startride = async (req, res, next) => {
  try {
    const { rideid, otp } = req.body;
    if (!rideid || !otp)
      return res.status(400).json({ message: "rideid and otp are required" });

    const ride = await ridemodel
      .findById(rideid)
      .populate("user capitan")
      .select("+otp");

    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "accepted")
      return res
        .status(400)
        .json({ message: "Ride not accepted or already started" });
    if (ride.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    ride.status = "ongoing";
    await ride.save();

    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "start-ride",
        data: ride,
      });
    }

    res.status(200).json({ message: "Ride started", ride });
  } catch (error) {
    next(error);
  }
};
// ========================== FINISH RIDE ==========================
exports.finishride = async (req, res, next) => {
  try {
    const { rideid } = req.body;
    const capitan = req.user; 

    if (!rideid) {
      return res.status(400).json({ message: "rideid is required" });
    }

    const ride = await ridemodel
      .findOne({ _id: rideid, capitan: capitan._id })
      .populate("user capitan");

    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "ongoing")
      return res.status(400).json({ message: "Ride is not ongoing" });

    ride.status = "completed";
    await ride.save();

    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "end-ride",
        data: ride,
      });
    }
    res.status(200).json({ message: "Ride ended successfully", ride });
  } catch (error) {
    next(error);
  }
};

