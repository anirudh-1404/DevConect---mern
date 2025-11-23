import React, { useState } from "react";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import { X, Mail, Calendar, Clock, MapPin, Briefcase, Github, Linkedin, Globe, Download, MessageSquare, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApplicantDetails = ({ application, onClose, onStatusUpdate }) => {
    const [status, setStatus] = useState(application.status);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState("");
    const [sendingMsg, setSendingMsg] = useState(false);
    const navigate = useNavigate();


    const [interviewDate, setInterviewDate] = useState("");
    const [interviewTime, setInterviewTime] = useState("");
    const [interviewMode, setInterviewMode] = useState("Online");
    const [interviewType, setInterviewType] = useState("Technical");

    const handleStatusChange = async () => {
        setUpdating(true);
        try {
            await API.put(`/applications/${application._id}/status`, {
                status,
                interviewDate,
                interviewTime,
                interviewMode,
                interviewType
            });
            toast.success(`Status updated to ${status}`);
            onStatusUpdate(application._id, status);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setSendingMsg(true);
        try {
            await API.post(`/messages/send/${application.applicant._id}`, {
                message
            });
            toast.success("Message sent!");
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        } finally {
            setSendingMsg(false);
        }
    };

    const updateButtonClass = `w-full py-2.5 rounded-lg font-semibold transition-all duration-300 ${updating || status === application.status
        ? "bg-midnight-gray/50 text-slate-500 cursor-not-allowed"
        : "bg-gradient-to-r from-midnight-blue to-midnight-violet text-white hover:shadow-lg hover:shadow-midnight-blue/40 hover:scale-[1.02] active:scale-[0.98]"
        }`;

    const sendButtonClass = `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${sendingMsg || !message.trim()
        ? "bg-midnight-gray/50 text-slate-500 cursor-not-allowed"
        : "bg-midnight-blue text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-midnight-blue/30 hover:scale-[1.02] active:scale-[0.98]"
        }`;

    return (
        <div className="h-full flex flex-col bg-midnight-gray border-l border-white/10 shadow-2xl overflow-hidden">
            { }
            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-midnight-gray/95 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <img
                        src={application.applicant.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                        alt={application.applicant.username}
                        className="w-16 h-16 rounded-full border-2 border-midnight-blue object-cover shadow-lg shadow-midnight-blue/20 transition-transform hover:scale-105"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-white">{application.applicant.username}</h2>
                        <p className="text-midnight-blue text-sm">{application.applicant.email}</p>
                        <div className="flex gap-3 mt-2">
                            {application.applicant.github && (
                                <a href={application.applicant.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                    <Github className="w-4 h-4" />
                                </a>
                            )}
                            {application.applicant.linkedin && (
                                <a href={application.applicant.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-midnight-blue transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-all duration-200 hover:scale-110">
                    <X className="w-6 h-6" />
                </button>
            </div>

            { }
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                { }
                <div className="bg-midnight-gray/30 rounded-xl p-5 border border-white/10 hover:border-midnight-blue/30 transition-colors">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Application Status</h3>
                    <div className="space-y-4">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-midnight-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 focus:outline-none transition-all"
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Hired">Hired</option>
                            <option value="Offered">Offered</option>
                            <option value="Rejected">Rejected</option>
                        </select>

                        <button
                            onClick={handleStatusChange}
                            disabled={updating || status === application.status}
                            className={updateButtonClass}
                        >
                            {updating ? "Updating..." : "Update Status"}
                        </button>

                        {/* Schedule Interview Button */}
                        <button
                            onClick={() => navigate('/schedule-interview', {
                                state: {
                                    applicant: application.applicant,
                                    applicationId: application._id
                                }
                            })}
                            className="w-full py-2.5 rounded-lg font-semibold transition-all duration-300 bg-midnight-violet/20 border border-midnight-violet/50 text-midnight-violet hover:bg-midnight-violet hover:text-white hover:shadow-lg hover:shadow-midnight-violet/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <Video className="w-4 h-4" />
                            Schedule Interview
                        </button>
                    </div>
                </div>

                { }
                <div>
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neon-green" /> Cover Letter
                    </h3>
                    <div className="bg-midnight-gray/30 rounded-xl p-4 border border-white/10 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {application.coverLetter || "No cover letter provided."}
                    </div>
                </div>

                { }
                <div>
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-400" /> Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {application.applicant.skills && application.applicant.skills.length > 0 ? (
                            application.applicant.skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-midnight-violet/10 text-midnight-violet border border-midnight-violet/30 rounded-full text-xs font-medium hover:bg-midnight-violet/20 transition-colors">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-slate-500 text-sm italic">No skills listed</span>
                        )}
                    </div>
                </div>

                { }
                {
                    application.applicant.bio && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">About</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{application.applicant.bio}</p>
                        </div>
                    )
                }

                { }
                <div className="pt-6 border-t border-zinc-800">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-neon-green" /> Send Message
                    </h3>
                    <form onSubmit={handleSendMessage} className="space-y-3">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message to the applicant..."
                            className="w-full bg-midnight-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 focus:outline-none min-h-[100px] resize-none transition-all"
                        />
                        <button
                            type="submit"
                            disabled={sendingMsg || !message.trim()}
                            className={sendButtonClass}
                        >
                            {sendingMsg ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default ApplicantDetails;
