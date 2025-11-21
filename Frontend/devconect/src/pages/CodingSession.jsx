import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@/API/Interceptor";
import { useSocketContext } from "@/context/SocketContext";
import toast from "react-hot-toast";
import CodeEditor from "@/components/coding/CodeEditor";
import ParticipantList from "@/components/coding/ParticipantList";
import SessionControls from "@/components/coding/SessionControls";
import OutputPanel from "@/components/coding/OutputPanel";

import { ArrowLeft, Terminal } from "lucide-react";

const CodingSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { socket } = useSocketContext();

    const [session, setSession] = useState(null);
    const [code, setCode] = useState("// Write your code here");
    const [language, setLanguage] = useState("javascript");
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [showOutput, setShowOutput] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isHost = session?.host?._id === user._id;

    useEffect(() => {
        fetchSession();
    }, [id]);

    useEffect(() => {
        if (session && socket) {

            socket.emit("join-coding-session", id);


            socket.on("code-update", ({ code: newCode, userId }) => {
                if (userId !== user._id) {
                    setCode(newCode);
                }
            });


            socket.on("language-update", ({ language: newLanguage, userId }) => {
                if (userId !== user._id) {
                    setLanguage(newLanguage);
                    toast.success(`Language changed to ${newLanguage}`);
                }
            });


            socket.on("user-joined-session", ({ userId }) => {
                fetchSession();
                toast.success("A user joined the session");
            });


            socket.on("user-left-session", ({ userId }) => {
                fetchSession();
                toast("A user left the session");
            });


            return () => {
                socket.emit("leave-coding-session", id);
                socket.off("code-update");
                socket.off("language-update");
                socket.off("user-joined-session");
                socket.off("user-left-session");
            };
        }
    }, [session, socket, id]);

    const fetchSession = async () => {
        try {
            const { data } = await API.get(`/sessions/${id}`);
            setSession(data.session);
            setCode(data.session.code);
            setLanguage(data.session.language);
            setParticipants(data.session.participants);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching session:", error);
            toast.error("Failed to load session");
            navigate("/coding-sessions");
        }
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);


        if (socket) {
            socket.emit("code-change", {
                sessionId: id,
                code: newCode,
                userId: user._id,
            });
        }


        debouncedSave(newCode);
    };

    const debouncedSave = useRef(
        debounce(async (codeToSave) => {
            try {
                await API.put(`/sessions/${id}/code`, { code: codeToSave });
            } catch (error) {
                console.error("Error saving code:", error);
            }
        }, 2000)
    ).current;

    const handleLanguageChange = async (newLanguage) => {
        if (!isHost) {
            return toast.error("Only the host can change the language");
        }

        try {
            await API.put(`/sessions/${id}/language`, { language: newLanguage });
            setLanguage(newLanguage);


            if (socket) {
                socket.emit("language-change", {
                    sessionId: id,
                    language: newLanguage,
                    userId: user._id,
                });
            }

            toast.success(`Language changed to ${newLanguage}`);
        } catch (error) {
            toast.error("Failed to change language");
        }
    };

    const handleEndSession = async () => {
        if (!isHost) {
            return toast.error("Only the host can end the session");
        }

        if (!confirm("Are you sure you want to end this session?")) {
            return;
        }

        try {
            await API.put(`/sessions/${id}/end`);
            toast.success("Session ended");
            navigate("/coding-sessions");
        } catch (error) {
            toast.error("Failed to end session");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#020617] flex flex-col">
            { }
            <div className="bg-gray-900/50 backdrop-blur-xl border-b border-cyan-800/40 px-6 py-4">
                <div className="max-w-full mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/coding-sessions")}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white">{session.title}</h1>
                            <p className="text-sm text-gray-400">
                                Host: {session.host.username}
                            </p>
                        </div>
                    </div>

                    <SessionControls
                        language={language}
                        onLanguageChange={handleLanguageChange}
                        onEndSession={handleEndSession}
                        isHost={isHost}
                    />

                    <div className="flex items-center gap-2">
                        { }
                        <button
                            onClick={() => setShowOutput(!showOutput)}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${showOutput
                                ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
                                : "bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-cyan-500/30"
                                }`}
                        >
                            <Terminal className="w-4 h-4" />
                            <span className="hidden sm:inline">{showOutput ? "Hide" : "Show"} Output</span>
                        </button>
                    </div>
                </div>
            </div>

            { }
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex overflow-hidden">
                    { }
                    <div className="flex-1 flex flex-col">
                        <CodeEditor
                            code={code}
                            language={language}
                            onChange={handleCodeChange}
                        />
                    </div>

                    { }
                    <ParticipantList
                        participants={participants}
                        host={session.host}
                    />
                </div>

                { }
                {showOutput && (
                    <OutputPanel
                        code={code}
                        language={language}
                        onClose={() => setShowOutput(false)}
                    />
                )}
            </div>
        </div>
    );
};


function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default CodingSession;
