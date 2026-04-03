const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Workout = require("../models/Workout");
const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ CREATE booking (Atomic Slot Deduction - Task 12.3)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { workoutId, date, userFullName, userPhone, nationalId, traineeName, parentName, parentPhone, paymentMethod, walletType, proofUrl } = req.body;

    // 1️⃣ Prevent duplicate booking for same workout on same date
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

    // 2️⃣ ATOMIC slot deduction — eliminates race conditions
    // Only decrements if slots > 0. Returns null if workout doesn't exist OR slots are 0.
    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, slots: { $gt: 0 } },
      { $inc: { slots: -1 } },
      { new: true }
    );

    if (!workout) {
      return res.status(400).json({ message: "No available slots or workout not found" });
    }

    // 3️⃣ Create the booking (slot is already secured atomically)
    const booking = new Booking({
      user: req.user.id,
      workout: workoutId,
      date,
      userFullName,
      userPhone,
      nationalId,
      traineeName,
      parentName,
      parentPhone,
      paymentMethod,
      walletType,
      proofUrl
    });

    await booking.save();

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

// ✅ GET all bookings (Admin Only) (Task 13.1 / Phase 9)
router.get("/", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("workout")
      .populate("user", "name email phone") // Ensure user payload provides contact strings
      .sort({ createdAt: -1 });

    // Transform into frontend representation structure safely
    const formatted = bookings.map(b => ({
      _id: b._id,
      activityName: b.workout?.title || b.workout?.name || 'Unknown Activity',
      activityId: b.workout?._id,
      userFullName: b.userFullName || b.user?.name || 'Deleted User',
      userId: b.nationalId || b.user?._id,
      userPhone: b.userPhone || b.user?.phone,
      userEmail: b.user?.email,
      userAge: b.userAge,
      // Trainee/Parent metadata
      traineeName: b.traineeName,
      parentName: b.parentName,
      parentPhone: b.parentPhone,
      nationalId: b.nationalId,
      // Activity details
      coach: b.workout?.coach,
      date: b.workout?.date,
      time: b.workout?.time,
      location: b.workout?.location,
      // Payment & Status
      paymentMethod: b.paymentMethod || 'receipt',
      walletType: b.walletType,
      proofUrl: b.proofUrl,
      status: b.status,
      approvedPrice: b.approvedPrice,
      holdUntil: b.holdUntil,
      adminNote: b.adminNote,
      createdAt: b.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    console.log("GET ALL BOOKINGS ERROR ❌", err);
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

// ✅ PUT update booking status + Admin Rules (Phase 7.1)
router.put("/:id/status", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { status, approvedPrice, adminNote } = req.body;
    
    // Rule 1: Approved bookings MUST have an approvedPrice
    if (status === "approved" && (approvedPrice === undefined || approvedPrice === null || approvedPrice === '')) {
      return res.status(400).json({ message: "An approvedPrice must be provided to approve a booking." });
    }

    // Rule 2: Rejected bookings MUST have an adminNote
    if (status === "rejected" && (!adminNote || adminNote.trim() === '')) {
      return res.status(400).json({ message: "An adminNote explaining the reason is required to reject a booking." });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const previousStatus = booking.status;

    booking.status = status;
    booking.adminNote = adminNote || booking.adminNote;
    booking.approvedPrice = approvedPrice !== undefined ? approvedPrice : booking.approvedPrice;

    await booking.save();

    // Rule 3: Automatically complete Payment if status is approved and payment method exists
    const payment = await Payment.findOne({ booking: booking._id });
    
    if (status === "approved" && payment && payment.status !== "completed") {
      payment.status = "completed";
      payment.amount = approvedPrice; // Ensure pricing syncs to payment
      await payment.save();
    } else if (status === "rejected" && payment && payment.status !== "failed") {
      // Mark payment as failed if rejected
      payment.status = "failed";
      await payment.save();
    }

    // Rule 4: Refund slot back to the workout when booking is REJECTED
    // Only refund if transitioning TO rejected (not if already rejected — prevents double refund)
    if (status === "rejected" && previousStatus !== "rejected") {
      await Workout.findByIdAndUpdate(booking.workout, { $inc: { slots: 1 } });
    }

    res.json({ message: "Booking status strictly updated ✅", booking });

  } catch (err) {
    console.log("UPDATE BOOKING STATUS ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
