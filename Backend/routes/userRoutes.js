import express from "express";
import {
  fetchAllUsers,
  fetchUserProfile,
  loginController,
  logoutController,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", fetchAllUsers);
router.post("/register", registerUser);
router.post("/login", loginController);
router.get("/profile", protectRoute, fetchUserProfile);
router.post("/logout", logoutController);
router.patch("/updateprofile", protectRoute, updateUserProfile);

export default router;
