const mongoose = require("mongoose"); // <- ده اللي ناقص

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profilePic: { type: String, default: "" } // رابط الصورة
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
