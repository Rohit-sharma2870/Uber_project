const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usermodel = require("../models/usermodel");

// ========================== REGISTER ==========================
exports.userregister = [
  body("firstname")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Firstname must be at least 3 characters long")
    .matches(/^[a-zA-Z\-']+$/)
    .withMessage("Firstname can contain only letters"),

  body("lastname")
    .trim()
    .matches(/^[a-zA-Z\-']+$/)
    .withMessage("Lastname can contain only letters"),

  body("email").isEmail().withMessage("Enter a valid email"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*()]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

  async (req, res) => {
    try {
      const { firstname, lastname, email, password } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((error) => error.msg),
          oldinputs: { firstname, lastname, email, password },
        });
      }

      const isAlreadyExist = await usermodel.findOne({ email });
      if (isAlreadyExist) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await usermodel.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });

      // ✅ Send only safe fields (no password)
      const safeUser = {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      };

      return res.status(201).json({ message: "User registered", user: safeUser });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Error while registering user" });
    }
  },
];

// ========================== LOGIN ==========================
exports.postlogin = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .trim(),

  async (req, res) => {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((error) => error.msg),
          oldinputs: { email, password },
        });
      }

      const user = await usermodel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // ✅ Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // ✅ Set cookie with token
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      const safeUser = {
        _id: user._id,
        firstname: user.firstname,
        email: user.email,
      };

      return res
        .status(200)
        .json({ message: "Login successful", user: safeUser });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error while logging in" });
    }
  },
];

// ========================== LOGOUT ==========================
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};


