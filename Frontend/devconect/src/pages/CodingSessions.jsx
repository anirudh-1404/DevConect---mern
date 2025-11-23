import React, { useState, useEffect } from "react";
import API from "@/API/Interceptor";
import { useNavigate } from "react-router-dom";
import { Code, Users, Clock, Plus, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import CreateSessionModal from "@/components/coding/CreateSessionModal";

const CodingSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        fetchSessions();
    }, [filter]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/sessions?filter=${filter}`);
            setSessions(data.sessions);
        } catch (error) {
            console.error("Error fetching sessions:", error);
            toast.error("Failed to load sessions");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinSession = async (sessionId) => {
        try {
            await API.post(`/sessions/${sessionId}/join`);
            navigate(`/coding-session/${sessionId}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to join session");
        }
    };

    const getLanguageColor = (language) => {
        const colors = {
            javascript: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            python: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            java: "bg-red-500/20 text-red-400 border-red-500/30",
            cpp: "bg-purple-500/20 text-purple-400 border-purple-500/30",
            typescript: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
            go: "bg-teal-500/20 text-teal-400 border-teal-500/30",
        };
        return colors[language] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
    };

    return (
        <div className="min-h-screen bg-midnight-black text-white px-4 sm:px-6 py-16">
            <div className="max-w-7xl mx-auto">
                { }
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet mb-2">
                                Live Coding Sessions
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base">
                                Collaborate in real-time with developers worldwide
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-semibold hover:shadow-lg hover:shadow-midnight-blue/25 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">New Session</span>
                        </button>
                    </div>

                    { }
                    <div className="flex gap-3 mt-6">
                        {["all", "my", "public"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === f
                                    ? "bg-gradient-to-r from-midnight-blue/20 to-midnight-violet/20 border border-midnight-blue/50 text-white"
                                    : "bg-midnight-gray/50 border border-white/10 text-gray-400 hover:border-midnight-blue/30"
                                    }`}
                            >
                                {f === "all" ? "All Sessions" : f === "my" ? "My Sessions" : "Public"}
                            </button>
                        ))}
                    </div>
                </div>

                { }
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-midnight-blue"></div>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-20">
                        <Code className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No sessions found</p>
                        <p className="text-gray-500 text-sm mt-2">Create a new session to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessions.map((session) => {
                            const user = JSON.parse(localStorage.getItem("user") || "{}");
                            const isHost = session.host._id === user._id;
                            const isParticipant = session.participants.some((p) => p._id === user._id);

                            return (
                                <div
                                    key={session._id}
                                    className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-midnight-blue/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all"
                                >
                                    { }
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                                                {session.title}
                                            </h3>
                                            {session.description && (
                                                <p className="text-gray-400 text-sm line-clamp-2">
                                                    {session.description}
                                                </p>
                                            )}
                                        </div>
                                        {session.status === "active" && (
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 animate-pulse">
                                                LIVE
                                            </span>
                                        )}
                                    </div>

                                    { }
                                    <div className="mb-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getLanguageColor(
                                                session.language
                                            )}`}
                                        >
                                            {session.language.toUpperCase()}
                                        </span>
                                    </div>

                                    { }
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700/50">
                                        <img
                                            src={session.host.avatar || "https://github.com/shadcn.png"}
                                            alt={session.host.username}
                                            className="w-8 h-8 rounded-full border-2 border-midnight-blue"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-400">
                                                Host: <span className="text-white font-medium">{session.host.username}</span>
                                            </p>
                                        </div>
                                    </div>

                                    { }
                                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{session.participants.length}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    { }
                                    {session.status === "active" && (
                                        <button
                                            onClick={() =>
                                                isParticipant
                                                    ? navigate(`/coding-session/${session._id}`)
                                                    : handleJoinSession(session._id)
                                            }
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-semibold hover:shadow-lg hover:shadow-midnight-blue/25 transition-all"
                                        >
                                            {isParticipant ? "Continue Session" : "Join Session"}
                                        </button>
                                    )}

                                    {session.status === "ended" && (
                                        <div className="w-full py-3 rounded-xl bg-gray-800/50 text-gray-500 font-semibold text-center">
                                            Session Ended
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            { }
            {showCreateModal && (
                <CreateSessionModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={(session) => {
                        setShowCreateModal(false);
                        navigate(`/coding-session/${session._id}`);
                    }}
                />
            )}
        </div>
    );
};

export default CodingSessions;
