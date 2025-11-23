import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-midnight-black overflow-hidden">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
