
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";



// ✅ Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.send("API is running successfully...");
});

// Routes
app.use("/api/users", userRoutes);
// app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
