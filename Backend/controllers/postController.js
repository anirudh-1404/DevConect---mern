import { Post } from "../models/PostSchema.js";

export const createPostController = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title or Content is required!" });
    }

    const post = await Post.create({
      title,
      content,
      image: req.file.path,
      author: req.user._id,
    });

    res.status(201).json({
      message: "Post created successfully!",
      post,
    });
  } catch (err) {
    res.status(500).json({ message: "Unable to create post!" });
  }
};

export const fetchAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({})
      .populate("author", "username avatar")
      .populate("likes", "username avatar")
      .populate("comments.user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "All posts fetched!", allPosts });
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch posts!" });
  }
};

export const fetchPostByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate("author", "username avatar")
      .populate("likes", "username avatar")
      .populate("comments.user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "User posts fetched!", posts });
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch user posts!" });
  }
};

export const fetchMyPosts = async (req, res) => {
  try {
    const myPosts = await Post.find({ author: req.user._id })
      .populate("likes", "username avatar")
      .populate("comments.user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Your posts fetched!", myPosts });
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch your posts!" });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found!" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update!" });
    }

    const updated = await Post.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({ message: "Post updated!", updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating post!" });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found!" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post!" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params; // postId
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((l) => l.toString() !== userId.toString());
      await post.save();
      return res
        .status(200)
        .json({ message: "Post unliked!", likes: post.likes.length });
    } else {
      post.likes.push(userId);
      await post.save();
      return res
        .status(200)
        .json({ message: "Post liked!", likes: post.likes.length });
    }
  } catch (err) {
    return res.status(500).json({ message: "Like/unlike error!" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // postId
    const userId = req.user._id;
    const { text } = req.body;

    if (!text.trim())
      return res.status(400).json({ message: "Text is required!" });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found!" });

    post.comments.push({
      user: userId,
      text,
    });

    await post.save();

    const updatedPost = await Post.findById(id).populate(
      "comments.user",
      "username avatar"
    );

    res.status(200).json({
      message: "Comment added!",
      comments: updatedPost.comments,
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment!" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found!" });

    const comment = post.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found!" });

    if (comment.user.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Not authorized!" });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({ message: "Comment deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment!" });
  }
};
