"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BASE_URL_API}/auth/updateprofile`,
        formData,
        { withCredentials: true }
      );
      onUpdate(data);
      toast.success("Profile update successful!");
      onClose();
    } catch (err) {
      toast.error("❌ Error updating profile:", err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#0f172a] text-white rounded-2xl shadow-xl w-full max-w-md p-8 relative border border-cyan-400/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-white/10 border border-cyan-400/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Bio</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-white/10 border border-cyan-400/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Avatar URL
              </label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-white/10 border border-cyan-400/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-full font-medium hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-300 hover:text-red-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
