import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
  createPostController,
  deletePostController,
  fetchAllPosts,
  fetchMyPosts,
  fetchPostByUser,
  updatePostController,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/create", protectRoute, createPostController);
router.get("/", fetchAllPosts);
router.get("/my", protectRoute, fetchMyPosts);
router.get("/user/:id", fetchPostByUser);
router.patch("/update/:id", protectRoute, updatePostController);
router.delete("/delete/:id", protectRoute, deletePostController);

export default router;
