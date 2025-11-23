import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Calendar,
    Trophy,
    Users,
    Clock,
    ArrowLeft,
    Share2,
    MapPin,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const HackathonDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [hackathon, setHackathon] = useState(null);
    const [myTeam, setMyTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [creatingTeam, setCreatingTeam] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [submissionData, setSubmissionData] = useState({ title: "", description: "", repoLink: "", demoVideo: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchHackathon = async () => {
            try {
                const { data } = await API.get(`/hackathons/${id}`);
                setHackathon(data.hackathon);

                if (user) {
                    try {
                        const teamRes = await API.get(`/teams/my-team/${id}`);
                        setMyTeam(teamRes.data.team);
                    } catch (err) {
                        // No team found, ignore
                    }
                }

                const subRes = await API.get(`/submissions/${id}`);
                setSubmissions(subRes.data.submissions);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching hackathon:", error);
                toast.error("Failed to load hackathon details");
                setLoading(false);
            }
        };
        fetchHackathon();
    }, [id, user]);

    const handleRegister = async () => {
        if (!user) return toast.error("Please login to register!");
        setRegistering(true);
        try {
            await API.post(`/hackathons/${id}/register`);
            toast.success("Registered successfully!");
            // Refresh data
            const { data } = await API.get(`/hackathons/${id}`);
            setHackathon(data.hackathon);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to register");
        } finally {
            setRegistering(false);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!teamName.trim()) return toast.error("Team name is required");

        setCreatingTeam(true);
        try {
            const { data } = await API.post("/teams/create", {
                name: teamName,
                hackathonId: id,
                lookingFor: [] // Add skills later if needed
            });
            setMyTeam(data.team);
            setShowCreateTeam(false);
            toast.success("Team created successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create team");
        } finally {
            setCreatingTeam(false);
        }
    };

    const handleAutoMatch = async () => {
        try {
            const { data } = await API.post("/teams/auto-match", { hackathonId: id });
            setMyTeam(data.team);
            toast.success("Auto-matched to a team!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to auto-match");
        }
    };

    const handleSubmitProject = async (e) => {
        e.preventDefault();
        if (!myTeam) return toast.error("You must be in a team to submit!");

        setSubmitting(true);
        try {
            await API.post("/submissions/create", {
                ...submissionData,
                hackathonId: id,
                teamId: myTeam._id
            });
            toast.success("Project submitted successfully!");
            // Refresh submissions
            const subRes = await API.get(`/submissions/${id}`);
            setSubmissions(subRes.data.submissions);
            setSubmissionData({ title: "", description: "", repoLink: "", demoVideo: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit project");
        } finally {
            setSubmitting(false);
        }
    };

    const handleVote = async (submissionId) => {
        if (!user) return toast.error("Please login to vote!");
        try {
            await API.post(`/submissions/${submissionId}/vote`);
            // Refresh submissions to show new vote count
            const subRes = await API.get(`/submissions/${id}`);
            setSubmissions(subRes.data.submissions);
            toast.success("Voted!");
        } catch (error) {
            toast.error("Failed to vote");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-midnight-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-midnight-blue"></div>
            </div>
        );
    }

    if (!hackathon) return null;

    const isUpcoming = new Date(hackathon.startDate) > new Date();
    const isActive =
        new Date(hackathon.startDate) <= new Date() &&
        new Date(hackathon.endDate) >= new Date();

    const isRegistered = hackathon.participants?.includes(user?._id);

    return (
        <div className="min-h-screen bg-midnight-black text-white pb-20">
            {/* Banner */}
            <div className="h-80 w-full relative">
                <img
                    src={
                        hackathon.bannerImage ||
                        "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=2574&auto=format&fit=crop"
                    }
                    alt={hackathon.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-black to-transparent"></div>
                <Link
                    to="/hackathons"
                    className="absolute top-6 left-6 p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
                <div className="bg-midnight-gray/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isActive
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                        : isUpcoming
                                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                        }`}
                                >
                                    {isActive ? "Active" : isUpcoming ? "Upcoming" : "Ended"}
                                </span>
                                {hackathon.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 rounded-lg bg-white/5 text-xs text-gray-300 border border-white/5"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl font-extrabold text-white mb-4">
                                {hackathon.title}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-400">
                                <img
                                    src={
                                        hackathon.organizer?.avatar ||
                                        "https://github.com/shadcn.png"
                                    }
                                    className="w-6 h-6 rounded-full"
                                    alt=""
                                />
                                <span>Hosted by {hackathon.organizer?.username}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px]">
                            {!isRegistered ? (
                                <button
                                    onClick={handleRegister}
                                    disabled={registering || (!isUpcoming && !isActive)}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-bold shadow-lg hover:shadow-midnight-blue/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {registering ? "Registering..." : "Register Now"}
                                </button>
                            ) : (
                                <div className="w-full py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-center">
                                    Registered ✅
                                </div>
                            )}


                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-8">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {hackathon.description}
                                </p>
                            </section>

                            {hackathon.rules && (
                                <section>
                                    <h2 className="text-2xl font-bold text-white mb-4">
                                        Rules & Guidelines
                                    </h2>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {hackathon.rules}
                                    </p>
                                </section>
                            )}

                            {isRegistered && (
                                <section className="bg-midnight-black/30 border border-white/10 rounded-2xl p-6">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <Users className="w-6 h-6 text-neon-cyan" /> Team Status
                                    </h2>

                                    {myTeam ? (
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">{myTeam.name}</h3>
                                            <p className="text-gray-400 mb-4">Leader: {myTeam.leader.username}</p>
                                            <div className="flex flex-wrap gap-3">
                                                {myTeam.members.map(member => (
                                                    <div key={member._id} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                                                        <img src={member.avatar || "https://github.com/shadcn.png"} className="w-6 h-6 rounded-full" />
                                                        <span>{member.username}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-gray-400 mb-4">You are not in a team yet.</p>
                                            <div className="flex gap-4 justify-center">
                                                <button
                                                    onClick={() => setShowCreateTeam(true)}
                                                    className="px-6 py-3 rounded-xl bg-midnight-blue text-white font-semibold hover:bg-blue-600 transition-all"
                                                >
                                                    Create Team
                                                </button>
                                                <button
                                                    onClick={handleAutoMatch}
                                                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                                                >
                                                    Auto Match
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Create Team Modal */}
                            {showCreateTeam && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 p-4">
                                    <div className="bg-midnight-gray border border-white/10 rounded-2xl p-6 w-full max-w-md relative">
                                        <button
                                            onClick={() => setShowCreateTeam(false)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                        <h3 className="text-2xl font-bold text-white mb-6">Create a Team</h3>
                                        <form onSubmit={handleCreateTeam}>
                                            <div className="mb-6">
                                                <label className="block text-gray-400 mb-2">Team Name</label>
                                                <input
                                                    type="text"
                                                    value={teamName}
                                                    onChange={(e) => setTeamName(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white focus:border-midnight-blue outline-none"
                                                    placeholder="e.g. The Innovators"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={creatingTeam}
                                                className="w-full py-3 rounded-xl bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                                            >
                                                {creatingTeam ? "Creating..." : "Create Team"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Trophy className="w-6 h-6 text-yellow-500" /> Prizes
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {hackathon.prizes?.map((prize, index) => (
                                        <div
                                            key={index}
                                            className="bg-midnight-black/50 border border-white/10 rounded-xl p-4 flex items-center justify-between"
                                        >
                                            <span className="font-bold text-yellow-500">
                                                {prize.title}
                                            </span>
                                            <span className="text-white font-mono text-lg">
                                                {prize.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Submission Form (Only if in team and active) */}
                            {myTeam && isActive && (
                                <section className="bg-midnight-black/30 border border-white/10 rounded-2xl p-6">
                                    <h2 className="text-2xl font-bold text-white mb-6">Submit Project</h2>
                                    <form onSubmit={handleSubmitProject} className="space-y-4">
                                        <div>
                                            <label className="block text-gray-400 mb-2">Project Title</label>
                                            <input
                                                type="text"
                                                value={submissionData.title}
                                                onChange={(e) => setSubmissionData({ ...submissionData, title: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white focus:border-midnight-blue outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-2">Description</label>
                                            <textarea
                                                value={submissionData.description}
                                                onChange={(e) => setSubmissionData({ ...submissionData, description: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white focus:border-midnight-blue outline-none resize-none"
                                                rows={4}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-gray-400 mb-2">Repository Link</label>
                                                <input
                                                    type="url"
                                                    value={submissionData.repoLink}
                                                    onChange={(e) => setSubmissionData({ ...submissionData, repoLink: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white focus:border-midnight-blue outline-none"
                                                    placeholder="https://github.com/..."
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 mb-2">Demo Video (Optional)</label>
                                                <input
                                                    type="url"
                                                    value={submissionData.demoVideo}
                                                    onChange={(e) => setSubmissionData({ ...submissionData, demoVideo: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-midnight-black border border-white/10 text-white focus:border-midnight-blue outline-none"
                                                    placeholder="https://youtube.com/..."
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            {submitting ? "Submitting..." : "Submit Project"}
                                        </button>
                                    </form>
                                </section>
                            )}

                            {/* Submissions Gallery */}
                            {submissions.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold text-white mb-6">Community Projects</h2>
                                    <div className="grid grid-cols-1 gap-6">
                                        {submissions.map(sub => (
                                            <div key={sub._id} className="bg-midnight-gray/50 border border-white/10 rounded-2xl p-6 hover:border-midnight-blue/50 transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white mb-1">{sub.title}</h3>
                                                        <p className="text-sm text-gray-400">by {sub.team.name}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleVote(sub._id)}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${sub.votes.includes(user?._id)
                                                            ? "bg-midnight-blue text-white"
                                                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                                                            }`}
                                                    >
                                                        <Trophy className={`w-4 h-4 ${sub.votes.includes(user?._id) ? "text-yellow-400" : ""}`} />
                                                        <span>{sub.votes.length} Votes</span>
                                                    </button>
                                                </div>
                                                <p className="text-gray-300 mb-4">{sub.description}</p>
                                                <div className="flex gap-4">
                                                    <a href={sub.repoLink} target="_blank" rel="noreferrer" className="text-midnight-blue hover:text-midnight-violet text-sm font-semibold">
                                                        View Code
                                                    </a>
                                                    {sub.demoVideo && (
                                                        <a href={sub.demoVideo} target="_blank" rel="noreferrer" className="text-midnight-blue hover:text-midnight-violet text-sm font-semibold">
                                                            Watch Demo
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-midnight-black/50 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Timeline</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Start Date</p>
                                            <p className="font-semibold text-white">
                                                {new Date(hackathon.startDate).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">End Date</p>
                                            <p className="font-semibold text-white">
                                                {new Date(hackathon.endDate).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">
                                                Registration Deadline
                                            </p>
                                            <p className="font-semibold text-white">
                                                {new Date(
                                                    hackathon.registrationDeadline
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-midnight-black/50 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Stats</h3>
                                <div className="flex items-center gap-3 mb-2">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-300">
                                        {hackathon.participants?.length || 0} Participants
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HackathonDetails;
