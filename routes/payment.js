const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/authMiddleware");

// Create payment
router.post("/", authMiddleware, async (req, res) => {
  const { amount, method, receiptUrl } = req.body;

  try {
    const payment = new Payment({
      user: req.user.id,
      amount,
      method,
      receiptUrl,
      status: method === "visa" ? "completed" : "pending", // مثال
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get my payments
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
