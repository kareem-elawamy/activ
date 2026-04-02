const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", index: true }, // Added relationship
  amount: { type: Number, required: true, min: 0 },
  method: { type: String, enum: ["visa","receipt","cash", "instapay", "wallet"], required: true },
  status: { type: String, enum: ["pending","completed","failed"], default: "pending", index: true },
  receiptUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
