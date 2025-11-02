import React, { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import registerAnim from "../../../Lottie/registerAnim.json";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { RingLoader } from "react-spinners";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });

  const [errors, setErrors] = useState({}); // store field-wise errors
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error as user types
  };

  const registerFunction = async (data) => {
    try {
      setLoading(true);
      const response = await API.post("/auth/register", data);
      if (response.status === 201) {
        toast.success(response.data.message || "User created successfully!");
        navigate("/login");
      }
      console.log(response);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
      console.log("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmission = (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validation checks
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // if errors exist, stop form
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    registerFunction(formData);

    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid grid-cols-2 rounded-3xl p-10 mx-10 md:mx-40 my-10 backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] drop-shadow-lg h-[55rem] w-full max-w-9xl border border-cyan-400/30">
        <div className="flex justify-center items-center text-white text-2xl font-semibold">
          <Lottie animationData={registerAnim} loop={true} />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white flex flex-col justify-center px-8"
        >
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Become a Part of the Developer Community
          </h2>
          <p className="text-gray-400 mb-6 mt-2 text-sm tracking-widest">
            Show the world what you can build. Collaborate. Create. Connect.
          </p>

          <form className="space-y-5" onSubmit={handleSubmission}>
            <div>
              <label htmlFor="email" className="text-sm text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                name="email"
                placeholder="JohnDoe@hotmail.com"
                className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border ${
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

            {/* Username */}
            <div>
              <label htmlFor="username" className="text-sm text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                placeholder="John Doe"
                className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border ${
                  errors.username
                    ? "border-red-500 focus:border-red-400 focus:ring-red-400/40"
                    : "border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/40"
                } focus:ring-2 outline-none transition-all duration-300`}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
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
                name="password"
                value={formData.password}
                placeholder="••••••••"
                className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border ${
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm text-gray-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="••••••••"
                className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-400 focus:ring-red-400/40"
                    : "border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/40"
                } focus:ring-2 outline-none transition-all duration-300`}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="text-sm text-gray-300">
                Add your bio
              </label>
              <input
                type="text"
                id="bio"
                name="bio"
                value={formData.bio}
                placeholder="Short words about yourself!"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border"
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-300"
            >
              {loading ? <RingLoader size={20} /> : "Continue"}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-400 text-sm mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Login here
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
