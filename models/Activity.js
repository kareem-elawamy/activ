import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: String,
  coach: String,
  date: String,
  time: String,
  capacity: Number,
  bookedCount: { type: Number, default: 0 },
  location: String
});

export default mongoose.models.Activity ||
mongoose.model("Activity", activitySchema);