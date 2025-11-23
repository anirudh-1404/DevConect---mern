import API from "@/API/Interceptor";
import React, { useEffect, useState, useContext } from "react";
import JobCard from "@/components/jobs/JobCard";
import { Search, Briefcase, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("All");


    const { user: authUser } = useContext(AuthContext);


    const user = authUser || (() => {
        try {
            const userData = localStorage.getItem("user");
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    })();


    const isRecruiter = user?.role?.toLowerCase() === "recruiter";

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await API.get("/jobs");
                setJobs(data);
                setFilteredJobs(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        let filtered = jobs.filter(
            (job) =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filterType !== "All") {
            filtered = filtered.filter((job) => job.type === filterType);
        }

        setFilteredJobs(filtered);
    }, [searchTerm, filterType, jobs]);

    return (
        <div className="min-h-screen bg-midnight-black text-white px-4 sm:px-6 py-16">
            <div className="max-w-7xl mx-auto">
                { }
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Briefcase className="w-12 h-12 text-midnight-blue" />
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet">
                            Job Board
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Discover exciting opportunities from top tech companies and startups
                    </p>
                </div>

                { }
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    { }
                    <div className="relative flex-1 w-full max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title, company, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="
                w-full pl-12 pr-4 py-4 rounded-2xl 
                bg-midnight-gray/50 border border-white/10 
                text-white placeholder-gray-500 
                focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue/50 
                outline-none transition-all
              "
                        />
                    </div>

                    { }
                    {isRecruiter && (
                        <Link to="/jobs/create">
                            <button
                                className="
                  px-6 py-4 rounded-2xl 
                  bg-gradient-to-r from-midnight-blue to-midnight-violet 
                  text-white font-bold shadow-lg 
                  hover:shadow-midnight-blue/25 hover:scale-105 
                  transition-all duration-300
                  flex items-center gap-2 whitespace-nowrap
                "
                            >
                                <Plus className="w-5 h-5" />
                                Post a Job
                            </button>
                        </Link>
                    )}
                </div>

                { }
                <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
                    {["All", "Remote", "Onsite", "Hybrid"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`
px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap
transition-all duration-300 cursor-pointer
                ${filterType === type
                                    ? "bg-midnight-blue text-white shadow-lg shadow-midnight-blue/25"
                                    : "bg-midnight-gray/50 border border-white/10 text-gray-400 hover:border-midnight-blue/50 hover:text-midnight-blue"
                                }
`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                { }
                {loading ? (
                    <div className="text-center text-gray-500 py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-midnight-blue mx-auto mb-4"></div>
                        Loading jobs...
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                        <p className="text-xl">No jobs found matching your search</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-400">
                                Showing <span className="text-midnight-blue font-semibold">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'job' : 'jobs'}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Jobs;
