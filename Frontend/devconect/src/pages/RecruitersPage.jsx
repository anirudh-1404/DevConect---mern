import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RecruitersPage = () => {
  const [search, setSearch] = useState("");
  const [recruiters, setRecruiters] = useState([]);

  const fetchRecruiters = async () => {
    try {
      const response = await API.get("/recruiters");
      setRecruiters(response.data.allRecruiters || []);
    } catch (err) {
      console.log("error fetching recruiters", err.message);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const filteredRecruiters = recruiters.filter((rec) =>
    rec.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <section className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] text-white py-20 px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text tracking-wide">
            Top Recruiters & Hiring Partners
          </h1>

          <p className="text-gray-400 text-sm md:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            Discover hiring managers, HR leads, and tech recruiters who are
            actively seeking talented developers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-2xl font-semibold text-cyan-300 tracking-wide">
            Connect With Industry Leaders
          </h3>

          <p className="text-gray-400 text-base max-w-3xl mx-auto">
            These recruiters collaborate with startups, SaaS companies & MNCs.
            Build connections that open doors.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"></div>
        </div>

        <div className="flex justify-center mb-14 mt-10">
          <input
            type="text"
            placeholder="🔍 Search recruiters by name"
            className="w-full md:w-2/3 lg:w-1/2 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md 
            border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 
            placeholder-gray-400 text-white outline-none transition-all duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mt-16 px-4 md:px-10">
          {filteredRecruiters.map((rec) => (
            <div
              key={rec._id}
              className="flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/10 
              rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.1)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={rec.avatar || "https://github.com/shadcn.png"}
                alt="recruiter-avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
              />

              <div className="flex-1 ml-6">
                <h4 className="text-xl font-semibold text-white tracking-wide">
                  {rec.username}
                </h4>
                <p className="text-cyan-400 text-sm mt-1 font-medium">
                  {rec.company || "Recruiter / HR Partner"}
                </p>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  {rec.bio || "No description added yet."}
                </p>
              </div>

              <Link to={`/recruiters/${rec._id}`}>
                <button
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 
                text-white text-sm font-medium hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300"
                >
                  View Profile
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default RecruitersPage;
