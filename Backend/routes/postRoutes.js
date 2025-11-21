import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
  addComment,
  createPostController,
  deleteComment,
  deletePostController,
  fetchAllPosts,
  fetchMyPosts,
  fetchPostByUser,
  toggleLike,
  updatePostController,
  getPostById,
} from "../controllers/postController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post(
  "/create",
  protectRoute,
  upload.single("image"),
  createPostController
);
router.get("/", fetchAllPosts);
router.get("/my", protectRoute, fetchMyPosts);
router.get("/user/:id", fetchPostByUser);
router.get("/:id", getPostById);
router.patch("/update/:id", protectRoute, updatePostController);
router.delete("/delete/:id", protectRoute, deletePostController);
router.post("/:id/like", protectRoute, toggleLike);
router.post("/:id/comment", protectRoute, addComment);
router.delete("/:postId/comment/:commentId", protectRoute, deleteComment);

export default router;
