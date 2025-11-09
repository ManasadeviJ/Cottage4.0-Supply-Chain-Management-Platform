import express from "express";
import UserProfile from "../models/UserProfile.js";
import Address from "../models/Address.js";
import Payment from "../models/Payment.js";
import { protect } from "../middleware/authMiddleware.js";
import {loginUser,registerUser,getUserProfile, updateUserProfile} from "../controllers/userController.js";


const router = express.Router();

// Get user profile (with populated refs)
router.get("/:userId", async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId })
      .populate("addresses")
      .populate("paymentRefs");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put("/:userId", async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.params.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/profile", protect, getUserProfile);

router.put("/profile", protect, updateUserProfile);

export default router;
