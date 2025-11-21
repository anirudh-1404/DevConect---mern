import express from "express";
import {
  fetchAllUsers,
  fetchUserProfile,
  loginController,
  logoutController,
  registerUser,
  toggleFollowUser,
  updateUserProfile,
  getUserById,
} from "../controllers/userController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get("/", fetchAllUsers);
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginController);
router.get("/profile", protectRoute, fetchUserProfile);
router.post("/logout", logoutController);
router.patch(
  "/updateprofile",
  upload.single("avatar"),
  protectRoute,
  updateUserProfile
);
router.post("/follow/:id", protectRoute, toggleFollowUser);
router.get("/:id", protectRoute, getUserById);

export default router;
