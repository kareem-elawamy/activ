const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  coach: { type: String, trim: true },
  date: { type: String },
  time: { type: String },
  capacity: { type: Number, min: 0 },
  bookedCount: { type: Number, default: 0, min: 0 },
  location: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.models.Activity || mongoose.model("Activity", activitySchema);