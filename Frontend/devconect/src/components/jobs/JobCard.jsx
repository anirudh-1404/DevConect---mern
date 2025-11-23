import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Building2, Clock, DollarSign, Briefcase, Bookmark } from "lucide-react";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";

const JobCard = ({ job, isSaved: initialSaved = false, onSaveToggle }) => {
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if job is saved when component mounts
        if (!initialSaved) {
            checkIfSaved();
        }
    }, [job._id]);

    const checkIfSaved = async () => {
        try {
            const { data } = await API.get(`/saved-jobs/check/${job._id}`);
            setIsSaved(data.isSaved);
        } catch (error) {
            console.error("Error checking saved status:", error);
        }
    };

    const handleSaveToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        try {
            if (isSaved) {
                await API.delete(`/saved-jobs/${job._id}`);
                toast.success("Job removed from saved");
                setIsSaved(false);
                if (onSaveToggle) onSaveToggle(job._id);
            } else {
                await API.post(`/saved-jobs/${job._id}`);
                toast.success("Job saved successfully");
                setIsSaved(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update saved status");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link to={`/jobs/${job._id}`}>
            <div
                className="
          bg-midnight-gray/50 backdrop-blur-xl 
          border border-white/5 
          rounded-2xl p-6 
          hover:border-midnight-blue/50 
          hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] 
          transition-all duration-300
          cursor-pointer
          h-full flex flex-col
          relative
        "
            >
                {/* Bookmark Button */}
                <button
                    onClick={handleSaveToggle}
                    disabled={isLoading}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-midnight-gray/80 hover:bg-midnight-blue/20 transition-all z-10"
                    title={isSaved ? "Remove from saved" : "Save job"}
                >
                    <Bookmark
                        className={`w-5 h-5 transition-all ${isSaved
                            ? "fill-midnight-blue text-midnight-blue"
                            : "text-gray-400 hover:text-midnight-blue"
                            } ${isLoading ? "opacity-50" : ""}`}
                    />
                </button>

                <div className="flex-1">
                    <div className="flex justify-between items-start mb-4 pr-10">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2 hover:text-midnight-blue transition-colors">
                                {job.title}
                            </h3>
                            <div className="flex items-center text-midnight-blue text-sm font-medium mb-3">
                                <Building2 className="w-4 h-4 mr-1.5" />
                                {job.company}
                            </div>
                        </div>
                        <span
                            className={`
                px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0
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

                    <div className="space-y-2.5 mb-4">
                        <div className="flex items-center text-gray-400 text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                            {job.location}
                        </div>
                        {job.salary && (
                            <div className="flex items-center text-gray-400 text-sm">
                                <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                                {job.salary}
                            </div>
                        )}
                        <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="w-4 h-4 mr-2 text-gray-500" />
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    {job.description && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                            {job.description}
                        </p>
                    )}
                </div>

                <button
                    className="
            w-full py-2.5 rounded-xl 
            bg-midnight-blue/10 border border-midnight-blue/50 
            text-midnight-blue font-semibold text-sm
            hover:bg-midnight-blue hover:text-white 
            transition-all duration-300
            flex items-center justify-center gap-2
          "
                >
                    <Briefcase className="w-4 h-4" />
                    View Details
                </button>
            </div>
        </Link>
    );
};

export default JobCard;
