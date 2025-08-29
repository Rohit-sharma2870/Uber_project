// routes/maprouter.js
const express = require("express");
const router = express.Router();
const { query } = require("express-validator");
const mapcontroller = require("../controllers/mapcontroller");
const isAuthenticated = require("../middlewares/authmiddleware");
router.get(
  "/get-coordinates",
  [
    query("address")
      .notEmpty()
      .withMessage("Address query parameter is required"),
  ],
  mapcontroller.getcoordinates 
);
router.get(
  "/get-distance",
  [
    query("origin").notEmpty().withMessage("Origin address is required"),
    query("destination").notEmpty().withMessage("Destination address is required"),
  ],

  mapcontroller.getdistanceandtime
);


router.get(
  "/get-suggestions",
  [
    query("input").notEmpty().withMessage("Search input is required")
  ],
  mapcontroller.getsuggestions
);


module.exports = router;
