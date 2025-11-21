"use client";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
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
} from "lucide-react";

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

  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading your profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#020617] text-white py-16 px-4 sm:px-6">
      { }
      <div className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
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
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-cyan-800/40 rounded-3xl p-8 shadow-[0_0_30px_rgba(6,182,212,0.15)] sticky top-20">
            { }
            <div className="text-center mb-6">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                <AvatarImage
                  src={user.avatar || "https://github.com/shadcn.png"}
                  alt={user.username}
                />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-cyan-500 to-blue-600">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-3xl font-bold text-white mb-1">
                {user.username}
              </h2>
              <p className="text-cyan-400 font-medium flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4" />
                {user.role}
              </p>
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
                className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-all group"
              >
                <p className="text-2xl font-bold text-cyan-400 group-hover:scale-110 transition-transform">
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
                className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-all group"
              >
                <p className="text-2xl font-bold text-blue-400 group-hover:scale-110 transition-transform">
                  {user.following?.length || 0}
                </p>
                <p className="text-gray-400 text-sm">Following</p>
              </button>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
              <p className="text-2xl font-bold text-purple-400">
                {post.length}
              </p>
              <p className="text-gray-400 text-sm">Posts</p>
            </div>

            { }
            <div className="space-y-3">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all"
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
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-cyan-800/40 rounded-3xl p-8 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-400" />
              Profile Information
            </h3>

            <div className="space-y-4">
              { }
              <div className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl">
                <Mail className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>

              { }
              {user.bio && (
                <div className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Bio</p>
                    <p className="text-white leading-relaxed">{user.bio}</p>
                  </div>
                </div>
              )}

              { }
              {user.location && (
                <div className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl">
                  <MapPin className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-medium">{user.location}</p>
                  </div>
                </div>
              )}

              { }
              {user.skills && user.skills.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl">
                  <Code className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-sm"
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
                    className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all group"
                  >
                    <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">GitHub</p>
                      <p className="text-white font-medium text-sm truncate group-hover:text-cyan-400">
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
                    className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all group"
                  >
                    <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">LinkedIn</p>
                      <p className="text-white font-medium text-sm truncate group-hover:text-cyan-400">
                        View Profile →
                      </p>
                    </div>
                  </a>
                )}
              </div>

              { }
              <div className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl">
                <Calendar className="w-5 h-5 text-cyan-400 mt-0.5" />
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
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-cyan-800/40 rounded-3xl p-8 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-cyan-400" />
              Your Posts ({post.length})
            </h3>

            {post.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all"
                  >
                    <h4 className="text-xl font-semibold text-white mb-3">
                      {item.title}
                    </h4>

                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full rounded-xl max-h-80 object-cover border border-cyan-400/20 mb-4"
                      />
                    )}

                    <p className="text-gray-300 leading-relaxed mb-4">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        onClick={() => {
                          setLikedBy(item.likes || []);
                          setLikesModal(true);
                        }}
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{item.likes?.length || 0} Likes</span>
                      </button>

                      <p className="text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      { }
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
            className="bg-gray-900 border border-cyan-400/40 rounded-3xl p-8 w-full max-w-md relative"
          >
            <button
              onClick={() => setLikesModal(false)}
              className="absolute top-4 right-5 text-gray-400 hover:text-cyan-300 text-2xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Liked By
            </h3>

            {likedBy.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No likes yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {likedBy.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center gap-4 bg-gray-800/40 p-4 rounded-xl border border-gray-700 hover:border-cyan-500/30 transition-all"
                  >
                    <img
                      src={u.avatar || "https://github.com/shadcn.png"}
                      alt={u.username}
                      className="w-12 h-12 rounded-full border-2 border-cyan-400"
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
            className="bg-gray-900 border border-cyan-500/30 rounded-3xl p-8 w-full max-w-md relative"
          >
            <button
              onClick={() =>
                setFollowModal({ open: false, type: "", list: [] })
              }
              className="absolute top-4 right-5 text-gray-400 hover:text-cyan-300 text-2xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              {followModal.type === "followers" ? "Followers" : "Following"}
            </h3>

            {followModal.list.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No users found.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {followModal.list.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/40 border border-gray-700 hover:border-cyan-500/30 transition-all"
                  >
                    <img
                      src={u.avatar || "https://github.com/shadcn.png"}
                      alt={u.username}
                      className="w-12 h-12 rounded-full border-2 border-cyan-400"
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
