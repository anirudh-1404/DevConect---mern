import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const DevelopersPage = () => {
  const [search, setSearch] = useState("");
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    try {
      const fetchDevelopers = async () => {
        const response = await API.get("/developers");
        setDevelopers(response.data.devs || []);
      };

      fetchDevelopers();
    } catch (err) {
      console.log("Unable to fetch developers!");
    }
  }, []);

  const filteredDevs = developers.filter((dev) => {
    return (
      dev.username.toLowerCase().includes(search.toLowerCase()) ||
      (dev.bio && dev.bio.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] text-white py-20 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text tracking-wide">
          Connect with Top Developers
        </h1>

        <p className="text-gray-400 text-sm md:text-base mt-3 tracking-wide max-w-2xl mx-auto">
          Discover skilled developers, explore portfolios, and start
          collaborating.
        </p>
      </div>

      <div className="flex justify-center mb-14">
        <input
          type="text"
          placeholder="🔍 Search developers by name or skill…"
          className="w-full md:w-2/3 lg:w-1/2 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md 
          border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 
          placeholder-gray-400 text-white outline-none transition-all duration-300"
          name="searchdevs"
          id="searchdevs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-10">
        {filteredDevs.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.1)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={item.avatar || "https://github.com/shadcn.png"}
              alt="dev-avatar"
              className="w-20 h-20 rounded-full border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] object-cover"
            />

            <div>
              <h4 className="text-xl font-semibold text-white tracking-wide">
                {item.username}
              </h4>
              <p className="text-gray-400 text-sm mt-1">
                {item.bio || "No bio added yet..."}
              </p>

              <Link to={`/developers/${item._id}`}>
                <button className="mt-3 text-sm px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-md hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:scale-105 transition-all duration-300">
                  View Profile
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DevelopersPage;
