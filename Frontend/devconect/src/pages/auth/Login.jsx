import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-midnight-black flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          w-full max-w-7xl 
          bg-midnight-gray/80 backdrop-blur-lg 
          border border-white/10 
          rounded-2xl shadow-2xl shadow-midnight-blue/20
          p-8 md:p-12 lg:p-16
          grid grid-cols-1 lg:grid-cols-2
          gap-10 lg:gap-16
        "
      >
        { }
        <div className="hidden lg:flex flex-col items-center justify-center space-y-4 p-4 border-r border-white/10">
          <Lottie
            animationData={loginAnim}
            loop
            className="w-full max-w-lg opacity-90 transition-opacity duration-500 hover:opacity-100"
          />
          <p className="text-xl font-semibold text-midnight-blue text-center mt-4">
            Welcome back to the community.
          </p>
        </div>

        { }
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet tracking-tight">
            Login to <span className="text-white">DevConnect</span>
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed border-l-4 border-midnight-blue pl-3 py-1">
            Connect with developers and stay updated with tech trends.
          </p>

          <form className="space-y-6" onSubmit={handleSubmission}>
            { }
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="you@example.com"
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-midnight-gray/50 text-white border 
                  ${errors.email
                    ? "border-red-500 ring-red-500"
                    : "border-white/10 hover:border-midnight-blue/50"
                  }
                  focus:border-midnight-blue focus:ring-1 focus:ring-midnight-blue 
                  outline-none transition duration-300`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            { }
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="••••••••"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-lg bg-midnight-gray/50 text-white border 
                    ${errors.password
                      ? "border-red-500 ring-red-500"
                      : "border-white/10 hover:border-midnight-blue/50"
                    }
                    focus:border-midnight-blue focus:ring-1 focus:ring-midnight-blue 
                    outline-none transition duration-300`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-midnight-blue transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            { }
            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-midnight-blue to-midnight-violet text-white 
                font-bold text-lg shadow-lg shadow-midnight-blue/20 hover:shadow-midnight-blue/30 
                transition-all duration-300"
            >
              Login
            </motion.button>
          </form>

          { }
          <p className="text-center text-gray-500 text-sm pt-2">
            New here?
            <Link
              to="/register"
              className="text-midnight-blue hover:text-blue-400 font-semibold ml-1 transition duration-300"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
