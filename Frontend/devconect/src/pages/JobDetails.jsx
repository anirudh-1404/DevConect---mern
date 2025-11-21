import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, Building2, DollarSign, Clock, Briefcase, ArrowLeft, CheckCircle, User } from "lucide-react";
import toast from "react-hot-toast";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [hasApplied, setHasApplied] = useState(false);
    const [applications, setApplications] = useState([]);
    const [showApplicants, setShowApplicants] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isRecruiter = user.role?.toLowerCase() === "recruiter";
    const isOwner = job?.postedBy?._id === user._id;

    useEffect(() => {
        fetchJob();
        
        checkApplicationStatus();
    }, [id]);

    const fetchJob = async () => {
        try {
            const { data } = await API.get(`/jobs/${id}`);
            setJob(data);
            setLoading(false);

            if (data.postedBy._id === user._id) {
                fetchApplications();
            }
        } catch (error) {
            console.error("Error fetching job:", error);
            toast.error("Job not found");
            navigate("/jobs");
        }
    };

    const checkApplicationStatus = async () => {
        try {
            const { data } = await API.get("/jobs/applications/my");
            const applied = data.some(app => app.job._id === id);
            setHasApplied(applied);
        } catch (error) {
            console.error("Error checking application status:", error);
        }
    };

    const fetchApplications = async () => {
        try {
            const { data } = await API.get(`/jobs/${id}/applications`);
            setApplications(data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);
        try {
            await API.post(`/jobs/${id}/apply`, { coverLetter });
            toast.success("Application submitted successfully!");
            setHasApplied(true);
            setCoverLetter("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply");
        } finally {
            setApplying(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await API.delete(`/jobs/${id}`);
            toast.success("Job deleted successfully");
            navigate("/jobs");
        } catch (error) {
            toast.error("Failed to delete job");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-16">
            <div className="max-w-4xl mx-auto">
                {}
                <Link to="/jobs" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Jobs
                </Link>

                {}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-800/40 rounded-3xl p-8 mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white mb-4">{job.title}</h1>
                            <div className="flex items-center text-cyan-400 text-lg font-medium mb-4">
                                <Building2 className="w-5 h-5 mr-2" />
                                {job.company}
                            </div>
                        </div>
                        <span
                            className={`
                px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider
                ${job.type === "Remote"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : job.type === "Hybrid"
                                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                }
              `}
                        >
                            {job.type}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center text-gray-400">
                            <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                            {job.location}
                        </div>
                        {job.salary && (
                            <div className="flex items-center text-gray-400">
                                <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                                {job.salary}
                            </div>
                        )}
                        <div className="flex items-center text-gray-400">
                            <Clock className="w-5 h-5 mr-2 text-gray-500" />
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    {}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Job Description</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>

                    {}
                    {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
                            <ul className="space-y-2">
                                {job.requirements.map((req, index) => (
                                    <li key={index} className="flex items-start text-gray-300">
                                        <CheckCircle className="w-5 h-5 mr-2 text-cyan-400 shrink-0 mt-0.5" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {}
                    <div className="flex gap-4 mt-8">
                        {}
                        {!isOwner && !hasApplied && (
                            <button
                                onClick={() => document.getElementById('apply-section').scrollIntoView({ behavior: 'smooth' })}
                                className="
                  px-8 py-3 rounded-xl 
                  bg-gradient-to-r from-cyan-500 to-blue-600 
                  text-white font-bold 
                  hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 
                  transition-all duration-300
                  flex items-center gap-2
                "
                            >
                                <Briefcase className="w-5 h-5" />
                                Apply Now
                            </button>
                        )}

                        {}
                        {!isOwner && hasApplied && (
                            <button
                                disabled
                                className="
                                    px-8 py-3 rounded-xl 
                                    bg-green-500/20 border border-green-500/30 
                                    text-green-400 font-bold 
                                    flex items-center gap-2
                                    cursor-not-allowed opacity-75
                                "
                            >
                                <CheckCircle className="w-5 h-5" />
                                Already Applied
                            </button>
                        )}

                        {}
                        {isOwner && (
                            <>
                                <button
                                    onClick={() => setShowApplicants(!showApplicants)}
                                    className="
                    px-8 py-3 rounded-xl 
                    bg-cyan-500/10 border border-cyan-500/50 
                    text-cyan-400 font-bold 
                    hover:bg-cyan-500 hover:text-white 
                    transition-all duration-300
                    flex items-center gap-2
                  "
                                >
                                    <User className="w-5 h-5" />
                                    View Applicants ({applications.length})
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="
                    px-8 py-3 rounded-xl 
                    bg-red-500/10 border border-red-500/50 
                    text-red-400 font-bold 
                    hover:bg-red-500 hover:text-white 
                    transition-all duration-300
                  "
                                >
                                    Delete Job
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {}
                {isOwner && showApplicants && (
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-800/40 rounded-3xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Applicants</h2>
                        {applications.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No applications yet</p>
                        ) : (
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <div
                                        key={app._id}
                                        className="bg-gray-800/40 border border-cyan-800/30 rounded-xl p-6 hover:bg-gray-800/60 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={app.applicant.avatar || "https://github.com/shadcn.png"}
                                                    alt={app.applicant.username}
                                                    className="w-12 h-12 rounded-full border-2 border-cyan-400"
                                                />
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">{app.applicant.username}</h3>
                                                    <p className="text-sm text-gray-400">{app.applicant.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {app.coverLetter && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-400 mb-1">Cover Letter:</p>
                                                <p className="text-gray-300">{app.coverLetter}</p>
                                            </div>
                                        )}
                                        {app.applicant.skills && app.applicant.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {app.applicant.skills.map((skill, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {}
                                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700/50">
                                            <Link
                                                to={`/messages?userId=${app.applicant._id}`}
                                                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-center hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Chat
                                            </Link>
                                            <Link
                                                to={`/${app.applicant.role?.toLowerCase() === 'developer' ? 'developers' : 'recruiters'}/${app.applicant._id}`}
                                                className="flex-1 px-4 py-2 rounded-xl bg-gray-800/50 border border-cyan-500/30 text-cyan-400 font-semibold text-center hover:bg-gray-800 transition-all"
                                            >
                                                View Profile
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {}
                {!isOwner && !hasApplied && (
                    <div id="apply-section" className="bg-gray-900/50 backdrop-blur-xl border border-cyan-800/40 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Apply for this Position</h2>
                        <form onSubmit={handleApply}>
                            <div className="mb-6">
                                <label className="block text-gray-400 mb-2">Cover Letter (Optional)</label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    rows={6}
                                    placeholder="Tell us why you're a great fit for this role..."
                                    className="
                    w-full px-4 py-3 rounded-xl 
                    bg-gray-800/40 border border-cyan-500/30 
                    text-white placeholder-gray-500 
                    focus:ring-2 focus:ring-cyan-500/40 outline-none
                  "
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={applying}
                                className="
                  w-full py-4 rounded-xl 
                  bg-gradient-to-r from-cyan-500 to-blue-600 
                  text-white font-bold 
                  hover:shadow-lg hover:shadow-cyan-500/25 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300
                "
                            >
                                {applying ? "Submitting..." : "Submit Application"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetails;
