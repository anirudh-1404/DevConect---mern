import React, { useState } from "react";
import API from "@/API/Interceptor";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const CreateSessionModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        language: "javascript",
        isPublic: false,
    });
    const [creating, setCreating] = useState(false);

    const languages = [
        { value: "javascript", label: "JavaScript" },
        { value: "typescript", label: "TypeScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "cpp", label: "C++" },
        { value: "c", label: "C" },
        { value: "csharp", label: "C#" },
        { value: "go", label: "Go" },
        { value: "rust", label: "Rust" },
        { value: "php", label: "PHP" },
        { value: "ruby", label: "Ruby" },
        { value: "swift", label: "Swift" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            return toast.error("Session title is required");
        }

        try {
            setCreating(true);
            const { data } = await API.post("/sessions/create", formData);
            toast.success("Session created successfully!");
            onSuccess(data.session);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create session");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-3xl p-8 w-full max-w-md relative">
                {}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {}
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6">
                    Create Coding Session
                </h2>

                {}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Session Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., React Interview Practice"
                            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-cyan-800/40 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none transition-all"
                        />
                    </div>

                    {}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="What will you be working on?"
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-cyan-800/40 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none transition-all resize-none"
                        />
                    </div>

                    {}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Programming Language
                        </label>
                        <select
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-cyan-800/40 text-white focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none transition-all"
                        >
                            {languages.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {}
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                        <div>
                            <p className="text-white font-medium">Public Session</p>
                            <p className="text-gray-400 text-xs">Anyone can join this session</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isPublic ? "bg-cyan-500" : "bg-gray-600"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isPublic ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    {}
                    <button
                        type="submit"
                        disabled={creating}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {creating ? "Creating..." : "Create Session"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateSessionModal;
