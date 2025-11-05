import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DeveloperProfile = () => {
  const [devProfile, setDevProfile] = useState([]);
  const { id } = useParams();

  try {
    useEffect(() => {
      const fetchProfile = async () => {
        const response = await API.get(`/developers/${id}`);
        setDevProfile(response.data.dev);
        console.log(response.data.dev);
      };

      fetchProfile();
    }, []);
  } catch (err) {
    console.log("Unable to fetch user profile");
  }

  if (!devProfile) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020617] to-[#0f172a]">
        <p className="text-gray-400 text-lg animate-pulse">
          Loading profile...
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] text-white py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="flex justify-center w-full md:w-1/3">
            <img
              src={devProfile.avatar || "https://github.com/shadcn.png"}
              alt="dev"
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl border-2 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.4)]"
            />
          </div>

          <div className="w-full md:w-2/3 space-y-5">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text tracking-wide">
              {devProfile.username}
            </h1>

            <p className="text-gray-300 text-sm leading-relaxed italic">
              {devProfile.bio || "This developer hasn't added a bio yet."}
            </p>

            <div className="space-y-2 text-gray-400 text-sm">
              <p>
                <span className="text-cyan-400 font-medium">Email:</span>{" "}
                {devProfile.email}
              </p>

              {devProfile.role && (
                <p>
                  <span className="text-cyan-400 font-medium">Role:</span>{" "}
                  {devProfile.role}
                </p>
              )}

              {devProfile.github ? (
                <p>
                  <span className="text-cyan-400 font-medium">GitHub:</span>{" "}
                  <a
                    href={devProfile.github}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    {devProfile.github}
                  </a>
                </p>
              ) : (
                <p className="text-red-400/80 italic">
                  This developer hasn't added a GitHub link.
                </p>
              )}

              {devProfile.linkedin ? (
                <p>
                  <span className="text-cyan-400 font-medium">LinkedIn:</span>{" "}
                  <a
                    href={devProfile.linkedin}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    {devProfile.linkedin}
                  </a>
                </p>
              ) : (
                <p className="text-red-400/80 italic">
                  This developer hasn't added a LinkedIn link.
                </p>
              )}

              {devProfile.skills && devProfile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {devProfile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-cyan-400/20 border border-cyan-400/40 rounded-full text-xs text-cyan-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-red-400/80 italic">
                  This developer hasn't added any skills yet.
                </p>
              )}
            </div>

            <button className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:scale-105 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all font-medium text-white">
              Connect
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default DeveloperProfile;
