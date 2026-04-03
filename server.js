const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");

// 2️⃣ Load environment variables
dotenv.config();

// 3️⃣ Import Controllers & Models
const analysisController = require("./controllers/analysisController.js");
const Analysis = require("./models/Analysis.js");

// 3.5️⃣ Import Routers
const authRouter = require("./routes/auth.js");
const bookingRouter = require("./routes/booking.js");
const paymentRouter = require("./routes/payment.js");
const usersRouter = require("./routes/users.js");
const workoutRouter = require("./routes/workout.js");
const coachesRouter = require("./routes/coaches.js");

// 4️⃣ Initialize app
const app = express();

// 5️⃣ Middlewares
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // الفرونت اند بتاعك
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(express.json());

// 6️⃣ Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// 7️⃣ Database Connection
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/coaching_db";
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    require("./utils/seeder")();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.log("💡 Make sure MongoDB is running locally or check your URI in .env");
  });

// 8️⃣ Routes

// Root
app.get("/", (req, res) => res.send("AI Coaching API is running... 🚀"));

// App API Routers
app.use("/api/auth", authRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/users", usersRouter);
app.use("/api/workout", workoutRouter);
app.use("/api/coaches", coachesRouter);

// Analyze uploaded Word file
app.post("/api/analyze", upload.single("file"), analysisController.analyzeFile);

// Get analysis history
app.get("/api/history", async (req, res) => {
    try {
        const history = await Analysis.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 9️⃣ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));