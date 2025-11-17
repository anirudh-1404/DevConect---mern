import React, { useState } from "react";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnim from "../../Lottie/loadingAnim.json";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitPost = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a post title!");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Post content cannot be empty!");
      return;
    }

    setLoading(true);

    try {
      const postForm = new FormData();
      postForm.append("title", formData.title);
      postForm.append("content", formData.content);

      if (formData.image) {
        postForm.append("image", formData.image);
      }

      const response = await API.post("/post/create", postForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully!");
      navigate("/profile");

      setFormData({ title: "", image: null, content: "" });
    } catch (err) {
      toast.error("Error creating post");
      console.log("Error creating post:", err.message);
    } finally {
      setLoading(false);
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
              <label className="text-sm text-gray-300">Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                placeholder="Upload image"
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

            {!loading ? (
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-[1.02] transition text-white font-medium tracking-wide"
              >
                Publish Post 🚀
              </button>
            ) : (
              <div className="w-full flex justify-center items-center py-3">
                <Lottie
                  animationData={loadingAnim}
                  loop={true}
                  className="w-20 h-20 brightness-125 saturate-150"
                />
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

export default CreatePost;
