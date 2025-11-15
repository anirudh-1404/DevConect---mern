import React from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rohit Kumar",
    role: "Full Stack Developer",
    message:
      "DevConnect helped me find a dream internship and meet mentors who genuinely care about growth.",
  },
  {
    name: "Neha Sharma",
    role: "Tech Recruiter, CodeAlpha",
    message:
      "Finding skilled developers has never been easier — DevConnect bridges talent and opportunity beautifully.",
  },
  {
    name: "Arjun Mehta",
    role: "Frontend Engineer",
    message:
      "The community is supportive and inspiring. DevConnect feels like home for developers.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-10">
        What Our Community Says
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white/10 border border-white/10 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:scale-105 transition-all duration-300"
          >
            <Quote className="text-cyan-400 w-8 h-8 mx-auto mb-3" />
            <p className="text-gray-300 italic mb-4">“{t.message}”</p>
            <h4 className="text-white font-semibold">{t.name}</h4>
            <p className="text-cyan-400 text-sm">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
