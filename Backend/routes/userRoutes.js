import express from "express";
import {loginUser,registerUser,getUserProfile, updateUserProfile} from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile/update", protect, updateUserProfile);


export default router;
