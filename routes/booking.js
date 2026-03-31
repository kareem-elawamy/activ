const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Workout = require("../models/Workout");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ CREATE booking (محسّن)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { workoutId, date } = req.body;

    // 1️⃣ التأكد إن التمرين موجود
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // 2️⃣ منع الحجز لو مفيش slots
    if (workout.slots <= 0) {
      return res.status(400).json({ message: "No available slots" });
    }

    // 3️⃣ منع نفس التمرين في نفس اليوم
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      workout: workoutId,
      date
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You already booked this workout for this date"
      });
    }

    // 4️⃣ إنشاء الحجز
    const booking = new Booking({
      user: req.user.id,
      workout: workoutId,
      date
    });

    await booking.save();

    // 5️⃣ تقليل slot
    workout.slots -= 1;
    await workout.save();

    res.status(201).json(booking);

  } catch (err) {
    console.log("BOOKING ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET my bookings
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("workout");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ❌ Cancel booking
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Workout.findByIdAndUpdate(
      booking.workout,
      { $inc: { slots: 1 } }
    );

    await booking.deleteOne();
    res.json({ message: "Booking canceled successfully ✅" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
