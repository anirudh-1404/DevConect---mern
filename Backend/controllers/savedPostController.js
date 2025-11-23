import { SavedPost } from "../models/SavedPostSchema.js";
import { Post } from "../models/PostSchema.js";

// Save a post
export const savePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if already saved
        const existingSave = await SavedPost.findOne({ user: userId, post: postId });
        if (existingSave) {
            return res.status(400).json({ message: "Post already saved" });
        }

        // Save the post
        const savedPost = await SavedPost.create({
            user: userId,
            post: postId,
        });

        res.status(201).json({
            message: "Post saved successfully",
            savedPost,
        });
    } catch (error) {
        console.error("Error saving post:", error);
        res.status(500).json({ message: "Failed to save post" });
    }
};

// Unsave a post
export const unsavePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const result = await SavedPost.findOneAndDelete({
            user: userId,
            post: postId,
        });

        if (!result) {
            return res.status(404).json({ message: "Saved post not found" });
        }

        res.status(200).json({ message: "Post unsaved successfully" });
    } catch (error) {
        console.error("Error unsaving post:", error);
        res.status(500).json({ message: "Failed to unsave post" });
    }
};

// Get all saved posts for a user
export const getSavedPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        const savedPosts = await SavedPost.find({ user: userId })
            .populate({
                path: "post",
                populate: {
                    path: "author",
                    select: "username avatar role",
                },
            })
            .sort({ createdAt: -1 });

        // Filter out any saved posts where the post has been deleted
        const validSavedPosts = savedPosts.filter((saved) => saved.post !== null);

        res.status(200).json({
            savedPosts: validSavedPosts,
            count: validSavedPosts.length,
        });
    } catch (error) {
        console.error("Error fetching saved posts:", error);
        res.status(500).json({ message: "Failed to fetch saved posts" });
    }
};

// Check if a post is saved by the user
export const checkIfPostSaved = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const savedPost = await SavedPost.findOne({ user: userId, post: postId });

        res.status(200).json({ isSaved: !!savedPost });
    } catch (error) {
        console.error("Error checking saved post:", error);
        res.status(500).json({ message: "Failed to check saved status" });
    }
};
