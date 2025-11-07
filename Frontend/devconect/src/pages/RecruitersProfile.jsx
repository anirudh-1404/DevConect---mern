import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RecruitersProfile = () => {
  const [recruiter, setRecruiter] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const response = await API.get(`/recruiters/${id}`);
        setRecruiter(response.data.recruiter);
      } catch (err) {
        console.log("Unable to fetch recruiter", err.message);
      }
    };

    const fetchRecruiterPosts = async () => {
      try {
        const res = await API.get(`/post/user/${id}`);
        setUserPosts(res.data.posts || []);
      } catch (err) {
        console.log("Unable to load recruiter posts");
      }
    };

    fetchRecruiter();
    fetchRecruiterPosts();
  }, [id]);

  if (!recruiter) {
    return (
      <section className="min-h-screen flex justify-center items-center text-white">
        Loading profile...
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <img
          src={recruiter.avatar || "https://github.com/shadcn.png"}
          className="w-40 h-40 rounded-full border-2 border-cyan-400 mx-auto shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          alt="recruiter"
        />

        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          {recruiter.username}
        </h1>

        <p className="text-gray-300 italic max-w-xl mx-auto">
          {recruiter.bio || "No bio added yet."}
        </p>

        <p className="text-gray-400">
          <span className="text-cyan-400">Email:</span> {recruiter.email}
        </p>

        <button className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:scale-105 transition-all font-medium">
          Contact Recruiter
        </button>
      </div>

      <section className="max-w-4xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-8">
          {recruiter.username}'s Posts
        </h2>

        {userPosts.length === 0 ? (
          <p className="text-center text-gray-400 italic">
            This recruiter hasn't posted anything yet.
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

export default RecruitersProfile;
