const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");

// ✅ CREATE workout
router.post("/", async (req, res) => {
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
  // 2️⃣ منع الحجز لو مفيش slots
if (workout.slots <= 0) {
  return res.status(400).json({ message: "No available slots for this workout" });
}

});

// PUT تعديل تمرين
router.put("/:id", async (req, res) => {
  try {
    const { name, description, duration, level, slots } = req.body;

    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // تحديث الحقول لو موجودة في body
    if (name) workout.name = name;
    if (description) workout.description = description;
    if (duration) workout.duration = duration;
    if (level) workout.level = level;
    if (slots) workout.slots = slots;

    await workout.save();
    res.json({ message: "Workout updated successfully ✅", workout });

  } catch (err) {
    console.log("UPDATE WORKOUT ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🗑️ DELETE workout
router.delete("/:id", async (req, res) => {
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
