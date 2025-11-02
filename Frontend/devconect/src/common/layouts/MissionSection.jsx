import React from "react";
import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const MissionSection = () => {
  return (
    <section className="flex flex-col items-center text-center mt-20 mb-16 px-6">
      <Code2
        size={90}
        className="text-cyan-400 mb-6 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
      />

      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-4xl sm:text-5xl font-extrabold tracking-wide max-w-3xl leading-tight">
        Empowering devs to connect, collaborate, and innovate.
      </h2>

      <p className="text-gray-300 text-lg sm:text-xl font-medium max-w-2xl mt-4">
        Join a thriving community of developers building the future together.
      </p>

      <p className="text-white text-2xl font-semibold mt-10">
        Ready to build your dev network?
      </p>
      <Link to="/register">
        <button className="mt-4 text-white bg-gradient-to-r from-cyan-400 to-blue-600 text-lg font-semibold px-10 py-4 rounded-full hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300">
          Join Now
        </button>
      </Link>
    </section>
  );
};

export default MissionSection;
