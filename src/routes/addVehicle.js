const express = require("express");
const authRouter = express.Router();
const Vehicle = require("../models/Vehicle");


authRouter.post("/vehicles", async (req, res) => {
    try {
        const { name, capacityKg, tyres } = req.body;

        if (!name || !capacityKg || !tyres) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const vehicle = new Vehicle({
            name,
            capacityKg,
            tyres
        });
        await vehicle.save();

        res.status(201).json(vehicle);
    } catch (error) {
        console.error("Error creating vehicle:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = authRouter;
