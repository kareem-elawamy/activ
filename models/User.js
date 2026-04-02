const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\d{10,15}$/, 'Please fill a valid phone number']
  },
  nationalId: {
    type: String,
    trim: true,
    match: [/^\d{14}$/, 'National ID must be 14 digits']
  },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["user", "admin"], default: "user", index: true },
  profilePic: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
