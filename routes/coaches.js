const express = require("express");
const router = express.Router();
const Coach = require("../models/Coach");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// GET all coaches (Public)
router.get("/", async (req, res) => {
  try {
    const coaches = await Coach.find().sort({ createdAt: -1 });
    res.json(coaches);
  } catch (err) {
    console.error("GET coaches error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single coach (Public)
router.get("/:id", async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) return res.status(404).json({ message: "Coach not found" });
    res.json(coach);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create coach (Admin only)
router.post("/", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { name, specialty, specialization, title, bio, image, experience, students, rating, certifications } = req.body;
    if (!name) return res.status(400).json({ message: "Coach name is required" });

    const coach = new Coach({ name, specialty, specialization, title, bio, image, experience, students, rating, certifications });
    await coach.save();
    res.status(201).json(coach);
  } catch (err) {
    console.error("POST coach error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update coach (Admin only)
router.put("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coach) return res.status(404).json({ message: "Coach not found" });
    res.json({ message: "Coach updated ✅", coach });
  } catch (err) {
    console.error("PUT coach error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE coach (Admin only)
router.delete("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id);
    if (!coach) return res.status(404).json({ message: "Coach not found" });
    res.json({ message: "Coach deleted ✅" });
  } catch (err) {
    console.error("DELETE coach error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
