import React, { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const RecruitersSection = () => {
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_API}/recruiters`,
          { withCredentials: true }
        );
        setRecruiters(response.data.allRecruiters || []);
      } catch (err) {
        console.error("Error fetching recruiters", err);
      }
    };
    fetchRecruiters();
  }, []);

  return (
    <section className="mt-20 mb-16 px-6 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 py-12 mx-7 rounded-3xl border border-white/10 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 px-4">
        <div className="flex items-center gap-3">
          <Briefcase className="text-blue-400 w-10 h-10 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-3xl sm:text-4xl font-extrabold tracking-wide">
            Meet Top Recruiters
          </h2>
        </div>

        <Link
          to="/recruiters"
          className="mt-4 md:mt-0 px-5 py-2.5 rounded-full text-sm font-semibold
          bg-gradient-to-r from-blue-500 to-cyan-400 text-white
          hover:shadow-[0_0_18px_rgba(6,182,212,0.7)] hover:scale-105
          transition-all duration-300"
        >
          Show All →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-6">
        {recruiters.slice(0, 4).map((rec) => (
          <div
            key={rec._id}
            className="bg-white/10 p-6 rounded-2xl border border-white/10 hover:border-cyan-400/40
            hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-2 transition-all duration-300 text-center"
          >
            <img
              src={rec.avatar || "https://github.com/shadcn.png"}
              alt={rec.username}
              className="w-20 h-20 rounded-full mx-auto border-2 border-blue-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
            />
            <h3 className="text-white font-semibold text-lg mt-4">
              {rec.username}
            </h3>
            <p className="text-cyan-400 text-sm">{"Recruiter"}</p>
            <Link to={`/recruiters/${rec._id}`}>
              <button className="mt-4 px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:scale-105 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300 cursor-pointer">
                View Profile
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecruitersSection;
