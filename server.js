// 1️⃣ Imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";

// 2️⃣ Load environment variables
dotenv.config();

// 3️⃣ Import Controllers & Models
import * as analysisController from "./controllers/analysisController.js";
import Analysis from "./models/Analysis.js";

// 4️⃣ Initialize app
const app = express();

// 5️⃣ Middlewares
app.use(cors({
    origin: "http://localhost:3000", // الفرونت اند بتاعك
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());

// 6️⃣ Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// 7️⃣ Database Connection
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/coaching_db";
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.log("💡 Make sure MongoDB is running locally or check your URI in .env");
  });

// 8️⃣ Routes

// Root
app.get("/", (req, res) => res.send("AI Coaching API is running... 🚀"));

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