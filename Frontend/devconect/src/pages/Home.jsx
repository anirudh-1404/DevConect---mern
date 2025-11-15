import Hero from "@/common/layouts/Hero";
import ExploreSection from "@/common/layouts/ExploreSection";
import React from "react";
import AboutSection from "@/common/layouts/AboutSection";
import MissionSection from "@/common/layouts/MissionSection";
import DevelopersSection from "@/common/layouts/DevelopersSection";
import RecruitersSection from "@/common/layouts/RecruitersSection";
import TestimonialsSection from "@/common/layouts/TestimonialsSection";

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <ExploreSection />
      <AboutSection />
      <DevelopersSection />
      <RecruitersSection />
      <TestimonialsSection />
      <MissionSection />
    </div>
  );
};

export default Home;
