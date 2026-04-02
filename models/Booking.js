const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    index: true
  },
  // Guest Booking Support Fields
  userFullName: { type: String, trim: true, maxlength: 100 },
  userPhone: { type: String, trim: true, match: [/^\d{10,15}$/, 'Please fill a valid phone number'] },
  nationalId: { type: String, trim: true },
  traineeName: { type: String, trim: true, maxlength: 100 },
  parentName: { type: String, trim: true, maxlength: 100 },
  parentPhone: { type: String, trim: true },
  
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout",
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "active", "cancelled"],
    default: "pending",
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ["awaiting_proof", "proof_submitted", "approved", "rejected"],
    default: "awaiting_proof",
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ["receipt", "instapay", "wallet", "visa", "cash"],
  },
  walletType: {
    type: String,
    enum: ["vodafone", "orange", "etisalat", "we", "None", null],
  },
  proofUrl: {
    type: String
  },
  approvedPrice: {
    type: Number,
    min: 0
  },
  holdUntil: {
    type: Date
  },
  adminNote: {
    type: String,
    maxlength: 500
  },
  date: {
    type: Date,
    required: true,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
