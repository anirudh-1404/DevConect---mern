"use client";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import UpdateProfile from "./UpdateProfile";
import API from "@/API/Interceptor";
import {
  Mail,
  MapPin,
  Briefcase,
  Code,
  Github,
  Linkedin,
  Calendar,
  Award,
  Users,
  FileText,
  Heart,
  MessageCircle,
  Edit2,
  Trash2,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import EditPostModal from "@/components/profile/EditPostModal";
import DeleteConfirmDialog from "@/components/profile/DeleteConfirmDialog";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [post, setPost] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [likesModal, setLikesModal] = useState(false);
  const [likedBy, setLikedBy] = useState([]);

  const [followModal, setFollowModal] = useState({
    open: false,
    type: "",
    list: [],
  });

  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL_API}/auth/profile`,
          { withCredentials: true }
        );
        setUser(data);
      } catch (err) {
        console.error("Error fetching profile...", err);
      }
    };

    const fetchMyPosts = async () => {
      try {
        const response = await API.get("/post/my");
        console.log("My posts response:", response.data);
        setPost(response.data.myPosts || []);
      } catch (err) {
        console.log("Unable to fetch your posts", err);
        console.log("Error response:", err.response?.data);
        console.log("Error status:", err.response?.status);
        setPost([]);
      }
    };

    fetchProfile();
    fetchMyPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await API.delete(`/post/delete/${postId}`);
      toast.success("Post deleted successfully!");
      setPost(post.filter((p) => p._id !== postId));
    } catch (err) {
      toast.error("Error deleting post");
    }
  };

  const handleUpdatePost = (updatedPost) => {
    setPost(post.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handleAddComment = async (postId) => {
    try {
      if (!commentText[postId]?.trim()) {
        return toast.error("Comment cannot be empty!");
      }

      const { data } = await API.post(`/post/${postId}/comment`, {
        text: commentText[postId],
      });

      // Update the post with new comments
      setPost(post.map((p) =>
        p._id === postId ? { ...p, comments: data.comments } : p
      ));
      setCommentText({ ...commentText, [postId]: "" });
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Error adding comment");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await API.delete(`/post/${postId}/comment/${commentId}`);
      // Refresh the post to get updated comments
      const response = await API.get("/post/my");
      setPost(response.data.myPosts || []);
      toast.success("Comment deleted!");
    } catch (err) {
      toast.error("Error deleting comment");
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId],
    });
  };

  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-midnight-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-midnight-blue mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading your profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-midnight-black text-white py-16 px-4 sm:px-6">
      { }
      <div className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet mb-2">
            Your Profile
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage your account • Showcase your work • Connect with others
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        { }
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.15)] sticky top-20">
            { }
            <div className="text-center mb-6">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-midnight-blue shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <AvatarImage
                  src={user.avatar || "https://github.com/shadcn.png"}
                  alt={user.username}
                />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-midnight-blue to-midnight-violet">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-3xl font-bold text-white mb-1">
                {user.username}
              </h2>
              <p className="text-midnight-blue font-medium flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4" />
                {user.role}
              </p>
              {user.company && (
                <p className="text-gray-400 text-sm mt-2">
                  Working at: <span className="text-white font-medium">{user.company}</span>
                </p>
              )}
            </div>

            { }
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() =>
                  setFollowModal({
                    open: true,
                    type: "followers",
                    list: user.followers,
                  })
                }
                className="bg-midnight-gray/50 rounded-xl p-4 hover:bg-midnight-gray/70 transition-all group"
              >
                <p className="text-2xl font-bold text-midnight-blue group-hover:scale-110 transition-transform">
                  {user.followers?.length || 0}
                </p>
                <p className="text-gray-400 text-sm">Followers</p>
              </button>

              <button
                onClick={() =>
                  setFollowModal({
                    open: true,
                    type: "following",
                    list: user.following,
                  })
                }
                className="bg-midnight-gray/50 rounded-xl p-4 hover:bg-midnight-gray/70 transition-all group"
              >
                <p className="text-2xl font-bold text-midnight-violet group-hover:scale-110 transition-transform">
                  {user.following?.length || 0}
                </p>
                <p className="text-gray-400 text-sm">Following</p>
              </button>
            </div>

            <div className="bg-midnight-gray/50 rounded-xl p-4 mb-6">
              <p className="text-2xl font-bold text-white">
                {post.length}
              </p>
              <p className="text-gray-400 text-sm">Posts</p>
            </div>

            { }
            <div className="space-y-3">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-semibold hover:shadow-lg hover:shadow-midnight-blue/25 hover:scale-105 transition-all"
              >
                Edit Profile
              </button>

              <button
                onClick={() => logout()}
                className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500 hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          </Card>
        </motion.div>

        { }
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          { }
          <Card className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-midnight-blue" />
              Profile Information
            </h3>

            <div className="space-y-4">
              { }
              <div className="flex items-start gap-3 p-4 bg-midnight-gray/30 rounded-xl">
                <Mail className="w-5 h-5 text-midnight-blue mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>

              { }
              {user.bio && (
                <div className="flex items-start gap-3 p-4 bg-midnight-gray/30 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-midnight-blue mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Bio</p>
                    <p className="text-white leading-relaxed">{user.bio}</p>
                  </div>
                </div>
              )}

              { }
              {user.location && (
                <div className="flex items-start gap-3 p-4 bg-midnight-gray/30 rounded-xl">
                  <MapPin className="w-5 h-5 text-midnight-blue mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-medium">{user.location}</p>
                  </div>
                </div>
              )}

              { }
              {user.skills && user.skills.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-midnight-gray/30 rounded-xl">
                  <Code className="w-5 h-5 text-midnight-blue mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-midnight-blue/10 border border-midnight-blue/30 text-midnight-blue rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              { }
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-midnight-gray/30 rounded-xl hover:bg-midnight-gray/50 transition-all group"
                  >
                    <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">GitHub</p>
                      <p className="text-white font-medium text-sm truncate group-hover:text-midnight-blue">
                        View Profile →
                      </p>
                    </div>
                  </a>
                )}

                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-midnight-gray/30 rounded-xl hover:bg-midnight-gray/50 transition-all group"
                  >
                    <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">LinkedIn</p>
                      <p className="text-white font-medium text-sm truncate group-hover:text-midnight-blue">
                        View Profile →
                      </p>
                    </div>
                  </a>
                )}
              </div>

              { }
              <div className="flex items-start gap-3 p-4 bg-midnight-gray/30 rounded-xl">
                <Calendar className="w-5 h-5 text-midnight-blue mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-white font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          { }
          <Card className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-midnight-blue" />
              Your Posts ({post.length})
            </h3>

            {post.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-midnight-gray/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400">
                  You haven't posted anything yet
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Share your thoughts with the community!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {post.map((item) => (
                  <div
                    key={item._id}
                    className="bg-midnight-gray/30 border border-white/10 rounded-2xl p-6 hover:border-midnight-blue/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-semibold text-white flex-1">
                        {item.title}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingPost(item)}
                          className="p-2 text-gray-400 hover:text-midnight-blue hover:bg-midnight-blue/10 rounded-lg transition-all"
                          title="Edit post"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingPost(item._id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {item.postType === "video" && item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        controls
                        className="w-full rounded-xl max-h-80 bg-black border border-midnight-blue/20 mb-4"
                      />
                    ) : item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full rounded-xl max-h-80 object-cover border border-midnight-blue/20 mb-4"
                      />
                    )}

                    <p className="text-gray-300 leading-relaxed mb-4">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => {
                            setLikedBy(item.likes || []);
                            setLikesModal(true);
                          }}
                          className="flex items-center gap-2 text-gray-400 hover:text-midnight-blue transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{item.likes?.length || 0} Likes</span>
                        </button>

                        <button
                          onClick={() => toggleComments(item._id)}
                          className="flex items-center gap-2 text-gray-400 hover:text-midnight-blue transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{item.comments?.length || 0} Comments</span>
                        </button>
                      </div>

                      <p className="text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Comments Section */}
                    {expandedComments[item._id] && (
                      <div className="border-t border-white/10 pt-4 mt-4 space-y-4">
                        {/* Add Comment */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentText[item._id] || ""}
                            onChange={(e) =>
                              setCommentText({
                                ...commentText,
                                [item._id]: e.target.value,
                              })
                            }
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddComment(item._id);
                              }
                            }}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2 rounded-lg bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue transition-all"
                          />
                          <button
                            onClick={() => handleAddComment(item._id)}
                            className="px-4 py-2 bg-midnight-blue text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Comments List */}
                        {item.comments && item.comments.length > 0 && (
                          <div className="space-y-3">
                            {item.comments.map((comment) => (
                              <div
                                key={comment._id}
                                className="flex gap-3 bg-midnight-black/50 rounded-lg p-3"
                              >
                                <img
                                  src={
                                    comment.user?.avatar ||
                                    "https://github.com/shadcn.png"
                                  }
                                  alt={comment.user?.username}
                                  className="w-8 h-8 rounded-full border border-midnight-blue/30"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <p className="text-sm font-semibold text-midnight-blue">
                                      {comment.user?.username}
                                    </p>
                                    {comment.user?._id === user._id && (
                                      <button
                                        onClick={() =>
                                          handleDeleteComment(
                                            item._id,
                                            comment._id
                                          )
                                        }
                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-gray-300 text-sm mt-1">
                                    {comment.text}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={handleUpdatePost}
        />
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        onConfirm={() => handleDeletePost(deletingPost)}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />

      {/* Update Profile Modal */}
      {isEditing && (
        <UpdateProfile
          user={user}
          onClose={() => setIsEditing(false)}
          onUpdate={(u) => setUser(u)}
        />
      )}

      { }
      {likesModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-midnight-black border border-midnight-blue/40 rounded-3xl p-8 w-full max-w-md relative"
          >
            <button
              onClick={() => setLikesModal(false)}
              className="absolute top-4 right-5 text-gray-400 hover:text-midnight-blue text-2xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet">
              Liked By
            </h3>

            {likedBy.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No likes yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {likedBy.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center gap-4 bg-midnight-gray/40 p-4 rounded-xl border border-white/10 hover:border-midnight-blue/30 transition-all"
                  >
                    <img
                      src={u.avatar || "https://github.com/shadcn.png"}
                      alt={u.username}
                      className="w-12 h-12 rounded-full border-2 border-midnight-blue"
                    />
                    <p className="text-white font-medium">{u.username}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

      { }
      {followModal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-midnight-black border border-midnight-blue/30 rounded-3xl p-8 w-full max-w-md relative"
          >
            <button
              onClick={() =>
                setFollowModal({ open: false, type: "", list: [] })
              }
              className="absolute top-4 right-5 text-gray-400 hover:text-midnight-blue text-2xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet">
              {followModal.type === "followers" ? "Followers" : "Following"}
            </h3>

            {followModal.list.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No users found.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {followModal.list.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-midnight-gray/40 border border-white/10 hover:border-midnight-blue/30 transition-all"
                  >
                    <img
                      src={u.avatar || "https://github.com/shadcn.png"}
                      alt={u.username}
                      className="w-12 h-12 rounded-full border-2 border-midnight-blue"
                    />
                    <p className="text-white font-medium">{u.username}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Profile;
