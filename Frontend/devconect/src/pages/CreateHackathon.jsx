import API from "@/API/Interceptor";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, X, Loader2, Trophy, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const CreateHackathon = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        bannerImage: "",
        rules: "",
        prizes: [],
        tags: [],
    });

    const [currentPrize, setCurrentPrize] = useState({ title: "", amount: "" });
    const [currentTag, setCurrentTag] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addPrize = () => {
        if (currentPrize.title && currentPrize.amount) {
            setFormData({
                ...formData,
                prizes: [...formData.prizes, currentPrize],
            });
            setCurrentPrize({ title: "", amount: "" });
        }
    };

    const removePrize = (index) => {
        setFormData({
            ...formData,
            prizes: formData.prizes.filter((_, i) => i !== index),
        });
    };

    const addTag = () => {
        if (currentTag.trim()) {
            setFormData({
                ...formData,
                tags: [...formData.tags, currentTag.trim()],
            });
            setCurrentTag("");
        }
    };

    const removeTag = (index) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.title ||
            !formData.description ||
            !formData.startDate ||
            !formData.endDate
        ) {
            return toast.error("Please fill in all required fields");
        }

        setLoading(true);
        try {
            await API.post("/hackathons/create", formData);
            toast.success("Hackathon created successfully!");
            navigate("/hackathons");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to create hackathon"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <Link
                    to="/hackathons"
                    className="inline-flex items-center text-midnight-blue hover:text-midnight-violet mb-8 transition-all duration-300 hover:translate-x-[-4px]"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Hackathons
                </Link>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet mb-2">
                        Host a Hackathon
                    </h1>
                    <p className="text-slate-400">
                        Create an event to innovate and collaborate
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                    {/* Basic Info */}
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-medium">
                            Hackathon Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. AI Innovation Challenge 2024"
                            className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue outline-none transition-all duration-300"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-medium">
                            Banner Image URL
                        </label>
                        <input
                            type="text"
                            name="bannerImage"
                            value={formData.bannerImage}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue outline-none transition-all duration-300"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-gray-400 mb-2 font-medium">
                                Start Date <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue outline-none transition-all duration-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 font-medium">
                                End Date <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue outline-none transition-all duration-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 font-medium">
                                Registration Deadline
                            </label>
                            <input
                                type="datetime-local"
                                name="registrationDeadline"
                                value={formData.registrationDeadline}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue outline-none transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-medium">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Describe the hackathon theme, goals, and what participants should build..."
                            className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue outline-none transition-all duration-300 resize-none"
                            required
                        />
                    </div>

                    {/* Rules */}
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-medium">
                            Rules & Guidelines
                        </label>
                        <textarea
                            name="rules"
                            value={formData.rules}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Submission guidelines, team size limits, etc."
                            className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue outline-none transition-all duration-300 resize-none"
                        />
                    </div>

                    {/* Prizes */}
                    <div className="mb-8">
                        <label className="block text-gray-400 mb-2 font-medium flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" /> Prizes
                        </label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={currentPrize.title}
                                onChange={(e) =>
                                    setCurrentPrize({ ...currentPrize, title: e.target.value })
                                }
                                placeholder="Prize Title (e.g. 1st Place)"
                                className="flex-1 px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue outline-none transition-all duration-300"
                            />
                            <input
                                type="text"
                                value={currentPrize.amount}
                                onChange={(e) =>
                                    setCurrentPrize({ ...currentPrize, amount: e.target.value })
                                }
                                placeholder="Amount (e.g. $5000)"
                                className="w-32 px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue outline-none transition-all duration-300"
                            />
                            <button
                                type="button"
                                onClick={addPrize}
                                className="px-4 py-3 rounded-xl bg-midnight-blue/10 border border-midnight-blue/50 text-midnight-blue hover:bg-midnight-blue hover:text-white transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {formData.prizes.length > 0 && (
                            <div className="space-y-2">
                                {formData.prizes.map((prize, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-midnight-gray/40 border border-white/10 rounded-xl px-4 py-3"
                                    >
                                        <div>
                                            <span className="font-bold text-yellow-500 mr-2">
                                                {prize.title}
                                            </span>
                                            <span className="text-gray-300">{prize.amount}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removePrize(index)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="mb-8">
                        <label className="block text-gray-400 mb-2 font-medium">Tags</label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === "Enter" && (e.preventDefault(), addTag())
                                }
                                placeholder="Add a tag (e.g. AI, Web3)"
                                className="flex-1 px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue outline-none transition-all duration-300"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-4 py-3 rounded-xl bg-midnight-blue/10 border border-midnight-blue/50 text-midnight-blue hover:bg-midnight-blue hover:text-white transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-midnight-gray/40 border border-white/10 rounded-lg px-3 py-1.5"
                                    >
                                        <span className="text-gray-300 text-sm">{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeTag(index)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-bold text-lg hover:shadow-lg hover:shadow-midnight-blue/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Hackathon"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateHackathon;
