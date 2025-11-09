import User from "../models/userModel.js";
import UserProfile from "../models/UserProfile.js";

// ✅ GET PROFILE (join User + UserProfile)
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user basic info
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find extended profile
    const profile = await UserProfile.findOne({ userId }).populate("addresses paymentRefs");

    res.status(200).json({
      user,
      profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CREATE OR UPDATE PROFILE (PUT)
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userUpdates, profileUpdates } = req.body;

    // 1️⃣ Update base user
    const user = await User.findByIdAndUpdate(userId, userUpdates, { new: true }).select("-password");

    // 2️⃣ Upsert profile (create if not exists)
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: profileUpdates, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user,
      profile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
