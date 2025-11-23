import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Trophy, Users, Clock } from "lucide-react";

const HackathonCard = ({ hackathon }) => {
    const isUpcoming = new Date(hackathon.startDate) > new Date();
    const isActive =
        new Date(hackathon.startDate) <= new Date() &&
        new Date(hackathon.endDate) >= new Date();

    return (
        <Link
            to={`/hackathons/${hackathon._id}`}
            className="group bg-midnight-gray/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-midnight-blue/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col h-full"
        >
            {/* Banner Image */}
            <div className="h-48 overflow-hidden relative">
                <img
                    src={
                        hackathon.bannerImage ||
                        "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=2574&auto=format&fit=crop"
                    }
                    alt={hackathon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
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
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-midnight-blue transition-colors">
                        {hackathon.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                        {hackathon.description}
                    </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 text-midnight-blue" />
                        <span>
                            {new Date(hackathon.startDate).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>
                            {hackathon.prizes?.[0]?.amount || "Prizes"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Users className="w-4 h-4 text-midnight-violet" />
                        <span>{hackathon.participants?.length || 0} Joined</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4 text-red-400" />
                        <span>
                            {Math.ceil(
                                (new Date(hackathon.endDate) - new Date(hackathon.startDate)) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            Days
                        </span>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {hackathon.tags?.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 rounded-lg bg-white/5 text-xs text-gray-300 border border-white/5"
                        >
                            {tag}
                        </span>
                    ))}
                    {hackathon.tags?.length > 3 && (
                        <span className="px-2 py-1 rounded-lg bg-white/5 text-xs text-gray-300 border border-white/5">
                            +{hackathon.tags.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default HackathonCard;
