const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");


router.post("/bookings", async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;

    
    if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    
    const estimatedRideDurationHours = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;

    const start = new Date(startTime);
    const end = new Date(start.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    
    const overlapping = await Booking.findOne({
      vehicleId,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ],
    });

    if (overlapping) {
      return res.status(409).json({ message: "Vehicle already booked for this time slot" });
    }

    // 5️⃣ Create booking
    const booking = new Booking({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId,
      estimatedRideDurationHours
    });

    await booking.save();

    res.status(201).json(booking);

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(404).json({ message: "Server error" });
  }
});

module.exports = router;
