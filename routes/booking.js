const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Workout = require("../models/Workout");
const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

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

    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, slots: { $gt: 0 } },
      { $inc: { slots: -1 } },
      { new: true }
    );

    if (!workout) {
      return res.status(400).json({ message: "No available slots or workout not found" });
    }

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

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("workout");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("workout")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    const formatted = bookings.map(b => ({
      _id: b._id,
      activityName: b.workout?.title || b.workout?.name || 'Unknown Activity',
      activityId: b.workout?._id,
      userFullName: b.userFullName || b.user?.name || 'Deleted User',
      userId: b.nationalId || b.user?._id,
      userPhone: b.userPhone || b.user?.phone,
      userEmail: b.user?.email,
      userAge: b.userAge,
      traineeName: b.traineeName,
      parentName: b.parentName,
      parentPhone: b.parentPhone,
      nationalId: b.nationalId,
      coach: b.workout?.coach,
      date: b.workout?.date,
      time: b.workout?.time,
      location: b.workout?.location,
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

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Allow user to delete their own, OR allow an admin.
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
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

router.put("/:id/status", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { status, approvedPrice, adminNote } = req.body;
    
    if (status === "approved" && (approvedPrice === undefined || approvedPrice === null || approvedPrice === '')) {
      return res.status(400).json({ message: "An approvedPrice must be provided to approve a booking." });
    }

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

    const payment = await Payment.findOne({ booking: booking._id });
    
    if (status === "approved" && payment && payment.status !== "completed") {
      payment.status = "completed";
      payment.amount = approvedPrice;   
      await payment.save();
    } else if (status === "rejected" && payment && payment.status !== "failed") {
      payment.status = "failed";
      await payment.save();
    }
    if (status === "rejected" && previousStatus !== "rejected") {
      await Workout.findByIdAndUpdate(booking.workout, { $inc: { slots: 1 } });
    }

    res.json({ message: "Booking status strictly updated ✅", booking });

  } catch (err) {
    console.log("UPDATE BOOKING STATUS ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/retry-payment", authMiddleware, async (req, res) => {
  try {
    const { paymentMethod, walletType, proofUrl } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (booking.status !== "rejected") {
      return res.status(400).json({ message: "Only rejected bookings can be retried." });
    }
    
    const workout = await Workout.findOneAndUpdate(
      { _id: booking.workout, slots: { $gt: 0 } },
      { $inc: { slots: -1 } },
      { new: true }
    );
    
    if (!workout) {
      return res.status(400).json({ message: "Sorry, the slots for this activity are currently full." });
    }
    
    booking.status = "pending";
    booking.paymentStatus = "proof_submitted";
    booking.adminNote = ""; 
    booking.paymentMethod = paymentMethod || booking.paymentMethod;
    booking.walletType = walletType || booking.walletType;
    booking.proofUrl = proofUrl || booking.proofUrl;
    
    await booking.save();
    
    const existingPayment = await Payment.findOne({ booking: booking._id });
    if (existingPayment) {
      existingPayment.status = "pending";
      existingPayment.method = paymentMethod || existingPayment.method;
      existingPayment.receiptUrl = proofUrl || existingPayment.receiptUrl;
      await existingPayment.save();
    } else {
      const newPayment = new Payment({
        user: req.user.id,
        booking: booking._id,
        amount: booking.approvedPrice || workout.price || 0,
        method: paymentMethod || booking.paymentMethod,
        receiptUrl: proofUrl,
        status: "pending"
      });
      await newPayment.save();
    }
    
    res.json({ message: "Booking resubmitted successfully!", booking });
  } catch (err) {
    console.log("RETRY PAYMENT ERROR ❌", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
