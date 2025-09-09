const express = require("express");
const authRouter = express.Router();
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");

authRouter.get("/vehicles/available", async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    // Validate query parameters
    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }

    // Estimate ride duration in hours
    const estimatedRideDurationHours = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;

    const start = new Date(startTime);
    const end = new Date(start.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    // Find vehicles with enough capacity
    const vehicles = await Vehicle.find({ capacityKg: { $gte: parseInt(capacityRequired) } });

    const available = [];

    for (let vehicle of vehicles) {
      // Check if vehicle has overlapping bookings
      const overlapping = await Booking.findOne({
        vehicleId: vehicle._id, // no need to convert to string
        $or: [
          { startTime: { $lt: end }, endTime: { $gt: start } }
        ],
      });

      if (!overlapping) {
        available.push({ ...vehicle.toObject(), estimatedRideDurationHours });
      }
    }

    res.json(available);
  } catch (error) {
    console.error("Error fetching available vehicles:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = authRouter;
