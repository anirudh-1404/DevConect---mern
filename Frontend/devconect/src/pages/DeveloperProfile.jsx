import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DeveloperProfile = () => {
  const [devProfile, setDevProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get(`/developers/${id}`);
        setDevProfile(response.data.dev);
      } catch (err) {
        console.log("Unable to fetch developer profile");
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await API.get(`/post/user/${id}`);
        setUserPosts(res.data.posts || []);
      } catch (err) {
        console.log("Unable to load posts");
      }
    };

    fetchProfile();
    fetchUserPosts();
  }, [id]);

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
              <p className="text-red-400/80 italic">GitHub not added.</p>
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
              <p className="text-red-400/80 italic">LinkedIn not added.</p>
            )}

            {devProfile.skills?.length > 0 ? (
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
              <p className="text-red-400/80 italic">No skills added.</p>
            )}
          </div>
        </div>
      </div>

      <section className="max-w-4xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-8">
          {devProfile.username}'s Posts
        </h2>

        {userPosts.length === 0 ? (
          <p className="text-center text-gray-400 italic">
            This developer hasn't posted anything yet.
          </p>
        ) : (
          <div className="space-y-8">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {post.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {post.content}
                </p>

                {post.image && (
                  <img
                    src={post.image}
                    alt="post-img"
                    className="w-full rounded-xl max-h-80 object-cover border border-cyan-400/30 shadow-md"
                  />
                )}

                <p className="text-gray-500 text-xs mt-3">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default DeveloperProfile;
