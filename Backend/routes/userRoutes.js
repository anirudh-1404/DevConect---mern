import express from "express";
import {
  fetchUserProfile,
  loginController,
  logoutController,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginController);
router.get("/profile", protectRoute, fetchUserProfile);
router.post("/logout", logoutController);
router.post("/updateprofile", protectRoute, updateUserProfile);

export default router;
