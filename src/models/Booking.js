const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  fromPincode: { type: String, required: true },
  toPincode: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  customerId: { type: String, required: true },
});

module.exports = mongoose.model('Booking', BookingSchema);
