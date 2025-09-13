// controllers/mapcontroller.js
const { validationResult } = require("express-validator");
const mapservice = require("../services/mapservice");
// Get coordinates
exports.getcoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg),
    });
  }
  try {
    const { address } = req.query;
    const coords = await mapservice.getCoordinates(address);
    res.json({ coordinates: coords });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Distance and time
exports.getdistanceandtime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg),
    });
  }

  try {
    const { origin, destination } = req.query;
    const result = await mapservice.getDistanceAndTime(origin, destination);
    res.json(result);
  } catch (error) {
    console.error("Error in getDistanceAndTimeController:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Get suggestions
exports.getsuggestions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg),
    });
  }

  try {
    const { input } = req.query;

    // Fetch suggestions safely
    const suggestions = await mapservice.getSuggestions(input);

    // Ensure suggestions is always an array
    res.json({ suggestions: suggestions || [] });
  } catch (error) {
    console.error("Error in /get-suggestions:", error.message);
    // Return empty array instead of 500 for transient API issues
    res.json({ suggestions: [] });
  }
};


