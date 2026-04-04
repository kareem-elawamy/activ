const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sport: { type: String, trim: true },
    image: { type: String },
    bio: { type: String, trim: true, maxlength: 1000 },
    championships: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", heroSchema);
