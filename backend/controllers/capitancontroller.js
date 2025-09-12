const { body, validationResult } = require('express-validator');
const capitanmodel = require('../models/capitan-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret for JWT (store in .env)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ----------------- REGISTER -----------------
exports.register = [
  body('firstname')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Firstname must be at least 3 characters long')
    .matches(/^[a-zA-Z\-']+$/)
    .withMessage('Firstname contains only letters'),
  body('lastname')
    .trim()
    .matches(/^[a-zA-Z\-']+$/)
    .withMessage('Lastname contains only letters'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[!@#$%^&*()]/).withMessage('Password must contain a special character')
    .trim(),
  body('vehiclecolour').isLength({ min: 3 }).withMessage('Vehicle colour must have at least 3 characters'),
  body('vehicleplate').isLength({ min: 3 }).withMessage('Vehicle number must have at least 3 characters'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('vehicletype').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type'),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map(e => e.msg),
          oldinputs: req.body
        });
      }

      const { firstname, lastname, email, password, vehiclecolour, vehicleplate, capacity, vehicletype } = req.body;

      const existing = await capitanmodel.findOne({ email });
      if (existing) return res.status(409).json({ message: "Captain already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const capitan = await capitanmodel.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        vehicle: { colour: vehiclecolour, plate: vehicleplate, capacity, vehicletype }
      });

      res.status(201).json({ message: "Captain registered successfully", capitan });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error while creating captain", error: err.message });
    }
  }
];
// ----------------- LOGIN -----------------
exports.postlogin = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .trim(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((e) => e.msg),
        });
      }

      const { email, password } = req.body;

      // ✅ Find capitan
      const capitan = await capitanmodel.findOne({ email });
      if (!capitan) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // ✅ Compare passwords
      const isMatch = await bcrypt.compare(password, capitan.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // ✅ Create JWT
      const token = jwt.sign(
        {
          id: capitan._id,
          email: capitan.email,
          firstname: capitan.firstname,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // ✅ Send cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in prod
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // ✅ Return success response
      res.status(200).json({
        message: "Login successful",
        capitan: {
          _id: capitan._id,
          firstname: capitan.firstname,
          email: capitan.email,
          vehicle: capitan.vehicle,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error during login",
        error: err.message,
      });
    }
  },
];

// ----------------- GET PROFILE -----------------
exports.getprofile = async (req, res) => {
  try {
    const capitan = req.capitan; // set by JWT auth middleware
    if (!capitan) return res.status(401).json({ message: "Unauthorized" });
    res.json({ capitan });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// ========================== CAPITAN LOGOUT ==========================
exports.logout = (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({ message: "Captain logged out successfully" });
};


