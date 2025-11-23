import React, { useState, useEffect } from "react";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import { User, Calendar, Clock, Mail, MessageSquare, CheckCircle, XCircle, MoreVertical, ChevronRight } from "lucide-react";
import ApplicantDetails from "./ApplicantDetails";

const ApplicantList = ({ jobId }) => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    useEffect(() => {
        if (jobId) {
            fetchApplicants();
        }
    }, [jobId]);

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/applications/job/${jobId}`);
            setApplicants(res.data);
        } catch (error) {
            console.error("Error fetching applicants:", error);
            toast.error("Failed to load applicants");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = (applicationId, newStatus) => {
        // If status is rejected, remove from list
        if (newStatus === "Rejected") {
            setApplicants(prev => prev.filter(app => app._id !== applicationId));
            // Close details panel if the rejected applicant was selected
            if (selectedApplicant && selectedApplicant._id === applicationId) {
                setSelectedApplicant(null);
            }
        } else {
            // Update status for other statuses
            setApplicants(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status: newStatus } : app
            ));
            if (selectedApplicant && selectedApplicant._id === applicationId) {
                setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
            }
        }
    };

    if (loading) return <div className="text-center text-slate-500 py-8">Loading applicants...</div>;

    if (applicants.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <User className="w-12 h-12 mb-3 opacity-20" />
                <p>No applicants yet for this job.</p>
            </div>
        );
    }

    return (
        <div className="flex h-full gap-6 overflow-hidden">

            <div className={`flex-1 overflow-y-auto custom-scrollbar pr-2 ${selectedApplicant ? "hidden md:block" : "block"}`}>
                <div className="space-y-3">
                    {applicants.map((app) => (
                        <div
                            key={app._id}
                            onClick={() => setSelectedApplicant(app)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:bg-midnight-gray/50 hover:scale-[1.01] ${selectedApplicant?._id === app._id
                                ? "bg-midnight-gray border-midnight-blue/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                                : "bg-midnight-gray/30 border-white/10 hover:border-midnight-blue/30"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={app.applicant.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                                    alt={app.applicant.username}
                                    className="w-12 h-12 rounded-full border-2 border-midnight-blue/50 object-cover shadow-md shadow-midnight-blue/10 transition-transform hover:scale-110"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-white truncate">{app.applicant.username}</h4>
                                    <p className="text-xs text-slate-400 truncate">{app.applicant.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                            Applied {new Date(app.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 transition-all duration-300 ${selectedApplicant?._id === app._id ? "text-midnight-blue translate-x-1" : "text-gray-600"}`} />
                            </div>
                        </div>
                    ))
                    }
                </div >
            </div >

            { }
            {
                selectedApplicant && (
                    <div className="fixed inset-0 z-50 md:static md:z-auto md:w-[450px] md:flex-shrink-0 bg-zinc-900 md:bg-transparent">
                        <ApplicantDetails
                            application={selectedApplicant}
                            onClose={() => setSelectedApplicant(null)}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    </div>
                )
            }
        </div >
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case "Applied": return "bg-midnight-blue/10 text-midnight-blue border-midnight-blue/30";
        case "Interview Scheduled": return "bg-midnight-violet/10 text-midnight-violet border-midnight-violet/30";
        case "Interviewing": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
        case "Hired": return "bg-green-500/10 text-green-400 border-green-500/30";
        case "Offered": return "bg-green-500/10 text-green-400 border-green-500/30";
        case "Rejected": return "bg-red-500/10 text-red-400 border-red-500/30";
        default: return "bg-gray-500/10 text-slate-400 border-gray-500/30";
    }
};

export default ApplicantList;
