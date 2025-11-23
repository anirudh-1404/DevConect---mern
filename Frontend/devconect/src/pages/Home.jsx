import React from "react";
import Hero from "@/common/layouts/Hero";
import ExploreSection from "@/common/layouts/ExploreSection";
import TestimonialsSection from "@/common/layouts/TestimonialsSection";
import { Code2, Cpu, Globe, Layers, Zap } from "lucide-react";

const TrustedBy = () => (
  <div className="py-10 border-y border-white/5 bg-midnight-black/50 backdrop-blur-sm">
    <p className="text-center text-gray-500 text-sm font-medium tracking-widest uppercase mb-8">Trusted by innovative teams</p>
    <div className="flex justify-center gap-12 md:gap-24 flex-wrap px-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
      {[
        { name: "TechCorp", icon: <Cpu className="w-8 h-8" /> },
        { name: "DevStudio", icon: <Code2 className="w-8 h-8" /> },
        { name: "GlobalNet", icon: <Globe className="w-8 h-8" /> },
        { name: "StackSystems", icon: <Layers className="w-8 h-8" /> },
        { name: "FastTrack", icon: <Zap className="w-8 h-8" /> },
      ].map((brand, i) => (
        <div key={i} className="flex items-center gap-2 group cursor-default">
          <span className="text-white group-hover:text-midnight-blue transition-colors">{brand.icon}</span>
          <span className="text-xl font-bold text-white/80 group-hover:text-white transition-colors">{brand.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="bg-midnight-black min-h-screen selection:bg-midnight-blue/30">
      <Hero />
      <TrustedBy />
      <ExploreSection />
      <TestimonialsSection />

      { }
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-black to-midnight-blue/10 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to start your journey?</h2>
          <p className="text-gray-400 text-lg mb-10">Join the fastest growing developer community today.</p>
          <a href="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-midnight-blue to-midnight-violet rounded-xl hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
            Join DevConnect Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
