import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Building2, X } from "lucide-react";

const RecruitersPage = () => {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecruiters();
  }, [search, company, industry]);

  const fetchRecruiters = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (company) params.append("company", company);
      if (industry) params.append("industry", industry);

      const response = await API.get(`/recruiters?${params.toString()}`);
      setRecruiters(response.data.allRecruiters || []);
      setLoading(false);
    } catch (err) {
      console.log("error fetching recruiters", err.message);
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCompany("");
    setIndustry("");
  };

  const hasActiveFilters = search || company || industry;

  return (
    <main>
      <section className="min-h-screen bg-[#020617] text-white py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tight">
            Top Recruiters & Hiring Partners
          </h1>

          <p className="text-gray-400 text-sm sm:text-base mt-4 max-w-3xl mx-auto leading-relaxed">
            Connect with HR managers, hiring leads & tech recruiters actively looking for talented developers.
          </p>
        </div>

        {}
        <div className="max-w-7xl mx-auto mb-12 space-y-6">
          {}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or company..."
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
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Filter by company..."
                className="
                  w-full pl-12 pr-4 py-3 rounded-xl
                  bg-gray-800/50 backdrop-blur-md 
                  border border-cyan-800/40 
                  text-white placeholder-gray-400
                  focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                  transition-all outline-none
                "
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by industry..."
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-gray-800/50 backdrop-blur-md 
                  border border-cyan-800/40 
                  text-white placeholder-gray-400
                  focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                  transition-all outline-none
                "
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
          </div>

          {}
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Found <span className="text-cyan-400 font-semibold">{recruiters.length}</span> recruiter{recruiters.length !== 1 ? 's' : ''}
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
            Loading recruiters...
          </div>
        ) : recruiters.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-xl">No recruiters found matching your criteria</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-2 md:px-6">
            {recruiters.map((rec) => (
              <div
                key={rec._id}
                className="
                  group flex items-center gap-8 p-6  
                  rounded-2xl bg-gray-900/70 backdrop-blur-xl 
                  border border-cyan-800/40
                  shadow-[0_0_20px_rgba(6,182,212,0.15)]
                  hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]
                  hover:border-cyan-500/60 hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <img
                  src={rec.avatar || "https://github.com/shadcn.png"}
                  alt="recruiter-avatar"
                  className="
                    w-24 h-24 rounded-full object-cover
                    border-2 border-cyan-400
                    shadow-[0_0_20px_rgba(6,182,212,0.55)]
                    group-hover:shadow-[0_0_35px_rgba(6,182,212,0.85)]
                    transition-all duration-300
                  "
                />

                <div className="flex-1">
                  <h4 className="text-2xl font-semibold tracking-wide text-white group-hover:text-cyan-300 transition">
                    {rec.username}
                  </h4>

                  {rec.company && (
                    <p className="text-cyan-400 text-sm mt-1 font-medium flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {rec.company}
                    </p>
                  )}

                  {rec.industry && (
                    <p className="text-gray-400 text-xs mt-1">
                      {rec.industry}
                    </p>
                  )}

                  <p className="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-2">
                    {rec.bio || "No description added yet."}
                  </p>

                  <Link to={`/recruiters/${rec._id}`}>
                    <button
                      className="
                        mt-4 px-5 py-2 rounded-full text-sm font-medium
                        bg-gradient-to-r from-pink-400 to-purple-600
                        text-white
                        hover:scale-[1.05] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] 
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
    </main>
  );
};

export default RecruitersPage;
