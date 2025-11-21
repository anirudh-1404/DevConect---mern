import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Users,
  Globe,
  Sparkles,
  Rocket,
  Heart,
  Target,
  Zap,
  Linkedin,
  Twitter,
  Github,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Zap,
      title: "Innovation",
      desc: "Pushing boundaries with cutting-edge technologies and creative solutions.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Users,
      title: "Collaboration",
      desc: "Fostering a global community where teamwork drives success.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Target,
      title: "Growth",
      desc: "Empowering continuous learning and professional development.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Heart,
      title: "Passion",
      desc: "Driven by a genuine love for code and community building.",
      color: "from-pink-400 to-rose-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-x-hidden">

      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Developers</span>
              <br />
              Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Innovators</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              DevConnect bridges the gap between talent and opportunity, creating a ecosystem where developers thrive and innovation knows no bounds.
            </p>
          </motion.div>
        </div>
      </section>


      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold">
                Our Mission <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Shaping the Future
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                At DevConnect, we believe that every line of code has the potential to change the world. Our mission is to democratize access to opportunities in tech, making it easier for developers to showcase their skills and for companies to find the perfect talent.
              </p>
              <div className="flex gap-4">
                <div className="pl-4 border-l-2 border-cyan-500">
                  <h4 className="text-white font-semibold mb-1">For Developers</h4>
                  <p className="text-sm text-gray-400">Showcase work, find peers, get hired.</p>
                </div>
                <div className="pl-4 border-l-2 border-purple-500">
                  <h4 className="text-white font-semibold mb-1">For Recruiters</h4>
                  <p className="text-sm text-gray-400">Discover talent, verify skills, hire fast.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-2xl opacity-20" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="h-32 bg-white/5 rounded-lg animate-pulse" />
                    <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
                    <div className="h-32 bg-white/5 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      <section className="py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do at DevConnect.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-[#0B1120] border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${value.color} p-0.5 mb-6`}>
                  <div className="w-full h-full bg-[#0B1120] rounded-[7px] flex items-center justify-center">
                    <value.icon size={20} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-xl opacity-50" />
            <img
              src="src/assets/profile_picture.jpeg"
              alt="Anirudh Joshi"
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0B1120] object-cover mx-auto mb-8"
            />
          </motion.div>

          <h2 className="text-3xl font-bold mb-2">Anirudh Joshi</h2>
          <p className="text-cyan-400 font-medium mb-6">Founder & CEO</p>

          <blockquote className="text-xl md:text-2xl text-gray-300 font-light italic mb-8 leading-relaxed">
            "I started DevConnect to create a platform where developers and recruiters can connect, collaborate, and grow together — shaping the future of tech."
          </blockquote>

          <div className="flex justify-center gap-4">
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </section>


      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-16 text-center">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
              Join thousands of developers and recruiters who are already building the future together.
            </p>
            <Link to="/register">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Join DevConnect Now
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
