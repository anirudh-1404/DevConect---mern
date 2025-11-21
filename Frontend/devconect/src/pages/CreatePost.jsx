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
      <section className="min-h-screen bg-[#020617] text-white px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.45)]">
            Create a New Post
          </h1>
          <p className="text-gray-400 mt-2 text-sm tracking-wide">
            Share your ideas, insights & achievements with the DevConnect
            community.
          </p>
        </div>

        {}
        <div
          className="
  max-w-3xl mx-auto 
  bg-gray-900/40 backdrop-blur-2xl
  border border-cyan-600/20 
  rounded-3xl p-12 
  shadow-[0_0_50px_rgba(6,182,212,0.25)]
  hover:shadow-[0_0_70px_rgba(6,182,212,0.35)]
  transition-all duration-500
"
        >
          <form onSubmit={submitPost} className="space-y-8">
            <div>
              <label className="text-sm text-cyan-300 font-medium">
                Post Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: My Journey into MERN Stack 🚀"
                className="
          w-full mt-2 px-4 py-3 rounded-xl 
          bg-white/5 border border-cyan-400/30
          focus:border-cyan-400 focus:ring-2 
          focus:ring-cyan-500/40 outline-none
          placeholder-gray-400 text-white 
          transition-all duration-300
        "
              />
            </div>

            <div>
              <label className="text-sm text-cyan-300 font-medium">
                Upload Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                className="
          w-full mt-2 px-4 py-3 rounded-xl 
          bg-white/5 border border-cyan-400/30
          file:bg-cyan-900/30 file:border-0 
          file:px-4 file:py-2
          file:text-cyan-300 file:rounded-full 
          hover:file:bg-cyan-900/40
          transition-all duration-300
          text-gray-300
        "
              />
            </div>

            <div>
              <label className="text-sm text-cyan-300 font-medium">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your thoughts, ideas, or story…"
                className="
          w-full mt-2 px-4 py-4 rounded-xl min-h-[160px]
          bg-white/5 border border-cyan-400/30
          focus:border-cyan-400 focus:ring-2 
          focus:ring-cyan-500/40 outline-none
          placeholder-gray-400 text-white 
          resize-none transition-all duration-300
        "
              ></textarea>
            </div>

            {!loading ? (
              <button
                type="submit"
                className="
          w-full py-4 rounded-full 
          bg-gradient-to-r from-cyan-400 to-blue-600
          text-white font-semibold text-lg
          hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]
          hover:scale-[1.03] active:scale-[0.98]
          transition-all duration-300 cursor-crosshair
        "
              >
                Publish Post 🚀
              </button>
            ) : (
              <div className="flex justify-center py-6">
                <Lottie
                  animationData={loadingAnim}
                  loop
                  className="w-28 h-28 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]"
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
