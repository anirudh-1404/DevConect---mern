import API from "@/API/Interceptor";
import React, { useEffect, useState, useContext } from "react";
import HackathonCard from "@/components/hackathons/HackathonCard";
import { Search, Trophy, Plus, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const Hackathons = () => {
    const [hackathons, setHackathons] = useState([]);
    const [filteredHackathons, setFilteredHackathons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const { data } = await API.get("/hackathons");
                setHackathons(data.hackathons);
                setFilteredHackathons(data.hackathons);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching hackathons:", error);
                setLoading(false);
            }
        };
        fetchHackathons();
    }, []);

    useEffect(() => {
        let filtered = hackathons.filter(
            (h) =>
                h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filterStatus !== "All") {
            const now = new Date();
            if (filterStatus === "Active") {
                filtered = filtered.filter(
                    (h) => new Date(h.startDate) <= now && new Date(h.endDate) >= now
                );
            } else if (filterStatus === "Upcoming") {
                filtered = filtered.filter((h) => new Date(h.startDate) > now);
            } else if (filterStatus === "Ended") {
                filtered = filtered.filter((h) => new Date(h.endDate) < now);
            }
        }

        setFilteredHackathons(filtered);
    }, [searchTerm, filterStatus, hackathons]);

    return (
        <div className="min-h-screen bg-midnight-black text-white px-4 sm:px-6 py-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Trophy className="w-12 h-12 text-yellow-500" />
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                            Hackathons
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Compete, collaborate, and build amazing projects. Win prizes and get
                        recognized!
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    {/* Search */}
                    <div className="relative flex-1 w-full max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search hackathons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-midnight-gray/50 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue/50 outline-none transition-all"
                        />
                    </div>

                    {/* Create Button */}
                    {user && (
                        <Link to="/hackathons/create">
                            <button className="px-6 py-4 rounded-2xl bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-bold shadow-lg hover:shadow-midnight-blue/25 hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
                                <Plus className="w-5 h-5" />
                                Host Hackathon
                            </button>
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
                    {["All", "Active", "Upcoming", "Ended"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300 cursor-pointer ${filterStatus === status
                                ? "bg-midnight-blue text-white shadow-lg shadow-midnight-blue/25"
                                : "bg-midnight-gray/50 border border-white/10 text-gray-400 hover:border-midnight-blue/50 hover:text-midnight-blue"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div className="text-center text-gray-500 py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-midnight-blue mx-auto mb-4"></div>
                        Loading hackathons...
                    </div>
                ) : filteredHackathons.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                        <p className="text-xl">No hackathons found matching your search</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-400">
                                Showing{" "}
                                <span className="text-midnight-blue font-semibold">
                                    {filteredHackathons.length}
                                </span>{" "}
                                {filteredHackathons.length === 1 ? "hackathon" : "hackathons"}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredHackathons.map((hackathon) => (
                                <HackathonCard key={hackathon._id} hackathon={hackathon} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Hackathons;
