import React, { useEffect, useState } from "react";
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
    role: "Developer",
    avatar: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast.success("User already logged in!");
      navigate("/");
    }
  }, [navigate]);

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
      avatar: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-3xl p-10 mx-4 md:mx-20 my-10 backdrop-blur-xl bg-white/5 shadow-[0_0_40px_rgba(6,182,212,0.25)] border border-cyan-400/20 w-full max-w-6xl">
        <div className="flex justify-center items-center hidden md:flex">
          <Lottie
            animationData={registerAnim}
            loop={true}
            className="w-96 opacity-90"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white flex flex-col justify-center space-y-6"
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Create Your DevConnect Account
          </h2>
          <p className="text-gray-400 text-sm">
            Connect, collaborate & grow with the developer community. 🎯
          </p>

          <form className="space-y-4" onSubmit={handleSubmission}>
            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-cyan-400 focus:ring-2 outline-none"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-cyan-400 focus:ring-2 outline-none"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                placeholder="Tell something about yourself..."
                className="w-full min-h-[80px] px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-cyan-400 focus:ring-2 outline-none resize-none"
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label className="text-sm text-gray-300">Avatar</label>
              <div className="mt-2 border border-white/20 bg-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-cyan-400 transition">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full cursor-pointer"
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.files[0] })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              {["Developer", "Recruiter"].map((r) => (
                <label
                  key={r}
                  className={`cursor-pointer px-4 py-2 rounded-full border text-sm transition ${
                    formData.role === r
                      ? "border-cyan-500 text-cyan-300 bg-white/10"
                      : "border-white/20 text-gray-400 hover:border-cyan-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={formData.role === r}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {r}
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 transition text-white font-semibold"
            >
              {loading ? (
                <RingLoader size={22} color="white" />
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-gray-400 text-sm pt-2">
              Already a member?{" "}
              <a href="/login" className="text-cyan-400 hover:text-cyan-300">
                Login
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
