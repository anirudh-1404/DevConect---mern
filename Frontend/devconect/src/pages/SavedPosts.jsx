import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import { Bookmark, Search, Sparkles, Heart, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SavedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    const fetchSavedPosts = async () => {
        try {
            const { data } = await API.get("/saved-posts");
            // Extract post objects from savedPosts array
            const postsList = data.savedPosts.map(saved => saved.post);
            setPosts(postsList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching saved posts:", error);
            setLoading(false);
        }
    };

    const handleUnsave = async (postId) => {
        try {
            await API.delete(`/saved-posts/${postId}`);
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            console.error("Error unsaving post:", error);
        }
    };

    const filteredPosts = posts.filter(
        (post) =>
            post?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post?.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post?.author?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-midnight-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-midnight-blue mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading saved posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-midnight-black text-white px-4 sm:px-6 py-16">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Bookmark className="w-12 h-12 text-midnight-blue fill-midnight-blue" />
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet">
                            Saved Posts
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Your bookmarked content • {posts.length} {posts.length === 1 ? 'post' : 'posts'} saved
                    </p>
                </div>

                {posts.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-20">
                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 bg-midnight-blue/20 blur-3xl rounded-full"></div>
                            <Bookmark className="w-24 h-24 text-gray-700 relative" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">
                            No saved posts yet
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Start bookmarking posts you find interesting to access them later
                        </p>
                        <Link
                            to="/community"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-semibold rounded-xl hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all"
                        >
                            <Sparkles className="w-5 h-5" />
                            Browse Community
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Search Bar */}
                        <div className="mb-8">
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search saved posts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-midnight-gray/50 border border-midnight-blue/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Search Results Count */}
                        {searchTerm && (
                            <p className="text-gray-400 text-sm mb-6 text-center">
                                Showing {filteredPosts.length} of {posts.length} saved posts
                            </p>
                        )}

                        {/* Posts Grid */}
                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400">No posts match your search</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredPosts.map((post) => (
                                    <div
                                        key={post._id}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-midnight-blue/50 transition-all cursor-pointer group"
                                        onClick={() => navigate(`/post/${post._id}`)}
                                    >
                                        {/* Post Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={post.author?.avatar || "https://github.com/shadcn.png"}
                                                    alt={post.author?.username}
                                                    className="w-12 h-12 rounded-full border-2 border-midnight-blue"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-white group-hover:text-midnight-blue transition-colors">
                                                        {post.author?.username}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        {post.author?.role} • {new Date(post.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUnsave(post._id);
                                                }}
                                                className="text-midnight-blue hover:text-red-400 transition-colors"
                                            >
                                                <Bookmark className="w-6 h-6 fill-midnight-blue" />
                                            </button>
                                        </div>

                                        {/* Post Content */}
                                        <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-midnight-blue transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-300 mb-4 line-clamp-3">
                                            {post.content}
                                        </p>

                                        {/* Post Media */}
                                        {post.image && (
                                            <img
                                                src={post.image}
                                                alt="post"
                                                className="w-full rounded-xl max-h-80 object-cover mb-4 border border-midnight-blue/30"
                                            />
                                        )}

                                        {post.postType === "video" && post.videoUrl && (
                                            <video
                                                src={post.videoUrl}
                                                controls
                                                className="w-full rounded-xl max-h-96 mb-4 border border-midnight-blue/30"
                                            />
                                        )}

                                        {post.postType === "audio" && post.audioUrl && (
                                            <audio
                                                src={post.audioUrl}
                                                controls
                                                className="w-full mb-4"
                                            />
                                        )}

                                        {/* Post Stats */}
                                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Heart className="w-5 h-5" />
                                                <span>{post.likes?.length || 0} likes</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MessageCircle className="w-5 h-5" />
                                                <span>{post.comments?.length || 0} comments</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SavedPosts;
