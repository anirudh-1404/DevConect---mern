import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-10 px-6 text-center text-gray-400 bg-midnight-black">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-midnight-blue to-midnight-violet bg-clip-text text-transparent mb-4">
        DevConnect
      </h3>

      <div className="flex justify-center gap-6 mb-4 text-sm font-medium">
        <Link to="/" className="hover:text-midnight-blue transition">
          Home
        </Link>
        <Link to="/about" className="hover:text-midnight-blue transition">
          About
        </Link>
        <Link to="/developers" className="hover:text-midnight-blue transition">
          Developers
        </Link>
        <Link to="/recruiters" className="hover:text-midnight-blue transition">
          Recruiters
        </Link>
        <Link to="/community" className="hover:text-midnight-blue transition">
          Community
        </Link>
      </div>

      <p className="text-xs text-gray-500">
        © {new Date().getFullYear()} DevConnect. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
