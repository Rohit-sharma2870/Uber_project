const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const Capitan = require("../models/capitan-model");

// ====================== USER AUTH ======================
exports.userauth = async (req, res, next) => {
  try {
    const token = req.cookies?.userToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("User auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

// ====================== CAPITAN AUTH ======================
exports.capitanauth = async (req, res, next) => {
  try {
    const token = req.cookies?.capitanToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const capitan = await Capitan.findById(decoded.id);
    if (!capitan) {
      return res.status(401).json({ message: "Unauthorized: Capitan not found" });
    }

    req.capitan = capitan;
    next();
  } catch (err) {
    console.error("Capitan auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
