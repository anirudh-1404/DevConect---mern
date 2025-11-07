import { Post } from "../models/PostSchema.js";

export const createPostController = async (req, res, next) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title or Content is required!",
      });
    }

    const post = await Post.create({
      title,
      content,
      image,
      author: req.user._id,
    });

    res.status(201).json({
      message: "Post created successfully!",
      post,
    });
  } catch (err) {
    res.status(500).json({
      messgae: "Unable to create post!",
    });
  }
};

export const fetchAllPosts = async (req, res, next) => {
  try {
    const allPosts = await Post.find({})
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    if (!allPosts || allPosts.length === 0) {
      return res.status(401).json({
        message: "No posts found!",
      });
    }

    res.status(200).json({
      message: "All posts fetched successfully!",
      allPosts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to fetch posts!",
    });
  }
};

export const fetchPostByUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userPosts = await Post.find({ author: id })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    if (!userPosts || userPosts.length === 0) {
      return res.status(200).json({
        message: "This user has not created any posts yet.",
        posts: [],
      });
    }

    res.status(200).json({
      message: "Posts fetched successfully.",
      posts: userPosts,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch user's posts!",
    });
  }
};

export const fetchMyPosts = async (req, res, next) => {
  try {
    const myPosts = await Post.find({ author: req.user._id }).sort({
      createdAt: -1,
    });

    if (!myPosts || myPosts.length === 0) {
      return res.status(401).json({
        message: "No posts found!",
      });
    }

    res.status(200).json({
      message: "Your posts fetched successfully!",
      myPosts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to fetch your posts!",
    });
  }
};

export const updatePostController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;

    const posts = await Post.findById(id);

    if (posts.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to edit this post!",
      });
    }

    if (!posts) {
      return res.status(401).json({
        messgae: "No posts found!",
      });
    }
    const updatePost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        content,
        image,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Post update successful!",
      updatePost,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while updating posts!",
    });
  }
};

export const deletePostController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const postToDelete = await Post.findById(id);

    if (postToDelete.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this post!",
      });
    }

    if (!postToDelete) {
      return res.status(400).json({
        messgae: "Post not found!",
      });
    }

    await postToDelete.deleteOne();

    res.status(200).json({
      message: "Post deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while deleting this post!",
    });
  }
};
