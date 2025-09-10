const express = require("express");
const authRouter = express.Router();
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");

authRouter.get("/vehicles/available", async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }

    const estimatedRideDurationHours = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24 || 1;
    const start = new Date(startTime);
    const end = new Date(start.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    const vehicles = await Vehicle.find({ capacityKg: { $gte: parseInt(capacityRequired) } });
    const available = [];

    for (let vehicle of vehicles) {
      const overlapping = await Booking.findOne({
        vehicleId: vehicle._id,
        $or: [
          { startTime: { $lt: end }, endTime: { $gt: start } }
        ],
      });

      if (!overlapping) {
        available.push({
          _id: vehicle._id,
          name: vehicle.name,
          capacityKg: vehicle.capacityKg,
          tyres: vehicle.tyres,
          estimatedRideDurationHours,
        });
      }
    }

    console.log('Available Vehicles:', available); // Debug log
    res.json(available);
  } catch (error) {
    console.error("Error fetching available vehicles:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = authRouter;
