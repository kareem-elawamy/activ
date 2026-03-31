const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  slots: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model("Workout", workoutSchema);
