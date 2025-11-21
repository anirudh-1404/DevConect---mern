import React, { useState, useEffect } from "react";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import ModernTemplate from "@/components/resume/ModernTemplate";
import ClassicTemplate from "@/components/resume/ClassicTemplate";
import { Plus, Trash2, Download, Eye, Save, FileText, Sparkles } from "lucide-react";

const ResumeBuilder = () => {
    const [resumes, setResumes] = useState([]);
    const [currentResume, setCurrentResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        title: "My Resume",
        template: "modern",
        personalInfo: {
            fullName: "",
            email: "",
            phone: "",
            location: "",
            website: "",
            linkedin: "",
            github: "",
        },
        summary: "",
        experience: [],
        education: [],
        skills: {
            technical: [],
            soft: [],
        },
        projects: [],
        certifications: [],
        languages: [],
    });

    // Fetch user's resumes
    const fetchResumes = async () => {
        try {
            setLoading(true);
            const response = await API.get("/resumes");
            setResumes(response.data.resumes);
        } catch (err) {
            console.log("Error fetching resumes:", err.message);
            toast.error("Failed to load resumes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    // Auto-fill from profile
    const handleAutoFill = async () => {
        try {
            const response = await API.get("/resumes/autofill");
            setFormData((prev) => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    ...response.data.data.personalInfo,
                },
                summary: response.data.data.summary,
                skills: {
                    ...prev.skills,
                    technical: response.data.data.skills.technical,
                },
            }));
            toast.success("Auto-filled from profile!");
        } catch (err) {
            console.log("Error auto-filling:", err.message);
            toast.error("Failed to auto-fill");
        }
    };

    // Create new resume
    const handleCreateNew = () => {
        setCurrentResume(null);
        setFormData({
            title: "My Resume",
            template: "modern",
            personalInfo: {
                fullName: "",
                email: "",
                phone: "",
                location: "",
                website: "",
                linkedin: "",
                github: "",
            },
            summary: "",
            experience: [],
            education: [],
            skills: {
                technical: [],
                soft: [],
            },
            projects: [],
            certifications: [],
            languages: [],
        });
    };

    // Load resume
    const handleLoadResume = async (resumeId) => {
        try {
            const response = await API.get(`/resumes/${resumeId}`);
            setCurrentResume(response.data.resume);
            setFormData(response.data.resume);
            toast.success("Resume loaded!");
        } catch (err) {
            console.log("Error loading resume:", err.message);
            toast.error("Failed to load resume");
        }
    };

    // Save resume
    const handleSave = async () => {
        try {
            setSaving(true);
            if (currentResume) {
                // Update existing
                await API.put(`/resumes/${currentResume._id}`, formData);
                toast.success("Resume updated!");
            } else {
                // Create new
                const response = await API.post("/resumes/create", formData);
                setCurrentResume(response.data.resume);
                toast.success("Resume created!");
            }
            fetchResumes();
        } catch (err) {
            console.log("Error saving resume:", err.message);
            toast.error("Failed to save resume");
        } finally {
            setSaving(false);
        }
    };

    // Delete resume
    const handleDelete = async (resumeId) => {
        if (!window.confirm("Are you sure you want to delete this resume?")) return;

        try {
            await API.delete(`/resumes/${resumeId}`);
            toast.success("Resume deleted!");
            fetchResumes();
            if (currentResume?._id === resumeId) {
                handleCreateNew();
            }
        } catch (err) {
            console.log("Error deleting resume:", err.message);
            toast.error("Failed to delete resume");
        }
    };

    // Download PDF
    const handleDownloadPDF = () => {
        const element = document.getElementById("resume-content");
        const opt = {
            margin: 0,
            filename: `${formData.title || "resume"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        html2pdf().set(opt).from(element).save();
        toast.success("Downloading PDF...");
    };

    // Add/Remove array items
    const addArrayItem = (field, defaultItem) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...prev[field], defaultItem],
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const updateArrayItem = (field, index, key, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) =>
                i === index ? { ...item, [key]: value } : item
            ),
        }));
    };

    // Add/Remove skills
    const addSkill = (type) => {
        const skill = prompt(`Enter ${type} skill:`);
        if (skill) {
            setFormData((prev) => ({
                ...prev,
                skills: {
                    ...prev.skills,
                    [type]: [...prev.skills[type], skill],
                },
            }));
        }
    };

    const removeSkill = (type, index) => {
        setFormData((prev) => ({
            ...prev,
            skills: {
                ...prev.skills,
                [type]: prev.skills[type].filter((_, i) => i !== index),
            },
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f1e] to-[#020617] text-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-4">
                        Resume Builder
                    </h1>
                    <p className="text-gray-400">Create professional resumes with ease</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Resume List */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900/60 backdrop-blur-xl border border-cyan-800/40 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-cyan-300">My Resumes</h2>
                                <button
                                    onClick={handleCreateNew}
                                    className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            {loading ? (
                                <p className="text-gray-400 text-sm">Loading...</p>
                            ) : resumes.length === 0 ? (
                                <p className="text-gray-400 text-sm">No resumes yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {resumes.map((resume) => (
                                        <div
                                            key={resume._id}
                                            className={`p-3 rounded-lg border cursor-pointer transition ${currentResume?._id === resume._id
                                                    ? "bg-cyan-500/20 border-cyan-500"
                                                    : "bg-gray-800/40 border-gray-700 hover:border-cyan-500/50"
                                                }`}
                                            onClick={() => handleLoadResume(resume._id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm">{resume.title}</p>
                                                    <p className="text-xs text-gray-400 capitalize">{resume.template}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(resume._id);
                                                    }}
                                                    className="p-1 hover:bg-red-500/20 rounded transition"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content - Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-gray-900/60 backdrop-blur-xl border border-cyan-800/40 rounded-2xl p-6">
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <button
                                    onClick={handleAutoFill}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Auto-fill from Profile
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? "Saving..." : "Save"}
                                </button>
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition"
                                >
                                    <Eye className="w-4 h-4" />
                                    {showPreview ? "Hide" : "Show"} Preview
                                </button>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                            </div>

                            {/* Form */}
                            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                                {/* Basic Info */}
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-300 mb-3">Basic Info</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Resume Title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 outline-none"
                                        />
                                        <select
                                            value={formData.template}
                                            onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 outline-none"
                                        >
                                            <option value="modern">Modern Template</option>
                                            <option value="classic">Classic Template</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-300 mb-3">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={formData.personalInfo.fullName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, fullName: e.target.value },
                                                })
                                            }
                                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 outline-none"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={formData.personalInfo.email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, email: e.target.value },
                                                })
                                            }
                                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 outline-none"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            value={formData.personalInfo.phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, phone: e.target.value },
                                                })
                                            }
                                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            value={formData.personalInfo.location}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, location: e.target.value },
                                                })
                                            }
                                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 outline-none"
                                        />
                                        <input
                                            type="url"
                                            placeholder="Website"
                                            value={formData.personalInfo.website}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, website: e.target.value },
                                                })
                                            }
                                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 outline-none"
                                        />
                                        <input
                                            type="url"
                                            placeholder="LinkedIn"
                                            value={formData.personalInfo.linkedin}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, linkedin: e.target.value },
                                                })
                                            }
                                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 outline-none"
                                        />
                                        <input
                                            type="url"
                                            placeholder="GitHub"
                                            value={formData.personalInfo.github}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    personalInfo: { ...formData.personalInfo, github: e.target.value },
                                                })
                                            }
                                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Summary */}
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-300 mb-3">Professional Summary</h3>
                                    <textarea
                                        placeholder="Write a brief professional summary..."
                                        value={formData.summary}
                                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                        rows="4"
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 outline-none resize-none"
                                    />
                                </div>

                                {/* Experience */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-bold text-cyan-300">Work Experience</h3>
                                        <button
                                            onClick={() =>
                                                addArrayItem("experience", {
                                                    company: "",
                                                    position: "",
                                                    location: "",
                                                    startDate: "",
                                                    endDate: "",
                                                    current: false,
                                                    description: "",
                                                })
                                            }
                                            className="p-1 bg-cyan-500 hover:bg-cyan-600 rounded transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {formData.experience.map((exp, index) => (
                                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg mb-3">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-sm font-semibold">Experience {index + 1}</h4>
                                                <button
                                                    onClick={() => removeArrayItem("experience", index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Position"
                                                    value={exp.position}
                                                    onChange={(e) => updateArrayItem("experience", index, "position", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Company"
                                                    value={exp.company}
                                                    onChange={(e) => updateArrayItem("experience", index, "company", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Location"
                                                    value={exp.location}
                                                    onChange={(e) => updateArrayItem("experience", index, "location", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Start Date (e.g., Jan 2020)"
                                                    value={exp.startDate}
                                                    onChange={(e) => updateArrayItem("experience", index, "startDate", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="End Date (e.g., Dec 2022)"
                                                    value={exp.endDate}
                                                    onChange={(e) => updateArrayItem("experience", index, "endDate", e.target.value)}
                                                    disabled={exp.current}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm disabled:opacity-50"
                                                />
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={exp.current}
                                                        onChange={(e) => updateArrayItem("experience", index, "current", e.target.checked)}
                                                        className="w-4 h-4"
                                                    />
                                                    Currently working here
                                                </label>
                                            </div>
                                            <textarea
                                                placeholder="Description"
                                                value={exp.description}
                                                onChange={(e) => updateArrayItem("experience", index, "description", e.target.value)}
                                                rows="3"
                                                className="w-full mt-3 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm resize-none"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Education */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-bold text-cyan-300">Education</h3>
                                        <button
                                            onClick={() =>
                                                addArrayItem("education", {
                                                    institution: "",
                                                    degree: "",
                                                    field: "",
                                                    startDate: "",
                                                    endDate: "",
                                                    gpa: "",
                                                    description: "",
                                                })
                                            }
                                            className="p-1 bg-cyan-500 hover:bg-cyan-600 rounded transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {formData.education.map((edu, index) => (
                                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg mb-3">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-sm font-semibold">Education {index + 1}</h4>
                                                <button
                                                    onClick={() => removeArrayItem("education", index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Degree"
                                                    value={edu.degree}
                                                    onChange={(e) => updateArrayItem("education", index, "degree", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Institution"
                                                    value={edu.institution}
                                                    onChange={(e) => updateArrayItem("education", index, "institution", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Field of Study"
                                                    value={edu.field}
                                                    onChange={(e) => updateArrayItem("education", index, "field", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Start Date"
                                                    value={edu.startDate}
                                                    onChange={(e) => updateArrayItem("education", index, "startDate", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="End Date"
                                                    value={edu.endDate}
                                                    onChange={(e) => updateArrayItem("education", index, "endDate", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="GPA (optional)"
                                                    value={edu.gpa}
                                                    onChange={(e) => updateArrayItem("education", index, "gpa", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Description (optional)"
                                                value={edu.description}
                                                onChange={(e) => updateArrayItem("education", index, "description", e.target.value)}
                                                rows="2"
                                                className="w-full mt-3 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm resize-none"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Skills */}
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-300 mb-3">Skills</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm font-semibold">Technical Skills</label>
                                                <button
                                                    onClick={() => addSkill("technical")}
                                                    className="p-1 bg-cyan-500 hover:bg-cyan-600 rounded transition"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.skills.technical.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full text-sm flex items-center gap-2"
                                                    >
                                                        {skill}
                                                        <button
                                                            onClick={() => removeSkill("technical", index)}
                                                            className="hover:text-red-400"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm font-semibold">Soft Skills</label>
                                                <button
                                                    onClick={() => addSkill("soft")}
                                                    className="p-1 bg-cyan-500 hover:bg-cyan-600 rounded transition"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.skills.soft.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-500/20 border border-blue-500 rounded-full text-sm flex items-center gap-2"
                                                    >
                                                        {skill}
                                                        <button
                                                            onClick={() => removeSkill("soft", index)}
                                                            className="hover:text-red-400"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Projects - Similar structure to Experience */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-bold text-cyan-300">Projects</h3>
                                        <button
                                            onClick={() =>
                                                addArrayItem("projects", {
                                                    title: "",
                                                    description: "",
                                                    techStack: [],
                                                    liveLink: "",
                                                    githubLink: "",
                                                    startDate: "",
                                                    endDate: "",
                                                })
                                            }
                                            className="p-1 bg-cyan-500 hover:bg-cyan-600 rounded transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {formData.projects.map((project, index) => (
                                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg mb-3">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-sm font-semibold">Project {index + 1}</h4>
                                                <button
                                                    onClick={() => removeArrayItem("projects", index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Project Title"
                                                    value={project.title}
                                                    onChange={(e) => updateArrayItem("projects", index, "title", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="url"
                                                    placeholder="Live Link"
                                                    value={project.liveLink}
                                                    onChange={(e) => updateArrayItem("projects", index, "liveLink", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="url"
                                                    placeholder="GitHub Link"
                                                    value={project.githubLink}
                                                    onChange={(e) => updateArrayItem("projects", index, "githubLink", e.target.value)}
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Tech Stack (comma-separated)"
                                                    value={project.techStack.join(", ")}
                                                    onChange={(e) =>
                                                        updateArrayItem(
                                                            "projects",
                                                            index,
                                                            "techStack",
                                                            e.target.value.split(",").map((s) => s.trim())
                                                        )
                                                    }
                                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Project Description"
                                                value={project.description}
                                                onChange={(e) => updateArrayItem("projects", index, "description", e.target.value)}
                                                rows="3"
                                                className="w-full mt-3 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 outline-none text-sm resize-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Modal */}
                {showPreview && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="relative max-w-5xl w-full my-8">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="absolute -top-12 right-0 text-white hover:text-cyan-300 text-2xl"
                            >
                                ×
                            </button>
                            {formData.template === "modern" ? (
                                <ModernTemplate resumeData={formData} />
                            ) : (
                                <ClassicTemplate resumeData={formData} />
                            )}
                        </div>
                    </div>
                )}

                {/* Hidden template for PDF export */}
                <div className="hidden">
                    {formData.template === "modern" ? (
                        <ModernTemplate resumeData={formData} />
                    ) : (
                        <ClassicTemplate resumeData={formData} />
                    )}
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
        </div>
    );
};

export default ResumeBuilder;
