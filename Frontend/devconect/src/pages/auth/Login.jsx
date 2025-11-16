import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

import loginAnim from "../../../Lottie/loginAnim.json";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
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
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setIsAuthenticated(true);

      toast.success(response.data.message || "Login Successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-cyan-400/20 shadow-[0_0_40px_rgba(6,182,212,0.15)] rounded-3xl p-10">
        <div className="hidden md:flex justify-center items-center">
          <Lottie
            animationData={loginAnim}
            loop={true}
            className="w-80 opacity-90"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-center text-white"
        >
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Welcome Back 👋
          </h2>
          <p className="text-gray-400 text-sm mt-2 mb-10">
            Continue your journey — collaborate & grow with the DevConnect
            community.
          </p>

          <form className="space-y-5" onSubmit={handleSubmission}>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="you@example.com"
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 text-white 
                placeholder-gray-400 border
                ${errors.email ? "border-red-400" : "border-white/20"}
                focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="••••••••"
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 text-white 
                placeholder-gray-400 border
                ${errors.password ? "border-red-400" : "border-white/20"}
                focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition`}
              />
              {errors.password && (
                <p className="text-red-400 text-xs">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold
              hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            New to DevConnect?{" "}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
