import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import JobCard from "@/components/jobs/JobCard";
import { Bookmark, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const SavedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            const { data } = await API.get("/saved-jobs");
            // Extract job objects from savedJobs array
            const jobsList = data.savedJobs.map(saved => saved.job);
            setJobs(jobsList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching saved jobs:", error);
            setLoading(false);
        }
    };

    const handleUnsave = async (jobId) => {
        try {
            await API.delete(`/saved-jobs/${jobId}`);
            setJobs(jobs.filter(job => job._id !== jobId));
        } catch (error) {
            console.error("Error unsaving job:", error);
        }
    };

    const filteredJobs = jobs.filter(
        (job) =>
            job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job?.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading saved jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-16">
            <div className="max-w-7xl mx-auto">
                { }
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Bookmark className="w-12 h-12 text-emerald-400 fill-emerald-400" />
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">
                            Saved Jobs
                        </h1>
                    </div>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Your bookmarked opportunities • {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} saved
                    </p>
                </div>

                {jobs.length === 0 ? (

                    <div className="text-center py-20">
                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
                            <Bookmark className="w-24 h-24 text-gray-700 relative" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">
                            No saved jobs yet
                        </h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Start bookmarking jobs you're interested in to keep track of opportunities
                        </p>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-black font-semibold rounded-xl hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.5)] transition-all"
                        >
                            <Sparkles className="w-5 h-5" />
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <>
                        { }
                        <div className="mb-8">
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search saved jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-emerald-800/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                            </div>
                        </div>

                        { }
                        {searchTerm && (
                            <p className="text-slate-400 text-sm mb-6 text-center">
                                Showing {filteredJobs.length} of {jobs.length} saved jobs
                            </p>
                        )}

                        { }
                        {filteredJobs.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-400">No jobs match your search</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredJobs.map((job) => (
                                    <JobCard
                                        key={job._id}
                                        job={job}
                                        isSaved={true}
                                        onSaveToggle={handleUnsave}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
