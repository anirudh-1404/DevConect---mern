import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

import loginAnim from "../../../Lottie/loginAnim.json";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast.success("User already logged in!");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const loginFunction = async (data) => {
    try {
      const response = await API.post("/auth/login", data);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      if (response.status === 200) {
        toast.success(response.data.message || "Login Successful!");
        navigate("/");
      }

      console.log(response);
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
      console.log("Error", err.message);
    }
  };

  const handleSubmission = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required!";
    if (!formData.password.trim()) newErrors.password = "Password is required!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    loginFunction(formData);

    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid grid-cols-2 rounded-3xl p-10 mx-10 md:mx-40 my-20 backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] drop-shadow-lg h-[40rem] w-full max-w-7xl border border-cyan-400/30">
        {/* LEFT SIDE IMAGE (for future Lottie or 3D avatar) */}
        <div className="flex justify-center items-center text-white text-2xl font-semibold">
          <Lottie animationData={loginAnim} loop={true} />
        </div>

        {/* RIGHT SIDE FORM */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white flex flex-col justify-center px-8"
        >
          {/* Heading */}
          <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Welcome Back, Creator 👋
          </h2>
          <p className="text-gray-400 mb-8 text-sm tracking-widest">
            Continue your journey — connect, collaborate, and build with the
            DevConnect community.
          </p>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmission}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="you@example.com"
                className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition-all duration-300 ${
                  errors.email
                    ? "border-red-500 focus:border-red-400 focus:ring-red-400/40"
                    : "border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/40"
                } focus:ring-2 outline-none transition-all duration-300`}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={formData.password}
                name="password"
                className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition-all duration-300 ${
                  errors.password
                    ? "border-red-500 focus:border-red-400 focus:ring-red-400/40"
                    : "border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/40"
                } focus:ring-2 outline-none transition-all duration-300`}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-300"
            >
              Login
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-400 text-sm mt-4">
              Don’t have an account?
              <a
                href="/register"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Create one now
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
