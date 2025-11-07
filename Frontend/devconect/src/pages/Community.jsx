import API from "@/API/Interceptor";
import { Item } from "@radix-ui/react-dropdown-menu";
import { all } from "axios";
import React, { useEffect, useState } from "react";

const Community = () => {
  const [allPosts, setAllPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await API.get("/post");
      setAllPosts(response.data.allPosts);
    } catch (err) {
      console.log("Unable to fetch community posts!", err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] px-6 py-12 text-white">
      <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text tracking-wide mb-16">
        DevConnect Community Feed
      </h1>

      <section className="max-w-3xl mx-auto space-y-8">
        {allPosts.map((item) => (
          <div
            key={item._id}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all duration-300"
          >
            {/* AUTHOR INFO */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={item?.author?.avatar || "https://github.com/shadcn.png"}
                alt="author-avatar"
                className="w-12 h-12 rounded-full border border-cyan-400"
              />

              <div>
                <h3 className="font-semibold text-lg">
                  {item?.author?.username}
                </h3>
                <p className="text-gray-400 text-xs">
                  Posted on {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* POST TITLE */}
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>

            {/* POST CONTENT */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {item.content}
            </p>

            {/* POST IMAGE (Optional) */}
            {item.image && (
              <img
                src={item.image}
                alt="post-img"
                className="w-full rounded-xl max-h-80 object-cover border border-cyan-400/30 shadow-md"
              />
            )}
          </div>
        ))}
      </section>
    </main>
  );
};

export default Community;
