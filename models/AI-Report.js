const mongoose = require("mongoose");

const aiReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reportData: { type: Object }, // تخزين بيانات التحليل من الـ AI
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AIReport", aiReportSchema);
