const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ CREATE workout
router.post("/", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    console.log("WORKOUT ERROR ❌", err);
    res.status(500).json({ message: err.message });
  }
});

// GET كل التمارين
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET تمرين واحد
router.get("/:id", async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json(workout);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT تعديل تمرين
router.put("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { name, description, duration, level, slots, coach, category, location, date, time, price, ageRange, image, icon } = req.body;

    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // تحديث الحقول لو موجودة في body
    if (name !== undefined) workout.name = name;
    if (description !== undefined) workout.description = description;
    if (duration !== undefined) workout.duration = duration;
    if (level !== undefined) workout.level = level;
    if (slots !== undefined) workout.slots = slots;
    if (coach !== undefined) workout.coach = coach;
    if (category !== undefined) workout.category = category;
    if (location !== undefined) workout.location = location;
    if (date !== undefined) workout.date = date;
    if (time !== undefined) workout.time = time;
    if (price !== undefined) workout.price = price;
    if (ageRange !== undefined) workout.ageRange = ageRange;
    if (image !== undefined) workout.image = image;
    if (icon !== undefined) workout.icon = icon;

    await workout.save();
    res.json({ message: "Workout updated successfully ✅", workout });

  } catch (err) {
    console.log("UPDATE WORKOUT ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🗑️ DELETE workout
router.delete("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({ message: "Workout deleted successfully ✅" });

  } catch (err) {
    console.log("DELETE WORKOUT ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
