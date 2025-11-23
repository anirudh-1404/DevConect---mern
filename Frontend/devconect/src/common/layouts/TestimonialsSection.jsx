import React from "react";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rohit Kumar",
    role: "Full Stack Developer",
    message:
      "DevConnect helped me find a dream internship and meet mentors who genuinely care about growth.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit",
  },
  {
    name: "Neha Sharma",
    role: "Tech Recruiter",
    message:
      "Finding skilled developers has never been easier — DevConnect bridges talent and opportunity beautifully.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
  },
  {
    name: "Arjun Mehta",
    role: "Frontend Engineer",
    message:
      "The community is supportive and inspiring. DevConnect feels like home for developers.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
  },
  {
    name: "Priya Singh",
    role: "Backend Developer",
    message:
      "I found my co-founder here! The collaborative coding sessions are a game changer.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  },
  {
    name: "Vikram Malhotra",
    role: "DevOps Engineer",
    message:
      "The best platform to showcase your skills and get noticed by top tech companies.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
  },
];

const TestimonialCard = ({ t }) => (
  <div className="min-w-[350px] bg-midnight-gray/50 border border-white/5 backdrop-blur-xl p-8 rounded-3xl mx-4 hover:border-midnight-blue/30 transition-all duration-300 group">
    <div className="flex items-center gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
      ))}
    </div>
    <p className="text-gray-300 mb-6 leading-relaxed">"{t.message}"</p>
    <div className="flex items-center gap-4">
      <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-white/10" />
      <div>
        <h4 className="text-white font-semibold group-hover:text-midnight-blue transition-colors">{t.name}</h4>
        <p className="text-gray-500 text-sm">{t.role}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-midnight-black overflow-hidden relative">
      { }
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-midnight-blue/5 rounded-full blur-[120px]" />
      </div>

      <div className="text-center mb-16 relative z-10 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-white mb-6"
        >
          Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet">Developers</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Join thousands of developers who are building their future with DevConnect.
        </motion.p>
      </div>

      { }
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
        <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap py-4">
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={`clone-${i}`} t={t} />
          ))}
        </div>

        { }
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-midnight-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-midnight-black to-transparent z-10" />
      </div>
    </section>
  );
};

export default TestimonialsSection;
