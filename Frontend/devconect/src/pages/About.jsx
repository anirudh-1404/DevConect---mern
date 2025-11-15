import Lottie from "lottie-react";
import React from "react";
import AboutAnim from "../../Lottie/AboutAnim.json";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <main className="min-h-screen px-6 md:px-14 py-8 text-white">
      <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 py-10">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text tracking-wide leading-tight">
            Empowering Developers. <br /> Connecting Innovators.
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto md:mx-0 leading-relaxed">
            DevConnect bridges the gap between developers and recruiters,
            fostering collaboration, growth, and innovation in the tech world.
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-[400px] md:max-w-[500px] drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <Lottie animationData={AboutAnim} loop={true} />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center border-t border-white/10">
        <h2 className="text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center mb-6">
          Our Mission
        </h2>
        <p className="text-gray-400 text-center max-w-4xl mx-auto leading-relaxed text-base sm:text-lg">
          At DevConnect, our mission is to empower developers by connecting them
          to real opportunities and forward-thinking recruiters. We believe in
          creating a collaborative environment where talent meets innovation.
        </p>
      </section>

      <section className="py-20 px-6 md:px-12 border-t border-white/10">
        <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12">
          Our Core Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Innovation",
              desc: "We embrace cutting-edge technologies, fresh ideas, and creative thinking to drive digital transformation.",
            },
            {
              title: "Collaboration",
              desc: "We connect developers and recruiters globally — fostering teamwork, networking, and opportunity creation.",
            },
            {
              title: "Growth",
              desc: "We inspire continuous growth through learning, challenges, and real-world opportunities that shape better developers.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-lg border border-cyan-400/20 rounded-2xl p-8 text-center 
              shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] 
              hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-cyan-400 mb-3">
                {card.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 border-t border-white/10 text-center">
        <h2 className="text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-8">
          Why Choose DevConnect?
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">
              🔗 Real Connections
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Build lasting professional relationships with top recruiters and
              developers across industries.
            </p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">
              💼 Verified Opportunities
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Access genuine job listings and internship opportunities verified
              by industry professionals.
            </p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">
              🌍 Global Reach
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Be a part of an ever-growing tech community where boundaries don't
              limit innovation.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center py-20 px-6 border-t border-white/10">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text mb-10">
          Meet Our CEO
        </h1>

        <img
          src="src/assets/profile_picture.jpeg"
          alt="Anirudh Joshi"
          className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-cyan-400 mx-auto shadow-[0_0_40px_rgba(6,182,212,0.5)] object-cover"
        />

        <h2 className="text-2xl font-semibold mt-6 text-center">
          Anirudh Joshi
        </h2>

        <p className="text-cyan-400 text-sm text-center font-medium">
          Founder & CEO, DevConnect
        </p>

        <p className="text-gray-400 text-center italic max-w-2xl mx-auto mt-4 leading-relaxed">
          "I started DevConnect to create a platform where developers and
          recruiters can connect, collaborate, and grow together — shaping the
          future of tech."
        </p>
        <div className="w-24 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 mt-8 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)]"></div>
      </section>

      <section className="py-20 text-center border-t border-white/10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text">
          Be a Part of the Revolution
        </h2>

        <p className="text-gray-400 mt-3 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg">
          Join DevConnect today and unlock limitless opportunities — collaborate
          with developers, connect with recruiters, and shape the future of
          innovation.
        </p>
        <Link to="/register">
          <button
            className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 
          text-white font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] 
          hover:scale-105 transition-all duration-300"
          >
            Join DevConnect
          </button>
        </Link>
      </section>
    </main>
  );
};

export default About;
