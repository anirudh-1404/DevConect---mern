import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Lottie from "lottie-react";
import Globe from "../../../Lottie/Globe.json";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* 🌈 Background Animated Blob */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-xl opacity-10 backdrop-blur-lg"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto px-6 py-24 items-center gap-10 relative z-10">
        {/* 🟦 LEFT SIDE — Text Section */}
        <div className="text-white space-y-6">
          <motion.h4
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-cyan-400 uppercase text-sm tracking-widest"
          >
            Your Developer Hub
          </motion.h4>

          <motion.h1
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
          >
            Connect. Collaborate. Create.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg text-gray-300 max-w-md leading-relaxed mt-4"
          >
            A vibrant network for developers to showcase skills, build projects,
            and grow together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="cta-btn flex items-center gap-4 mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-2"
            >
              Join Now <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl border border-cyan-400 text-cyan-300 font-semibold backdrop-blur-sm hover:bg-cyan-400/10 transition-all duration-300"
            >
              Explore
            </motion.button>
          </motion.div>
        </div>

        {/* 🟩 RIGHT SIDE — Lottie Animation with Float */}
        <motion.div className="flex justify-center items-center">
          <motion.div
            className="w-[90%] md:w-[28rem] lg:w-[40rem] p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] drop-shadow-xl transition-transform duration-300 ease-out"
            initial={{ opacity: 0, x: 100 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1,
              delay: 1,
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <Lottie animationData={Globe} loop={true} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
