import React, { useState, useEffect } from "react";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import { Users, Briefcase, ChevronRight, Search } from "lucide-react";
import ApplicantList from "../components/crm/ApplicantList";

const RecruiterCRM = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await API.get("/jobs/my-jobs");
            setJobs(res.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-midnight-black text-white p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-midnight-blue to-midnight-violet text-transparent bg-clip-text">
                        Recruiter CRM
                    </h1>
                    <p className="text-slate-400 mt-2">Manage your job postings and applicants efficiently.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <div className={`lg:col-span-4 ${selectedJob ? "hidden lg:block" : "block"}`}>
                        <div className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 h-[calc(100vh-200px)] flex flex-col">
                            <div className="mb-4 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-midnight-gray border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-midnight-blue focus:outline-none"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {loading ? (
                                    <p className="text-center text-slate-500 py-4">Loading jobs...</p>
                                ) : filteredJobs.length === 0 ? (
                                    <p className="text-center text-slate-500 py-4">No jobs found.</p>
                                ) : (
                                    filteredJobs.map((job) => (
                                        <div
                                            key={job._id}
                                            onClick={() => setSelectedJob(job)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] ${selectedJob?._id === job._id
                                                ? "bg-midnight-blue/10 border-midnight-blue/50"
                                                : "bg-midnight-gray/30 border-white/10 hover:border-midnight-blue/30"
                                                }`}
                                        >
                                            <h3 className="font-semibold text-white truncate">{job.title}</h3>
                                            <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="w-3 h-3" />
                                                    {job.type}
                                                </span>
                                                <span className="px-2 py-1 rounded-full bg-midnight-gray border border-white/10">
                                                    {job.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>


                    <div className={`lg:col-span-8 ${!selectedJob ? "hidden lg:block" : "block"}`}>
                        {selectedJob ? (
                            <div className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[calc(100vh-200px)] flex flex-col">
                                <div className="flex items-center gap-2 mb-6 lg:hidden">
                                    <button
                                        onClick={() => setSelectedJob(null)}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        ← Back to Jobs
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
                                        <p className="text-slate-400 text-sm mt-1">{selectedJob.location} • {selectedJob.type}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-midnight-blue bg-midnight-blue/10 px-3 py-1.5 rounded-lg border border-midnight-blue/20">
                                        <Users className="w-4 h-4" />
                                        <span className="text-sm font-medium">Applicants</span>
                                    </div>
                                </div>

                                <ApplicantList jobId={selectedJob._id} />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-midnight-gray/30 rounded-2xl border border-white/10 border-dashed">
                                <Briefcase className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-lg">Select a job to view applicants</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterCRM;
