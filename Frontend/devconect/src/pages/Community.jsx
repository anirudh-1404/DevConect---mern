import API from "@/API/Interceptor";
import { AuthContext } from "@/context/authContext";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const Community = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [likedBy, setLikedBy] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { isAuthenticated } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      const response = await API.get("/post");
      setAllPosts(response.data.allPosts);
    } catch (err) {
      console.log("Unable to fetch community posts!", err.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      await API.post(`/post/${postId}/like`);
      fetchPosts();
    } catch (err) {
      console.log("Like toggle failed", err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] px-6 py-12 text-white">
      <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text tracking-wide mb-16">
        DevConnect Community Feed
      </h1>

      <section className="max-w-3xl mx-auto space-y-8">
        {allPosts.map((item) => (
          <div
            key={item._id}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all duration-300"
          >
            {/* AUTHOR INFO */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={item?.author?.avatar || "https://github.com/shadcn.png"}
                alt="author-avatar"
                className="w-12 h-12 rounded-full border border-cyan-400"
              />

              <div>
                <h3 className="font-semibold text-lg">
                  {item?.author?.username}
                </h3>
                <p className="text-gray-400 text-xs">
                  Posted on {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* POST TITLE */}
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>

            {/* POST CONTENT */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {item.content}
            </p>

            {/* POST IMAGE (Optional) */}
            {item.image && (
              <img
                src={item.image}
                alt="post-img"
                className="w-full rounded-xl max-h-80 object-cover border border-cyan-400/30 shadow-md"
              />
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  if (!isAuthenticated) {
                    toast.error("Please login to like posts! 💬");
                    return;
                  }

                  handleLike(item._id);
                }}
                className={`text-xl transition-transform duration-200 ${
                  item.likes?.length > 0
                    ? "text-cyan-400 hover:scale-110"
                    : "text-gray-400 hover:text-cyan-300 hover:scale-110"
                }`}
              >
                {item.likes?.length > 0 ? "💙" : "🤍"}
              </button>

              <button
                onClick={() => {
                  setLikedBy(item.likes || []);
                  setShowModal(true);
                }}
                className="text-sm text-gray-400 hover:text-cyan-300 transition"
              >
                {item.likes?.length || 0} Likes
              </button>
            </div>
          </div>
        ))}
      </section>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-[#0f172a] border border-cyan-400/30 rounded-2xl p-6 w-96 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-cyan-400 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text mb-4">
              Liked By
            </h3>

            {likedBy.length === 0 ? (
              <p className="text-gray-400 text-center italic">
                No likes yet on this post.
              </p>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {likedBy.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition"
                  >
                    <img
                      src={user.avatar || "https://github.com/shadcn.png"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full border border-cyan-400"
                    />
                    <p className="text-sm font-medium">{user.username}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Community;
