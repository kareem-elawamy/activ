const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const bcrypt = require("bcryptjs");

const Workout = require("../models/Workout");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

// ✅ GET ALL USERS (Admin Only - Task 9.1)
router.get("/", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.log("GET ALL USERS ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET ADMIN STATS (Admin Only - Task 9.2)
router.get("/stats", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeWorkouts = await Workout.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    
    // Aggregate Total Revenue from Payments (summing 'amount' for 'completed' payments)
    const revenueAggregation = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    res.json({
      totalUsers,
      activeWorkouts,
      pendingBookings,
      totalRevenue
    });
  } catch (err) {
    console.log("GET ADMIN STATS ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ UPDATE NAME
router.put("/update-name", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select("-password");

    res.json({
      message: "Name updated successfully ✅",
      user,
    });

  } catch (err) {
    console.log("UPDATE NAME ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Change Password
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 1️⃣ جلب اليوزر من التوكين
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ مطابقة الباسورد القديم
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

    // 3️⃣ تشفير الباسورد الجديد
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: "Password changed successfully ✅" });

  } catch (err) {
    console.log("CHANGE PASSWORD ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Update Profile Pic
router.put("/update-profile-pic", authMiddleware, async (req, res) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture URL is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePic = profilePic;
    await user.save();

    res.json({ message: "Profile picture updated ✅", profilePic: user.profilePic });

  } catch (err) {
    console.log("UPDATE PROFILE PIC ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PROMOTE USER TO ADMIN
router.put("/promote/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = "admin";
    await user.save();
    
    user.password = undefined; // Strip password from response
    
    res.json({ message: "User promoted to admin successfully ✅", user });
  } catch (err) {
    console.log("PROMOTE USER ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
