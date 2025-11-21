import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, X } from "lucide-react";

const DevelopersPage = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const commonSkills = ["React", "Node.js", "Python", "JavaScript", "TypeScript", "Java", "C++", "MongoDB", "PostgreSQL", "AWS"];

  useEffect(() => {
    fetchDevelopers();
  }, [search, location, selectedSkills]);

  const fetchDevelopers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (location) params.append("location", location);
      selectedSkills.forEach(skill => params.append("skills", skill));

      const response = await API.get(`/developers?${params.toString()}`);
      setDevelopers(response.data.devs || []);
      setLoading(false);
    } catch (err) {
      console.log("Unable to fetch developers!", err);
      setLoading(false);
    }
  };

  const addSkill = (skill) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skillToRemove));
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setSelectedSkills([]);
  };

  const hasActiveFilters = search || location || selectedSkills.length > 0;

  return (
    <section className="min-h-screen bg-[#020617] py-16 px-4 sm:px-8 lg:px-16 text-white">
      {}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tight">
          Discover Developers
        </h1>

        <p className="text-gray-400 text-sm sm:text-base mt-4 max-w-3xl mx-auto leading-relaxed">
          Connect with top-notch developers, explore talents, and collaborate on exciting tech projects.
        </p>
      </div>

      {}
      <div className="max-w-7xl mx-auto mb-12 space-y-6">
        {}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or bio..."
            className="
              w-full pl-12 pr-4 py-4 rounded-xl
              bg-gray-800/50 backdrop-blur-md 
              border border-cyan-800/40 
              text-white placeholder-gray-400
              focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
              transition-all outline-none
            "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Filter by location..."
              className="
                w-full pl-12 pr-4 py-3 rounded-xl
                bg-gray-800/50 backdrop-blur-md 
                border border-cyan-800/40 
                text-white placeholder-gray-400
                focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                transition-all outline-none
              "
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {}
          <div className="relative">
            <input
              type="text"
              placeholder="Add skills (e.g., React, Python)..."
              className="
                w-full px-4 py-3 rounded-xl
                bg-gray-800/50 backdrop-blur-md 
                border border-cyan-800/40 
                text-white placeholder-gray-400
                focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                transition-all outline-none
              "
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill(skillInput)}
            />
          </div>
        </div>

        {}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400">Quick add:</span>
          {commonSkills.filter(s => !selectedSkills.includes(s)).slice(0, 6).map(skill => (
            <button
              key={skill}
              onClick={() => addSkill(skill)}
              className="px-3 py-1 text-xs rounded-full bg-gray-800/50 border border-cyan-800/40 text-cyan-400 hover:bg-cyan-500/20 transition-all"
            >
              + {skill}
            </button>
          ))}
        </div>

        {}
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm flex items-center gap-2"
              >
                {skill}
                <X
                  className="w-4 h-4 cursor-pointer hover:text-red-400 transition-colors"
                  onClick={() => removeSkill(skill)}
                />
              </span>
            ))}
          </div>
        )}

        {}
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            Found <span className="text-cyan-400 font-semibold">{developers.length}</span> developer{developers.length !== 1 ? 's' : ''}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {}
      {loading ? (
        <div className="text-center text-gray-500 py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          Loading developers...
        </div>
      ) : developers.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <p className="text-xl">No developers found matching your criteria</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-10">
          {developers.map((item) => (
            <div
              key={item._id}
              className="
                group flex items-center gap-8 p-6
                rounded-2xl bg-gray-900/70 backdrop-blur-xl 
                border border-cyan-800/40
                shadow-[0_0_20px_rgba(6,182,212,0.15)]
                hover:shadow-[0_0_35px_rgba(6,182,212,0.35)]
                hover:border-cyan-500/60 hover:-translate-y-1
                transition-all duration-300
              "
            >
              {}
              <img
                src={item.avatar || "https://github.com/shadcn.png"}
                alt="dev-avatar"
                className="
                  w-24 h-24 rounded-full object-cover
                  border-2 border-cyan-400
                  shadow-[0_0_20px_rgba(6,182,212,0.55)]
                  group-hover:shadow-[0_0_35px_rgba(6,182,212,0.8)]
                  transition-all duration-300
                "
              />

              {}
              <div className="flex-1">
                <h4 className="text-2xl font-semibold tracking-wide text-white group-hover:text-cyan-300 transition">
                  {item.username}
                </h4>

                {item.location && (
                  <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </p>
                )}

                <p className="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-2">
                  {item.bio || "No bio added yet..."}
                </p>

                {item.skills && item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                        {skill}
                      </span>
                    ))}
                    {item.skills.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-gray-400">
                        +{item.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <Link to={`/developers/${item._id}`}>
                  <button
                    className="
                      mt-4 px-5 py-2 text-sm font-medium rounded-full
                      bg-gradient-to-r from-cyan-500 to-blue-600
                      text-white
                      shadow-lg shadow-cyan-900/40
                      group-hover:shadow-cyan-500/40
                      hover:scale-[1.05]
                      transition-all duration-300 cursor-pointer
                    "
                  >
                    View Profile →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DevelopersPage;
