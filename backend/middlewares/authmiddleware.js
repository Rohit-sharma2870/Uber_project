const jwt = require("jsonwebtoken");

// For users
exports.userauth = (req, res, next) => {
  const token = req.cookies.token; // cookie must match login cookie name
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

// For capitans
exports.capitanauth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.capitan = decoded; // attach captain info
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
