"use client";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/context/authContext";
import axios from "axios";
import UpdateProfile from "./UpdateProfile";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020617] to-[#0f172a]">
        <p className="text-gray-400 text-lg animate-pulse">
          Loading your profile...
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] text-white py-16 px-6">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-gray-400 text-sm">
          Manage your account and personal details
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-white/10 border border-cyan-400/20 rounded-2xl p-10 max-w-3xl mx-auto shadow-xl text-center backdrop-blur-lg">
          <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-cyan-400 shadow-lg">
            <AvatarImage
              src={user.avatar || "https://github.com/shadcn.png"}
              alt={user.username}
            />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-3xl font-semibold">{user.username}</h2>
          <p className="text-cyan-400 text-sm font-medium">{user.role}</p>

          <p className="text-gray-400 mt-1">{user.email}</p>

          <p className="text-gray-300 text-sm mt-4 max-w-lg mx-auto italic">
            {user.bio || "No bio added yet — share your developer story!"}
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div>
              <p className="text-2xl font-bold text-cyan-400">
                {user.projectsCount || 0}
              </p>
              <p className="text-gray-400 text-sm">Projects</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">
                {user.followers || 0}
              </p>
              <p className="text-gray-400 text-sm">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">
                {user.following || 0}
              </p>
              <p className="text-gray-400 text-sm">Following</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-2 px-6 rounded-full hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:scale-105 transition-all"
            >
              Edit Profile
            </button>
            <button
              className="bg-red-600/80 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-full"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </Card>
      </motion.div>

      {/* 🧩 Edit Profile Modal */}
      {isEditing && (
        <UpdateProfile
          user={user}
          onClose={() => setIsEditing(false)}
          onUpdate={(updatedUser) => setUser(updatedUser)}
        />
      )}

      <p className="text-gray-500 text-xs mt-16 text-center">
        Thanks for being a part of{" "}
        <span className="text-cyan-400">DevConnect</span> 🚀
      </p>
    </section>
  );
};

export default Profile;
