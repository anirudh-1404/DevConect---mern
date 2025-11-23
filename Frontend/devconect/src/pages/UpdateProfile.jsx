import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import { X, Plus } from "lucide-react";

import SaveChangesLoader from "../../Lottie/SaveChangesLoader.json";

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: user?.avatar || null,
    skills: user?.skills || [],
    company: user?.company || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
  });
  const [currentSkill, setCurrentSkill] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("username", formData.username);
    form.append("bio", formData.bio);
    form.append("company", formData.company);
    form.append("linkedin", formData.linkedin);
    form.append("github", formData.github);
    form.append("skills", JSON.stringify(formData.skills));

    if (formData.avatar) {
      form.append("avatar", formData.avatar);
    }

    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BASE_URL_API}/auth/updateprofile`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      onUpdate(data);
      toast.success("Profile update successful!");
      setLoading(false);
      onClose();
    } catch (err) {
      toast.error("Error updating profile");
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()],
      });
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-midnight-gray text-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-midnight-blue/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="sticky top-0 bg-midnight-gray z-10 p-6 pb-4 border-b border-midnight-blue/20">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-midnight-blue to-midnight-violet bg-clip-text text-transparent">
              Edit Profile
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-white/10 border border-midnight-blue/20 text-white focus:outline-none focus:ring-2 focus:ring-midnight-blue"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Bio</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-white/10 border border-midnight-blue/20 text-white focus:outline-none focus:ring-2 focus:ring-midnight-blue"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google, Startup Inc."
                className="w-full p-2 rounded-md bg-white/10 border border-midnight-blue/20 text-white focus:outline-none focus:ring-2 focus:ring-midnight-blue"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">LinkedIn URL (Optional)</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full p-2 rounded-md bg-white/10 border border-midnight-blue/20 text-white focus:outline-none focus:ring-2 focus:ring-midnight-blue"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">GitHub URL (Optional)</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
                className="w-full p-2 rounded-md bg-white/10 border border-midnight-blue/20 text-white focus:outline-none focus:ring-2 focus:ring-midnight-blue"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Avatar</label>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.files[0] })
                }
                className="w-full p-2 rounded-md bg-white/10 border border-midnight-blue/20 text-white focus:outline-none focus:ring-2 focus:ring-midnight-blue"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Skills</label>
              <div className="space-y-3">
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-midnight-blue/20 text-midnight-blue border border-midnight-blue/30 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-midnight-blue/30 transition-colors"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-midnight-blue hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Add a skill (e.g., React, Node.js)"
                    className="flex-1 p-2 rounded-md bg-white/10 border border-midnight-blue/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-midnight-blue"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-midnight-blue/20 border border-midnight-blue/50 text-midnight-blue rounded-md hover:bg-midnight-blue hover:text-white transition-all flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {!loading ? (
              <div className="sticky bottom-0 bg-midnight-gray pt-6 pb-2 mt-8 border-t border-midnight-blue/20">
                <div className="flex justify-between items-center gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-midnight-blue to-midnight-violet text-white px-6 py-3 rounded-lg font-medium hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-gray-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all cursor-pointer border border-gray-600 hover:border-red-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full py-8">
                <Lottie
                  animationData={SaveChangesLoader}
                  loop={true}
                  className="w-16 h-16"
                />
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
