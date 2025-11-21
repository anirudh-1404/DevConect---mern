import API from "@/API/Interceptor";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const RecruitersProfile = () => {
  const [recruiter, setRecruiter] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [likedBy, setLikedBy] = useState([]);
  const [likesModal, setLikesModal] = useState(false);

  const [followersModal, setFollowersModal] = useState(false);
  const [followingModal, setFollowingModal] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const res = await API.get(`/recruiters/${id}`);
        const data = res.data.recruiter;

        setRecruiter(data);

        setFollowersCount(data.followers?.length || 0);
        if (data.followers?.some((u) => u._id === localUser.id)) {
          setIsFollowing(true);
        }
      } catch (err) {
        console.log("Unable to fetch recruiter");
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

    const trackView = async () => {
      try {
        if (id !== localUser.id) {
          await API.post(`/analytics/profile-view/${id}`);
        }
      } catch (err) {
        console.log("Unable to track profile view");
      }
    };

    fetchRecruiter();
    fetchRecruiterPosts();
    trackView();
  }, [id]);

  const handleFollow = async () => {
    try {
      const res = await API.post(`/auth/follow/${id}`);
      toast.success(res.data.message);

      setIsFollowing(res.data.isFollowing);
      setFollowersCount(res.data.followersCount);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (!recruiter) {
    return (
      <section className="min-h-screen flex justify-center items-center text-white">
        Loading profile...
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] text-white py-20 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12">
        <div className="flex justify-center w-full md:w-1/3">
          <img
            src={recruiter.avatar || "https://github.com/shadcn.png"}
            alt="recruiter"
            className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl border-2 border-pink-400 shadow-[0_0_40px_rgba(236,72,153,0.4)]"
          />
        </div>

        <div className="w-full md:w-2/3 space-y-5">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text tracking-wide">
            {recruiter.username}{" "}
            <span className="text-sm text-gray-400">(Recruiter)</span>
          </h1>

          <div className="flex items-center gap-6 text-gray-300 text-sm">
            <p
              onClick={() => setFollowersModal(true)}
              className="hover:text-pink-300 transition cursor-pointer"
            >
              Followers: <span className="text-pink-400">{followersCount}</span>
            </p>

            <p
              onClick={() => setFollowingModal(true)}
              className="hover:text-pink-300 transition cursor-pointer"
            >
              Following:{" "}
              <span className="text-pink-400">
                {recruiter.following?.length || 0}
              </span>
            </p>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed italic">
            {recruiter.bio || "This recruiter hasn't added a bio yet."}
          </p>

          <div className="space-y-2 text-gray-400 text-sm">
            <p>
              <span className="text-pink-400 font-medium">Email:</span>{" "}
              {recruiter.email}
            </p>

            {recruiter.github ? (
              <p>
                <span className="text-pink-400 font-medium">GitHub:</span>{" "}
                <a
                  href={recruiter.github}
                  target="_blank"
                  className="text-pink-300 hover:underline"
                >
                  {recruiter.github}
                </a>
              </p>
            ) : (
              <p className="text-red-400/80 italic">GitHub not added.</p>
            )}

            {recruiter.linkedin ? (
              <p>
                <span className="text-pink-400 font-medium">LinkedIn:</span>{" "}
                <a
                  href={recruiter.linkedin}
                  target="_blank"
                  className="text-pink-300 hover:underline"
                >
                  {recruiter.linkedin}
                </a>
              </p>
            ) : (
              <p className="text-red-400/80 italic">LinkedIn not added.</p>
            )}
            {recruiter.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {recruiter.skills.map((skill, i) => (
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

          {localUser.id !== recruiter._id && (
            <div className="flex gap-4">
              <button
                onClick={handleFollow}
                className={`px-7 py-2.5 rounded-full font-medium text-white transition-all cursor-pointer 
                bg-gradient-to-r from-pink-400 to-purple-600
                hover:scale-[1.05] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)]
              `}
              >
                {isFollowing ? "Following ✓" : "Follow +"}
              </button>
              <button
                onClick={() => navigate(`/messages?userId=${recruiter._id}`)}
                className={`px-7 py-2.5 rounded-full font-medium text-white transition-all cursor-pointer 
                bg-gradient-to-r from-gray-700 to-gray-900 border border-gray-600
                hover:scale-[1.05] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
              `}
              >
                Message
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="max-w-4xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent mb-8">
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
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_15px_rgba(236,72,153,0.25)]"
              >
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-3 flex">
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {post.content}
                </p>

                {post.image && (
                  <img
                    src={post.image}
                    alt="post-img"
                    className="w-full rounded-xl max-h-80 object-cover border border-pink-400/30 shadow-md"
                  />
                )}

                <button
                  onClick={() => {
                    setLikedBy(post.likes || []);
                    setLikesModal(true);
                  }}
                  className="text-gray-400 hover:text-pink-300 transition text-lg mt-2"
                >
                  &hearts; {post.likes?.length || 0}
                </button>
              </div>
            ))}
          </div>
        )}

        {followersModal && (
          <Modal
            title="Followers"
            data={recruiter.followers}
            onClose={() => setFollowersModal(false)}
          />
        )}

        {followingModal && (
          <Modal
            title="Following"
            data={recruiter.following}
            onClose={() => setFollowingModal(false)}
          />
        )}

        {likesModal && (
          <Modal
            title="Liked By"
            data={likedBy}
            onClose={() => setLikesModal(false)}
          />
        )}
      </section>
    </section>
  );
};

const Modal = ({ title, data, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
    <div className="bg-[#0f172a] border border-pink-400/30 rounded-2xl p-6 w-96 text-white shadow-[0_0_25px_rgba(236,72,153,0.4)] relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-400 hover:text-pink-400 text-xl"
      >
        ✕
      </button>

      <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text mb-4">
        {title}
      </h3>

      {!data || data.length === 0 ? (
        <p className="text-gray-400 text-center italic">No data found.</p>
      ) : (
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {data.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition"
            >
              <img
                src={user.avatar || "https://github.com/shadcn.png"}
                className="w-10 h-10 rounded-full border border-pink-400"
              />
              <p className="text-sm font-medium">{user.username}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default RecruitersProfile;
