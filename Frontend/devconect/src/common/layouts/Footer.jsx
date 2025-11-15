import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-10 px-6 text-center text-gray-400 bg-[#0f2027]/70">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-4">
        DevConnect
      </h3>

      <div className="flex justify-center gap-6 mb-4 text-sm font-medium">
        <Link to="/" className="hover:text-cyan-400 transition">
          Home
        </Link>
        <Link to="/about" className="hover:text-cyan-400 transition">
          About
        </Link>
        <Link to="/developers" className="hover:text-cyan-400 transition">
          Developers
        </Link>
        <Link to="/recruiters" className="hover:text-cyan-400 transition">
          Recruiters
        </Link>
        <Link to="/community" className="hover:text-cyan-400 transition">
          Community
        </Link>
      </div>

      <p className="text-xs text-gray-800">
        © {new Date().getFullYear()} DevConnect. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
