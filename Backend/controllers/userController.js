// import User from "../models/User.js";
// import UserProfile from "../models/UserProfile.js";
// import bcrypt from "bcryptjs";
// import  generateToken from "../utils/generateToken.js";

// // ✅ GET USER PROFILE (merged data)
// export const getUserProfile = async (req, res) => {
//   try {
//     const userId = req.user.id; // from auth middleware (decoded token)

//     // Fetch from both collections
//     const user = await User.findById(userId).select("-password");
//     const profile = await UserProfile.findOne({ userId: user._id  });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Merge both models into one response object
//     const combinedProfile = {
//       ...user.toObject(),
//       ...(profile ? profile.toObject() : {}),
//     };

//     res.status(200).json({ user: combinedProfile });
//   } catch (err) {
//     console.error("Error fetching profile:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ UPDATE USER PROFILE (updates both User + UserProfile)
// export const updateUserProfile = async (req, res) => {
//   try {
//     const userId = req.user.id; // from auth middleware
//     const {
//       name,
//       email,
//       location,
//       phone,
//       dob,
//       gender,
//       bio,
//       role,
//       farmerDetails,
//       cottagerDetails,
//       buyerDetails,
//       logisticsDetails,
//     } = req.body;

//     // --- Update base User ---
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { name, email, location, role },
//       { new: true }
//     ).select("-password");

//     // --- Update or create UserProfile ---
//     let profile = await UserProfile.findOne({ userId });
//     if (!profile) {
//       profile = new UserProfile({ userId });
//     }

//     profile.phone = phone;
//     profile.dob = dob;
//     profile.gender = gender;
//     profile.bio = bio;

//     // Role-based details — clear old ones to avoid wrong data
//     profile.farmerDetails = undefined;
//     profile.cottagerDetails = undefined;
//     profile.buyerDetails = undefined;
//     profile.logisticsDetails = undefined;

//     if (role === "farmer") profile.farmerDetails = farmerDetails;
//     if (role === "cottager") profile.cottagerDetails = cottagerDetails;
//     if (role === "buyer") profile.buyerDetails = buyerDetails;
//     if (role === "logistics") profile.logisticsDetails = logisticsDetails;


//     profile.updatedAt = new Date();
//     await profile.save();

//     // Merge for response
//     const combinedProfile = {
//       ...updatedUser.toObject(),
//       ...profile.toObject(),
//     };

//     res.status(200).json({
//       message: "Profile updated successfully",
//       user: combinedProfile,
//     });
//   } catch (err) {
//     console.error("❌ Error updating profile:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, location, role } = req.body;

//     if (!name || !email || !password || !location || !role) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // 🔒 Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = new User({
//       name,
//       email,
//       password,
//       location,
//       role,
//     });

//     await user.save();

//     res.status(201).json({ message: "Registration successful", user });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("📩 Login attempt:", email);

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // ✅ generate a valid token string
//     const token = generateToken(user._id);
//     console.log("🟢 Token generated:", token);

//     // fetch profile if exists
//     const profile = await UserProfile.findOne({ userId: user._id });

//     const combinedProfile = {
//       ...user.toObject(),
//       ...(profile ? profile.toObject() : {}),
//       token, // ✅ attach token here
//     };

//     res.status(200).json({
//       message: "Login successful",
//       user: combinedProfile,
//     });
//   } catch (err) {
//     console.error("❌ Login Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

/* ============================================================
   ✅ GET USER PROFILE (merged data)
============================================================ */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware (decoded token)

    // Fetch from both collections
    const user = await User.findById(userId).select("-password");
    const profile = await UserProfile.findOne({ userId: user._id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Merge both models into one response object
    const combinedProfile = {
      ...user.toObject(),
      ...(profile ? profile.toObject() : {}),
    };

    res.status(200).json({ user: combinedProfile });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   ✅ UPDATE USER PROFILE (updates both User + UserProfile)
============================================================ */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      location,
      phone,
      dob,
      gender,
      bio,
      role,
      farmerDetails,
      cottagerDetails,
      buyerDetails,
      logisticsDetails,
    } = req.body;

    // --- Update base User ---
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, location, role },
      { new: true }
    ).select("-password");

    // --- Update or create UserProfile ---
    let profile = await UserProfile.findOne({ userId });
    if (!profile) {
      profile = new UserProfile({ userId });
    }

    profile.phone = phone;
    profile.dob = dob;
    profile.gender = gender;
    profile.bio = bio;

    // Clear old role-specific data to avoid cross-role pollution
    profile.farmerDetails = undefined;
    profile.cottagerDetails = undefined;
    profile.buyerDetails = undefined;
    profile.logisticsDetails = undefined;

    if (role === "farmer") profile.farmerDetails = farmerDetails;
    if (role === "cottager") profile.cottagerDetails = cottagerDetails;
    if (role === "buyer") profile.buyerDetails = buyerDetails;
    if (role === "logistics") profile.logisticsDetails = logisticsDetails;

    profile.updatedAt = new Date();
    await profile.save();

    const combinedProfile = {
      ...updatedUser.toObject(),
      ...profile.toObject(),
    };

    res.status(200).json({
      message: "Profile updated successfully",
      user: combinedProfile,
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   ✅ REGISTER USER (Fixed double hashing issue)
============================================================ */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, location, role } = req.body;

    if (!name || !email || !password || !location || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ No manual hashing — handled by userSchema.pre('save')
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      location,
      role,
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   ✅ LOGIN USER (Fixed token + bcrypt match)
============================================================ */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📩 Login attempt:", email);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);
    console.log("🔑 Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate a proper JWT token
    const token = generateToken(user._id);
    console.log("🟢 Token generated:", token);

    // Fetch profile if exists
    const profile = await UserProfile.findOne({ userId: user._id });

    // Combine user + profile data
    const combinedProfile = {
      ...user.toObject(),
      ...(profile ? profile.toObject() : {}),
      token,
    };

    res.status(200).json({
      message: "Login successful",
      user: combinedProfile,
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
