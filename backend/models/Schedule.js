const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  phoneNumber: String,
  frequency: Number, // in minutes
  message: String,
  endDate: Date,
});

module.exports = mongoose.model("Schedule", scheduleSchema);
