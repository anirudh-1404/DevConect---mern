import API from "@/API/Interceptor";
import { AuthContext } from "@/context/authContext";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Trash2 } from "lucide-react";

const Community = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [likedBy, setLikedBy] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});

  const { isAuthenticated, user } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await API.get("/post");
      setAllPosts(response.data.allPosts);
    } catch (err) {
      console.log("Unable to fetch community posts!", err.message);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
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

  const handleAddComment = async (postId) => {
    try {
      if (!commentText[postId]?.trim()) return toast.error("Write a comment!");

      await API.post(
        `/post/${postId}/comment`,
        { text: commentText[postId] },
        { withCredentials: true }
      );

      setCommentText((prev) => ({ ...prev, [postId]: "" }));
      toast.success("Comment added!");
      fetchPosts();
    } catch (err) {
      console.log("Failed to add comment", err.message);
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await API.delete(`/post/${postId}/comment/${commentId}`);
      toast.success("Comment deleted!");
      fetchPosts();
    } catch (err) {
      console.log("Failed to delete comment", err.message);
      toast.error("Failed to delete comment");
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const localUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <main className="min-h-screen bg-midnight-black text-white px-4 sm:px-6 py-16 relative overflow-hidden">
      { }
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-midnight-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-midnight-violet/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      { }
      <div className="relative z-10 text-center mb-16 max-w-4xl mx-auto">
        <div className="inline-block mb-4">
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-midnight-blue/20 to-midnight-violet/20 
          border border-midnight-blue/30 text-midnight-blue text-sm font-semibold backdrop-blur-sm">
            Community Feed
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text 
        bg-gradient-to-r from-midnight-blue via-blue-500 to-midnight-violet tracking-tight 
        drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-6 animate-gradient">
          DevConnect Community
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Share knowledge, collaborate on ideas, and discover what fellow
          developers & recruiters are building right now.
        </p>
      </div>

      { }
      <div className="relative z-10 w-full flex justify-center mb-16">
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-midnight-blue to-transparent rounded-full 
        shadow-[0_0_25px_rgba(59,130,246,0.5)]"></div>
      </div>

      { }
      {loading ? (
        <section className="max-w-3xl mx-auto space-y-8 relative z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 
            rounded-3xl p-8 animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gray-800"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-800 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-24"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-5/6"></div>
            </div>
          ))}
        </section>
      ) : allPosts.length === 0 ? (

        <section className="max-w-3xl mx-auto relative z-10">
          <div className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 
          rounded-3xl p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-midnight-blue/20 to-midnight-violet/20 
            flex items-center justify-center border border-midnight-blue/30">
              <MessageCircle className="w-12 h-12 text-midnight-blue" />
            </div>
            <h3 className="text-2xl font-bold text-midnight-blue mb-3">No Posts Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Be the first to share something with the community! Create a post to get started.
            </p>
          </div>
        </section>
      ) : (

        <section className="max-w-3xl mx-auto space-y-8 relative z-10">
          {allPosts.map((item) => {
            const isLiked = item.likes?.some(like => String(like._id) === String(localUser._id));
            const commentsExpanded = expandedComments[item._id];

            return (
              <article
                key={item._id}
                className="group bg-midnight-gray/60 backdrop-blur-xl border border-white/10 
                rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(59,130,246,0.15)]
                hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:border-midnight-blue/60
                transition-all duration-500 relative overflow-hidden"
              >
                { }
                <div className="absolute inset-0 bg-gradient-to-br from-midnight-blue/5 to-midnight-violet/5 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                { }
                <div className="relative flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={item?.author?.avatar || "https://github.com/shadcn.png"}
                        className="w-14 h-14 rounded-full object-cover border-2 border-midnight-blue 
                        shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform"
                        alt="avatar"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full 
                      border-2 border-gray-900"></div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-midnight-blue hover:text-blue-400 
                        transition cursor-pointer">
                          {item?.author?.username}
                        </h3>
                        {item?.author?.role && (
                          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full 
                          bg-gradient-to-r from-midnight-blue/20 to-midnight-violet/20 
                          text-midnight-blue border border-midnight-blue/30">
                            {item.author.role}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-400 text-xs flex items-center gap-1">
                        <span>{new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </p>
                    </div>
                  </div>

                  { }
                  <button className="p-2 rounded-full hover:bg-gray-800/50 transition">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                { }
                <div className="relative mb-6">
                  <h2 className="text-2xl font-bold mb-3 tracking-tight bg-gradient-to-r from-white to-gray-300 
                  bg-clip-text text-transparent">
                    {item.title}
                  </h2>

                  <p className="text-gray-300 text-base leading-relaxed">
                    {item.content}
                  </p>
                </div>

                { }
                {/* Post Media (Video or Image) */}
                {item.postType === "video" && item.videoUrl ? (
                  <div className="relative mb-6 group/image">
                    <video
                      src={item.videoUrl}
                      controls
                      className="w-full rounded-2xl max-h-96 bg-black border border-midnight-blue/30 
                      shadow-[0_0_30px_rgba(59,130,246,0.25)]"
                    />
                  </div>
                ) : item.image && (
                  <div className="relative mb-6 group/image">
                    <img
                      src={item.image}
                      alt="post"
                      className="w-full rounded-2xl max-h-96 object-cover border border-midnight-blue/30 
                      shadow-[0_0_30px_rgba(59,130,246,0.25)] group-hover/image:scale-[1.02] 
                      transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent 
                    rounded-2xl opacity-0 group-hover/image:opacity-100 transition-opacity"></div>
                  </div>
                )}

                { }
                <div className="relative flex items-center gap-6 py-4 border-y border-white/10">
                  { }
                  <button
                    onClick={() => {
                      if (!isAuthenticated)
                        return toast.error("Please login to like posts!");
                      handleLike(item._id);
                    }}
                    className="group/like flex items-center gap-2 transition-all duration-300"
                  >
                    <div className="relative">
                      <Heart
                        className={`w-6 h-6 transition-all duration-300 ${isLiked
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-gray-400 group-hover/like:text-red-400 group-hover/like:scale-110"
                          }`}
                      />
                      {isLiked && (
                        <div className="absolute inset-0 animate-ping">
                          <Heart className="w-6 h-6 text-red-500 opacity-75" />
                        </div>
                      )}
                    </div>
                    <span
                      className="text-sm font-medium cursor-pointer hover:text-midnight-blue transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLikedBy(item.likes || []);
                        setShowModal(true);
                      }}
                    >
                      <span className={isLiked ? "text-red-400" : "text-gray-400"}>
                        {item.likes?.length || 0}
                      </span>
                      <span className="text-gray-500 ml-1">
                        {item.likes?.length === 1 ? 'Like' : 'Likes'}
                      </span>
                    </span>
                  </button>

                  { }
                  <button
                    onClick={() => toggleComments(item._id)}
                    className="flex items-center gap-2 hover:text-midnight-blue transition group/comment"
                  >
                    <MessageCircle className="w-6 h-6 text-gray-400 group-hover/comment:text-midnight-blue 
                    group-hover/comment:scale-110 transition-all" />
                    <span className="text-sm font-medium text-gray-400 group-hover/comment:text-midnight-blue">
                      {item.comments?.length || 0} {item.comments?.length === 1 ? 'Comment' : 'Comments'}
                    </span>
                  </button>

                  { }
                  <button className="flex items-center gap-2 hover:text-midnight-blue transition group/share ml-auto">
                    <Share2 className="w-5 h-5 text-gray-400 group-hover/share:text-midnight-blue 
                    group-hover/share:scale-110 transition-all" />
                  </button>

                  { }
                  <button className="flex items-center gap-2 hover:text-midnight-blue transition group/bookmark">
                    <Bookmark className="w-5 h-5 text-gray-400 group-hover/bookmark:text-midnight-blue 
                    group-hover/bookmark:scale-110 transition-all" />
                  </button>
                </div>

                { }
                <div className={`relative transition-all duration-500 overflow-hidden ${commentsExpanded ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
                  }`}>
                  { }
                  {item.comments?.length > 0 && (
                    <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/10">
                      <MessageCircle className="w-5 h-5 text-midnight-blue" />
                      <h4 className="text-sm font-semibold text-midnight-blue">
                        {item.comments.length} {item.comments.length === 1 ? 'Comment' : 'Comments'}
                      </h4>
                    </div>
                  )}

                  { }
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {item.comments?.map((c) => (
                      <div
                        key={c._id}
                        className="flex gap-3 bg-midnight-gray/40 p-4 rounded-xl border border-white/10
                        hover:bg-midnight-gray/60 hover:border-midnight-blue/30 transition-all duration-300 group/comment"
                      >
                        <img
                          src={c.user?.avatar || "https://github.com/shadcn.png"}
                          className="w-10 h-10 rounded-full border border-midnight-blue/50 
                          shadow-[0_0_15px_rgba(59,130,246,0.3)] flex-shrink-0"
                          alt=""
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-midnight-blue">
                              {c.user?.username}
                            </p>
                            {String(c.user?._id) === String(localUser._id) && (
                              <button
                                onClick={() => handleDeleteComment(item._id, c._id)}
                                className="opacity-0 group-hover/comment:opacity-100 p-1.5 rounded-lg 
                                hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed break-words">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  { }
                  <div className="flex gap-3">
                    <img
                      src={localUser?.avatar || "https://github.com/shadcn.png"}
                      className="w-10 h-10 rounded-full border border-midnight-blue/50 flex-shrink-0"
                      alt=""
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText[item._id] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [item._id]: e.target.value,
                          }))
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (!isAuthenticated) return toast.error("Please login to comment!");
                            handleAddComment(item._id);
                          }
                        }}
                        className="flex-1 px-4 py-3 rounded-xl bg-midnight-gray/60 border border-midnight-blue/30 
                        text-white placeholder-gray-400 focus:ring-2 focus:ring-midnight-blue/40 
                        focus:border-midnight-blue/50 outline-none transition-all"
                      />

                      <button
                        onClick={() => {
                          if (!isAuthenticated)
                            return toast.error("Please login to comment!");
                          handleAddComment(item._id);
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-midnight-blue to-midnight-violet 
                        text-white font-semibold hover:from-blue-600 hover:to-violet-600
                        hover:scale-105 active:scale-95 transition-all shadow-lg 
                        shadow-midnight-blue/25 hover:shadow-midnight-blue/40"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      { }
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 
        animate-fadeIn">
          <div
            className="bg-midnight-gray/95 border border-midnight-blue/40 rounded-2xl p-6 w-96 max-w-[90vw]
            shadow-[0_0_60px_rgba(59,130,246,0.5)] relative animate-scaleIn"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-midnight-blue 
              hover:rotate-90 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-midnight-blue to-midnight-violet 
              text-transparent bg-clip-text">
                Liked By
              </h3>
            </div>

            {likedBy.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No likes yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {likedBy.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 bg-midnight-gray/40 p-3 rounded-xl 
                    border border-white/10 hover:bg-midnight-gray/60 hover:border-midnight-blue/30
                    transition-all duration-300 cursor-pointer group"
                  >
                    <img
                      src={user.avatar || "https://github.com/shadcn.png"}
                      className="w-12 h-12 rounded-full border-2 border-midnight-blue/50 
                      group-hover:border-midnight-blue transition-all"
                      alt=""
                    />
                    <div>
                      <p className="font-semibold text-midnight-blue group-hover:text-blue-400 transition">
                        {user.username}
                      </p>
                      {user.role && (
                        <p className="text-xs text-gray-400">{user.role}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
};

export default Community;
