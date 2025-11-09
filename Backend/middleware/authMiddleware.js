// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js";

// export const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       // Extract token
//       token = req.headers.authorization.split(" ")[1];
//       console.log("🧩 TOKEN from header:", token);

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("✅ Decoded token:", decoded);

//       // Attach user
//       req.user = await User.findById(decoded.id).select("-password");

//       next(); // continue to controller
//     } catch (error) {
//       console.error("❌ Token verification failed:", error.message);
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     res.status(401).json({ message: "Not authorized, no token" });
//   }
// };


import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // ✅ Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Attach user info (without password) to req.user
      req.user = await User.findById(decoded.id).select("-password");

      // If user not found
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next(); // Continue to the controller
    } catch (error) {
      console.error("❌ Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  // If no token found
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};
