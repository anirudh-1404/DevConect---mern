"use client";
import React, { useContext, useEffect, useState } from "react";
import { keyframes, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/context/authContext";
import axios from "axios";
import UpdateProfile from "./UpdateProfile";
import API from "@/API/Interceptor";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [post, setPost] = useState([]);
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

    const fetchMyPosts = async () => {
      try {
        const response = await API.get("/post/my");
        setPost(response.data.myPosts);
      } catch (err) {
        console.log("Unable to fetch your posts");
      }
    };
    fetchProfile();
    fetchMyPosts();
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-gray-400 text-sm">
          Manage your account and personal details
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-1 sticky top-24 h-fit"
        >
          <Card className="bg-white/10 border border-cyan-400/20 rounded-2xl p-8 text-center backdrop-blur-lg shadow-xl">
            <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-cyan-400 shadow-lg">
              <AvatarImage
                src={user.avatar || "https://github.com/shadcn.png"}
                alt={user.username}
              />
              <AvatarFallback>
                {user.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-3xl font-semibold">{user.username}</h2>
            <p className="text-cyan-400 text-sm font-medium mt-1">
              {user.role}
            </p>
            <p className="text-gray-400 mt-1 text-sm">{user.email}</p>

            <p className="text-gray-300 text-sm mt-4 italic">
              {user.bio || "No bio added yet — share your developer story!"}
            </p>

            <div className="flex flex-col gap-3 mt-10">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-2 rounded-full hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:scale-105 transition-all"
              >
                Edit Profile
              </button>
              <button
                className="bg-red-600/80 hover:bg-red-700 text-white font-medium py-2 rounded-full"
                onClick={() => logout()}
              >
                Logout
              </button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-2 space-y-8"
        >
          {post.length === 0 ? (
            <Card className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <p className="text-gray-400 text-center italic">
                Your posts will appear here...
              </p>
            </Card>
          ) : (
            post.map((item) => (
              <Card
                key={item._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-300"
              >
                <h2 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h2>

                {item.image && (
                  <img
                    src={item.image}
                    alt="post-img"
                    className="w-full rounded-xl max-h-72 object-cover border border-cyan-400/30 mb-3"
                  />
                )}

                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.content}
                </p>

                <p className="text-gray-500 text-xs mt-4 text-right">
                  Posted on {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </Card>
            ))
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <UpdateProfile
          user={user}
          onClose={() => setIsEditing(false)}
          onUpdate={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </section>
  );
};

export default Profile;
