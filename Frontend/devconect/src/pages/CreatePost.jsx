import React, { useState } from "react";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    content: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitPost = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/post/create", formData);
      console.log("Post Created:", response.data);
      toast.success("Post created successfully!");
      navigate("/profile");
      setFormData({ title: "", image: "", content: "" });
    } catch (err) {
      console.log("Error creating post:", err.message);
    }
  };

  return (
    <main>
      <section className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] text-white px-6 py-16">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text tracking-wide mb-8">
            Create a New Post
          </h1>

          <form onSubmit={submitPost} className="space-y-6">
            <div>
              <label className="text-sm text-gray-300">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/20 placeholder-gray-400 text-white outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Image URL (optional)
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Paste image link"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/20 placeholder-gray-400 text-white outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content..."
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/20 placeholder-gray-400 text-white outline-none min-h-[140px] resize-none focus:border-cyan-400 transition"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-[1.02] transition text-white font-medium tracking-wide"
            >
              Publish Post 🚀
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default CreatePost;
