const express = require("express");
const router = express.Router();
const Hero = require("../models/Hero");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// GET all heroes (Public)
router.get("/", async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ createdAt: -1 });
    res.json(heroes);
  } catch (err) {
    console.error("GET heroes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single hero (Public)
router.get("/:id", async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).json({ message: "Hero not found" });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create hero (Admin only)
router.post("/", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { name, sport, image, bio, championships } = req.body;
    if (!name) return res.status(400).json({ message: "Hero name is required" });

    const hero = new Hero({ name, sport, image, bio, championships: championships || [] });
    await hero.save();
    res.status(201).json(hero);
  } catch (err) {
    console.error("POST hero error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update hero (Admin only)
router.put("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const hero = await Hero.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hero) return res.status(404).json({ message: "Hero not found" });
    res.json({ message: "Hero updated ✅", hero });
  } catch (err) {
    console.error("PUT hero error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE hero (Admin only)
router.delete("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) return res.status(404).json({ message: "Hero not found" });
    res.json({ message: "Hero deleted ✅" });
  } catch (err) {
    console.error("DELETE hero error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
