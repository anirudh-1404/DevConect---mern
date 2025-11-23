import express from "express";
import {
    savePost,
    unsavePost,
    getSavedPosts,
    checkIfPostSaved,
} from "../controllers/savedPostController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Get all saved posts for the logged-in user
router.get("/", getSavedPosts);

// Save a post
router.post("/:postId", savePost);

// Unsave a post
router.delete("/:postId", unsavePost);

// Check if a post is saved
router.get("/check/:postId", checkIfPostSaved);

export default router;
