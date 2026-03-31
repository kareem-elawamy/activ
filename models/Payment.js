const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["visa","receipt","cash"], required: true },
  status: { type: String, enum: ["pending","completed","failed"], default: "pending" },
  receiptUrl: { type: String }, // لو رفع نسخة من الايصال
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
