import API from "@/API/Interceptor";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const CreateJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        type: "Remote",
        salary: "",
        description: "",
        requirements: [],
    });
    const [currentRequirement, setCurrentRequirement] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    
    if (user.role?.toLowerCase() !== "recruiter") {
        navigate("/jobs");
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addRequirement = () => {
        if (currentRequirement.trim()) {
            setFormData({
                ...formData,
                requirements: [...formData.requirements, currentRequirement.trim()],
            });
            setCurrentRequirement("");
        }
    };

    const removeRequirement = (index) => {
        setFormData({
            ...formData,
            requirements: formData.requirements.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.company || !formData.location || !formData.description) {
            return toast.error("Please fill in all required fields");
        }

        setLoading(true);
        try {
            await API.post("/jobs", formData);
            toast.success("Job posted successfully!");
            navigate("/jobs");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-16">
            <div className="max-w-3xl mx-auto">
                {}
                <Link to="/jobs" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Jobs
                </Link>

                {}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                        Post a New Job
                    </h1>
                    <p className="text-gray-400">Find the perfect candidate for your team</p>
                </div>

                {}
                <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-xl border border-cyan-800/40 rounded-3xl p-8">
                    {}
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-medium">
                            Job Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Senior React Developer"
                            className="
                w-full px-4 py-3 rounded-xl 
                bg-gray-800/40 border border-cyan-500/30 
                text-white placeholder-gray-500 
                focus:ring-2 focus:ring-cyan-500/40 outline-none
              "
                            required
                        />
                    </div>

                    {}
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-medium">
                            Company <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g. TechCorp Inc."
                            className="
                w-full px-4 py-3 rounded-xl 
                bg-gray-800/40 border border-cyan-500/30 
                text-white placeholder-gray-500 
                focus:ring-2 focus:ring-cyan-500/40 outline-none
              "
                            required
                        />
                    </div>

                    {}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-gray-400 mb-2 font-medium">
                                Location <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. San Francisco, CA"
                                className="
                  w-full px-4 py-3 rounded-xl 
                  bg-gray-800/40 border border-cyan-500/30 
                  text-white placeholder-gray-500 
                  focus:ring-2 focus:ring-cyan-500/40 outline-none
                "
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 font-medium">
                                Job Type <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="
                  w-full px-4 py-3 rounded-xl 
                  bg-gray-800/40 border border-cyan-500/30 
                  text-white 
                  focus:ring-2 focus:ring-cyan-500/40 outline-none
                "
                            >
                                <option value="Remote">Remote</option>
                                <option value="Onsite">Onsite</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    {}
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-medium">
                            Salary Range (Optional)
                        </label>
                        <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="e.g. $120k - $180k"
                            className="
                w-full px-4 py-3 rounded-xl 
                bg-gray-800/40 border border-cyan-500/30 
                text-white placeholder-gray-500 
                focus:ring-2 focus:ring-cyan-500/40 outline-none
              "
                        />
                    </div>

                    {}
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-medium">
                            Job Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={8}
                            placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                            className="
                w-full px-4 py-3 rounded-xl 
                bg-gray-800/40 border border-cyan-500/30 
                text-white placeholder-gray-500 
                focus:ring-2 focus:ring-cyan-500/40 outline-none
              "
                            required
                        />
                    </div>

                    {}
                    <div className="mb-8">
                        <label className="block text-gray-400 mb-2 font-medium">
                            Requirements
                        </label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={currentRequirement}
                                onChange={(e) => setCurrentRequirement(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                                placeholder="Add a requirement and press Enter"
                                className="
                  flex-1 px-4 py-3 rounded-xl 
                  bg-gray-800/40 border border-cyan-500/30 
                  text-white placeholder-gray-500 
                  focus:ring-2 focus:ring-cyan-500/40 outline-none
                "
                            />
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="
                  px-6 py-3 rounded-xl 
                  bg-cyan-500/10 border border-cyan-500/50 
                  text-cyan-400 font-semibold 
                  hover:bg-cyan-500 hover:text-white 
                  transition-all duration-300
                  flex items-center gap-2
                "
                            >
                                <Plus className="w-5 h-5" />
                                Add
                            </button>
                        </div>

                        {formData.requirements.length > 0 && (
                            <div className="space-y-2">
                                {formData.requirements.map((req, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-800/40 border border-cyan-800/30 rounded-xl px-4 py-3"
                                    >
                                        <span className="text-gray-300">{req}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeRequirement(index)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
              w-full py-4 rounded-xl 
              bg-gradient-to-r from-cyan-500 to-blue-600 
              text-white font-bold text-lg
              hover:shadow-lg hover:shadow-cyan-500/25 
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            "
                    >
                        {loading ? "Posting..." : "Post Job"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;
