const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialty: { type: String, trim: true },
  specialization: { type: String, trim: true, default: "general" },
  title: { type: String, trim: true },
  bio: { type: String, trim: true, maxlength: 1000 },
  image: { type: String },
  experience: { type: String, default: "0" },
  students: { type: String, default: "0" },
  rating: { type: String, default: "5.0" },
  certifications: { type: String, default: "0" },
}, { timestamps: true });

module.exports = mongoose.model("Coach", coachSchema);
