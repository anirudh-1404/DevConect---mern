import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, MapPin, Briefcase, DollarSign, Code } from "lucide-react";

const FilterPanel = ({ onFilterChange, activeFilters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        type: "All",
        minSalary: "",
        maxSalary: "",
        skills: "",
        location: "",
    });

    useEffect(() => {
        if (activeFilters) {
            setFilters(activeFilters);
        }
    }, [activeFilters]);

    const handleChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);

        
        if (field === "search") {
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
                onFilterChange(newFilters);
            }, 500);
        } else {
            onFilterChange(newFilters);
        }
    };

    const clearFilters = () => {
        const emptyFilters = {
            search: "",
            type: "All",
            minSalary: "",
            maxSalary: "",
            skills: "",
            location: "",
        };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    const activeFilterCount = Object.values(filters).filter(
        (val) => val && val !== "All"
    ).length;

    return (
        <div className="mb-8">
            {}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search jobs by title, company, or description..."
                    value={filters.search}
                    onChange={(e) => handleChange("search", e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-emerald-800/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
            </div>

            {}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-emerald-800/40 rounded-xl text-gray-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
            >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-medium">Filters</span>
                {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                        {activeFilterCount}
                    </span>
                )}
            </button>

            {}
            {isOpen && (
                <div className="mt-4 p-6 glass-card rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Briefcase className="w-4 h-4 text-emerald-400" />
                                Job Type
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) => handleChange("type", e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            >
                                <option value="All">All Types</option>
                                <option value="Remote">Remote</option>
                                <option value="Onsite">Onsite</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        {}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                Location
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., San Francisco"
                                value={filters.location}
                                onChange={(e) => handleChange("location", e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                        </div>

                        {}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Code className="w-4 h-4 text-emerald-400" />
                                Skills
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., React, Node.js"
                                value={filters.skills}
                                onChange={(e) => handleChange("skills", e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-1">Comma-separated</p>
                        </div>

                        {}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                Min Salary
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 80000"
                                value={filters.minSalary}
                                onChange={(e) => handleChange("minSalary", e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                        </div>

                        {}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                Max Salary
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 150000"
                                value={filters.maxSalary}
                                onChange={(e) => handleChange("maxSalary", e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                        </div>
                    </div>

                    {}
                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="mt-6 flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"
                        >
                            <X className="w-4 h-4" />
                            Clear All Filters
                        </button>
                    )}
                </div>
            )}

            {}
            {activeFilterCount > 0 && !isOpen && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {filters.search && (
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full border border-emerald-500/30">
                            Search: {filters.search}
                        </span>
                    )}
                    {filters.type && filters.type !== "All" && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full border border-purple-500/30">
                            {filters.type}
                        </span>
                    )}
                    {filters.location && (
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full border border-cyan-500/30">
                            📍 {filters.location}
                        </span>
                    )}
                    {filters.skills && (
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full border border-emerald-500/30">
                            Skills: {filters.skills}
                        </span>
                    )}
                    {(filters.minSalary || filters.maxSalary) && (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full border border-yellow-500/30">
                            💰 ${filters.minSalary || "0"} - ${filters.maxSalary || "∞"}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterPanel;
