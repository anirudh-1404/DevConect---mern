import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Building2, Clock, DollarSign, Briefcase } from "lucide-react";

const JobCard = ({ job }) => {
    return (
        <Link to={`/jobs/${job._id}`}>
            <div
                className="
          bg-gray-900/50 backdrop-blur-xl 
          border border-cyan-800/40 
          rounded-2xl p-6 
          hover:border-cyan-500/50 
          hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] 
          transition-all duration-300
          cursor-pointer
          h-full flex flex-col
        "
            >
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2 hover:text-cyan-400 transition-colors">
                                {job.title}
                            </h3>
                            <div className="flex items-center text-cyan-400 text-sm font-medium mb-3">
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
            bg-cyan-500/10 border border-cyan-500/50 
            text-cyan-400 font-semibold text-sm
            hover:bg-cyan-500 hover:text-white 
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
