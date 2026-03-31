const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs"); // ده ناقص


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
    );

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


module.exports = router;
