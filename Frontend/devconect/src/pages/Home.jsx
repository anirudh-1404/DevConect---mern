import Hero from "@/common/layouts/Hero";
import ExploreSection from "@/common/layouts/ExploreSection";
import React from "react";
import AboutSection from "@/common/layouts/AboutSection";

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <ExploreSection />
      <AboutSection />
    </div>
  );
};

export default Home;
