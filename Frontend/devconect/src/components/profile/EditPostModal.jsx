import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import { X, Loader2 } from "lucide-react";

const EditPostModal = ({ post, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: post?.title || "",
        content: post?.content || "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            return toast.error("Title and content are required!");
        }

        try {
            setLoading(true);
            const { data } = await API.patch(`/post/update/${post._id}`, formData);
            toast.success("Post updated successfully!");
            onUpdate(data.updated);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-midnight-gray text-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative border border-midnight-blue/20"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-midnight-blue to-midnight-violet bg-clip-text text-transparent">
                            Edit Post
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-300 text-sm mb-2 font-medium">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue transition-all"
                                placeholder="Enter post title..."
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm mb-2 font-medium">
                                Content
                            </label>
                            <textarea
                                name="content"
                                rows="8"
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue transition-all resize-none"
                                placeholder="Write your content..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-semibold hover:shadow-lg hover:shadow-midnight-blue/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditPostModal;
