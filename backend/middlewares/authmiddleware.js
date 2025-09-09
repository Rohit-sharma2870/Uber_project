const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const Capitan = require("../models/capitan-model");

// ====================== USER AUTH ======================
exports.userauth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    console.log(user)
    req.user = user; // ✅ attach full user doc
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
// ====================== CAPITAN AUTH ======================
exports.capitanauth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find capitan from DB
    const capitan = await Capitan.findById(decoded.id);
    if (!capitan) {
      return res.status(401).json({ message: "Unauthorized: Capitan not found" });
    }

    req.capitan = capitan; // ✅ attach full capitan doc
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
