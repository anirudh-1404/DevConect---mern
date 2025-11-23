import React, { useState } from "react";
import { Video, Image as ImageIcon, Mic } from "lucide-react";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnim from "../../Lottie/loadingAnim.json";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    file: null,
    content: "",
    postType: "text", // text, video, audio
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

      if (formData.file) {
        postForm.append("file", formData.file);
      }
      postForm.append("postType", formData.postType);

      const response = await API.post("/post/create", postForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully!");
      navigate("/profile");

      setFormData({ title: "", file: null, content: "", postType: "text" });
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
          <h1 className="text-5xl font-extrabold tracking-wide bg-gradient-to-r from-midnight-blue to-midnight-violet bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.45)]">
            Create a New Post
          </h1>
          <p className="text-slate-400 mt-2 text-sm tracking-wide">
            Share your ideas, insights & achievements with the DevConnect
            community.
          </p>
        </div>

        { }
        <div className="max-w-3xl mx-auto bg-midnight-gray/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-500">
          <form onSubmit={submitPost} className="space-y-8">
            <div>
              <label className="text-sm text-midnight-blue font-medium">
                Post Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: My Journey into MERN Stack 🚀"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-midnight-black border border-white/10 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/40 outline-none placeholder-slate-500 text-white transition-all duration-300"
              />
            </div>

            {/* Post Type Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, postType: "text", file: null })}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${formData.postType === "text"
                    ? "bg-midnight-blue text-white shadow-lg shadow-midnight-blue/25"
                    : "bg-midnight-black text-slate-400 hover:bg-white/5"
                  }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span>Text / Image</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, postType: "video", file: null })}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${formData.postType === "video"
                    ? "bg-midnight-violet text-white shadow-lg shadow-midnight-violet/25"
                    : "bg-midnight-black text-slate-400 hover:bg-white/5"
                  }`}
              >
                <Video className="w-5 h-5" />
                <span>Video Tutorial</span>
              </button>
            </div>

            <div>
              <label className="text-sm text-midnight-blue font-medium">
                {formData.postType === "video" ? "Upload Video" : "Upload Image (Optional)"}
              </label>
              <input
                type="file"
                accept={formData.postType === "video" ? "video/*" : "image/*"}
                onChange={(e) =>
                  setFormData({ ...formData, file: e.target.files[0] })
                }
                className="w-full mt-2 px-4 py-3 rounded-xl bg-midnight-black border border-white/10 file:bg-midnight-blue/10 file:border-0 file:px-4 file:py-2 file:text-midnight-blue file:rounded-full hover:file:bg-midnight-blue/20 transition-all duration-300 text-gray-300"
              />
              {formData.postType === "video" && (
                <p className="text-xs text-slate-500 mt-2">
                  Supported formats: MP4, MOV, AVI, MKV. Max size: 100MB.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-midnight-blue font-medium">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your thoughts, ideas, or story…"
                className="w-full mt-2 px-4 py-4 rounded-xl min-h-[160px] bg-midnight-black border border-white/10 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/40 outline-none placeholder-slate-500 text-white resize-none transition-all duration-300"
              ></textarea>
            </div>

            {!loading ? (
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-semibold text-lg hover:shadow-lg hover:shadow-midnight-blue/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
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
