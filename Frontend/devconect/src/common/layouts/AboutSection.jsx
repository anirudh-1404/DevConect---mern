import React from "react";
import { Code2, Users, Rocket, Network } from "lucide-react";

const AboutSection = () => {
  return (
    <>
      {}
      <section className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {}
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center md:justify-start gap-3">
              <Code2 className="text-cyan-400 w-9 h-9" />
              What is DevConnect?
            </h2>
            <div className="w-24 h-[3px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto md:mx-0"></div>
          </div>

          {}
          <div className="text-gray-300 text-lg leading-relaxed text-center md:text-left">
            <p className="backdrop-blur-md bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10 hover:border-cyan-400/30 transition duration-300">
              DevConnect is a platform designed{" "}
              <span className="text-cyan-400 font-semibold">
                by developers, for developers.
              </span>
              It helps coders discover peers, showcase projects, and collaborate
              in real-time. Whether you're exploring your first repo or leading
              a startup team, DevConnect bridges innovation with community —
              your code, your network, your growth.
            </p>
          </div>
        </div>
      </section>

      {}
      <section className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {}
          <div className="text-gray-300 text-lg leading-relaxed text-center md:text-left">
            <p className="backdrop-blur-md bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10 hover:border-cyan-400/30 transition duration-300">
              DevConnect provides a single space where{" "}
              <span className="text-cyan-400 font-semibold">
                developers build, learn, and grow together.
              </span>
              It promotes collaboration through open-source discussions, live
              project showcases, and technical communities — empowering every
              developer to innovate, contribute, and connect with like-minded
              professionals globally.
            </p>
          </div>

          {}
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center md:justify-start gap-3">
              <Rocket className="text-blue-400 w-9 h-9" />
              Why Choose DevConnect?
            </h2>
            <div className="w-24 h-[3px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mx-auto md:mx-0"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
