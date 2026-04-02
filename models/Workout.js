const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, maxlength: 1000 },
  duration: { type: Number, required: true, min: 1 },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  slots: { type: Number, default: 1, min: 0 },
  coach: { type: String, trim: true },
  category: { type: String, default: "All Sports", index: true },
  location: { type: String, trim: true },
  date: { type: String },
  time: { type: String },
  price: { type: Number, min: 0 },
  ageRange: { type: String },
  image: { type: String },
  icon: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Workout", workoutSchema);
