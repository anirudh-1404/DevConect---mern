import API from "@/API/Interceptor";
import { AuthContext } from "@/context/authContext";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likedBy, setLikedBy] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentText, setCommentText] = useState("");

    const { isAuthenticated } = useContext(AuthContext);
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchPost = async () => {
        try {
            const response = await API.get(`/posts/${id}`);
            setPost(response.data.post);
            setLoading(false);
        } catch (err) {
            console.log("Unable to fetch post!", err.message);
            toast.error("Post not found or deleted");
            navigate("/community");
        }
    };

    const handleLike = async () => {
        try {
            await API.post(`/posts/${id}/like`);
            fetchPost();
        } catch (err) {
            console.log("Like toggle failed", err.message);
        }
    };

    const handleAddComment = async () => {
        try {
            if (!commentText.trim()) return toast.error("Write a comment!");

            await API.post(
                `/posts/${id}/comment`,
                { text: commentText },
                { withCredentials: true }
            );

            setCommentText("");
            fetchPost();
        } catch (err) {
            console.log("Failed to add comment", err.message);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await API.delete(`/posts/${id}/comment/${commentId}`);
            fetchPost();
        } catch (err) {
            console.log("Failed to delete comment", err.message);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">Loading...</div>;
    if (!post) return null;

    return (
        <main className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-16 flex justify-center">
            <div className="max-w-3xl w-full">
                <div
                    className="
            bg-gray-900/50 backdrop-blur-xl 
            border border-cyan-800/40 
            rounded-3xl p-6 sm:p-8 
            shadow-[0_0_30px_rgba(6,182,212,0.15)]
          "
                >
                    {}
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={post?.author?.avatar || "https://github.com/shadcn.png"}
                            className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400 
              shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                            alt="avatar"
                        />

                        <div>
                            <h3 className="text-xl font-semibold text-cyan-300">
                                {post?.author?.username}
                            </h3>

                            <p className="text-gray-400 text-xs">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {}
                    <h2 className="text-2xl font-bold mb-3 tracking-wide">
                        {post.title}
                    </h2>

                    {}
                    <p className="text-gray-300 text-base leading-relaxed mb-6">
                        {post.content}
                    </p>

                    {}
                    {post.image && (
                        <img
                            src={post.image}
                            alt="post"
                            className="
                w-full rounded-xl max-h-80 object-cover 
                border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.25)]
              "
                        />
                    )}

                    {}
                    <div className="flex items-center gap-3 mt-4">
                        <button
                            onClick={() => {
                                if (!isAuthenticated)
                                    return toast.error("Please login to like posts!");

                                handleLike();
                            }}
                            className={`
                text-3xl transition-all duration-300 
                ${post.likes?.some(l => l._id === localUser._id || l === localUser._id)
                                    ? "text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]"
                                    : "text-gray-500 hover:text-cyan-300"
                                }
              `}
                        >
                            {post.likes?.some(l => l._id === localUser._id || l === localUser._id) ? "💙" : "🤍"}
                        </button>

                        <button
                            className="text-sm text-gray-400 hover:text-cyan-300 transition"
                            onClick={() => {
                                setLikedBy(post.likes || []);
                                setShowModal(true);
                            }}
                        >
                            {post.likes?.length || 0} Likes
                        </button>
                    </div>

                    {}
                    <div className="mt-6 space-y-5">
                        {post.comments?.map((c) => (
                            <div
                                key={c._id}
                                className="
                  flex justify-between items-start 
                  bg-gray-800/40 p-4 rounded-xl 
                  border border-cyan-800/30
                  hover:bg-gray-800/60 
                  transition-all duration-300
                "
                            >
                                <div className="flex gap-4">
                                    <img
                                        src={c.user?.avatar || "https://github.com/shadcn.png"}
                                        className="
                      w-10 h-10 rounded-full 
                      border border-cyan-400
                      shadow-[0_0_15px_rgba(6,182,212,0.4)]
                    "
                                        alt=""
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-cyan-300">
                                            {c.user?.username}
                                        </p>
                                        <p className="text-gray-300 text-sm mt-1">{c.text}</p>
                                    </div>
                                </div>

                                {String(c.user?._id) === String(localUser._id) && (
                                    <button
                                        onClick={() => handleDeleteComment(c._id)}
                                        className="
                      text-red-400 hover:text-red-300 
                      text-xs font-bold transition
                    "
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}

                        {}
                        <div className="flex gap-3 mt-5">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="
                  flex-1 px-4 py-3 rounded-xl 
                  bg-gray-800/40 border border-cyan-500/30 
                  text-white placeholder-gray-400
                  focus:ring-2 focus:ring-cyan-500/40 outline-none
                "
                            />

                            <button
                                onClick={() => {
                                    if (!isAuthenticated)
                                        return toast.error("Please login to comment!");
                                    handleAddComment();
                                }}
                                className="
                  px-5 py-2 rounded-xl 
                  bg-gradient-to-r from-cyan-400 to-blue-600 
                  text-white font-semibold 
                  hover:scale-105 transition-all cursor-pointer
                "
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div
                        className="bg-gray-900/90 border border-cyan-400/40 rounded-2xl p-6 w-96 
          shadow-[0_0_40px_rgba(6,182,212,0.5)] relative"
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-cyan-300 text-xl"
                        >
                            ✕
                        </button>

                        <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text mb-6">
                            Liked By
                        </h3>

                        {likedBy.length === 0 ? (
                            <p className="text-gray-400 text-center">No likes yet.</p>
                        ) : (
                            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                                {likedBy.map((user) => (
                                    <div
                                        key={user._id}
                                        className="
                      flex items-center gap-4 
                      bg-gray-800/40 p-3 rounded-xl 
                      border border-cyan-800/20
                      hover:bg-gray-800/60 
                      transition
                    "
                                    >
                                        <img
                                            src={user.avatar || "https://github.com/shadcn.png"}
                                            className="w-10 h-10 rounded-full border border-cyan-400"
                                        />
                                        <p>{user.username}</p>
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

export default PostDetails;
