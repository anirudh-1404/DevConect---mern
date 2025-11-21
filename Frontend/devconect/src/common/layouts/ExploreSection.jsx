import React from "react";
import { Users, MessageSquare, Upload, Briefcase, ArrowUpRight, Code2, Terminal, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BentoCard = ({ title, description, icon, className, to, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`relative group overflow-hidden rounded-3xl bg-gray-900/50 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 ${className}`}
  >
    <Link to={to} className="block h-full p-8">
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowUpRight className="w-6 h-6 text-cyan-400" />
      </div>

      <div className="h-full flex flex-col justify-between relative z-10">
        <div className="mb-6 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
          {icon}
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  </motion.div>
);

export default function ExploreSection() {
  return (
    <section className="py-24 px-6 bg-[#020617] relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Ecosystem</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Everything you need to accelerate your developer journey, all in one place.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
          {/* Large Card - Developers */}
          <BentoCard
            to="/developers"
            title="Find Developers"
            description="Connect with thousands of talented developers. Filter by skills, experience, and availability to build your dream team."
            icon={<Users className="w-6 h-6 text-cyan-400" />}
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-gray-900/80 to-gray-900/40"
            delay={0}
          />

          {/* Medium Card - Jobs */}
          <BentoCard
            to="/jobs"
            title="Find Jobs"
            description="Browse high-quality tech jobs from top companies. Remote, hybrid, and on-site opportunities."
            icon={<Briefcase className="w-6 h-6 text-blue-400" />}
            className="md:col-span-1 md:row-span-1"
            delay={0.1}
          />

          {/* Medium Card - Community */}
          <BentoCard
            to="/community"
            title="Community"
            description="Join discussions, share knowledge, and get help from the community."
            icon={<MessageSquare className="w-6 h-6 text-purple-400" />}
            className="md:col-span-1 md:row-span-1"
            delay={0.2}
          />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <BentoCard
            to="/post/create"
            title="Share Your Work"
            description="Showcase your projects and get feedback."
            icon={<Upload className="w-6 h-6 text-green-400" />}
            className="md:col-span-1"
            delay={0.3}
          />
          <BentoCard
            to="/challenges"
            title="Coding Challenges"
            description="Sharpen your skills with daily coding problems."
            icon={<Code2 className="w-6 h-6 text-yellow-400" />}
            className="md:col-span-1"
            delay={0.4}
          />
          <BentoCard
            to="/coding-sessions"
            title="Live Coding"
            description="Pair program in real-time with peers."
            icon={<Terminal className="w-6 h-6 text-pink-400" />}
            className="md:col-span-1"
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
}
