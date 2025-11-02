import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] overflow-hidden">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
