import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import registerAnim from "../../../Lottie/registerAnim.json";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    role: "Developer",
    avatar: null,
    linkedin: "",
    github: "",
    skills: [],
    company: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast.success("Already logged in!");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const registerFunction = async () => {
    try {
      setLoading(true);

      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("bio", formData.bio);
      form.append("role", formData.role);
      form.append("linkedin", formData.linkedin);
      form.append("github", formData.github);
      form.append("company", formData.company);
      form.append("skills", JSON.stringify(formData.skills));

      if (formData.avatar) {
        form.append("avatar", formData.avatar);
      }

      const response = await API.post("/auth/register", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success(response.data.message || "User Registered Successfully!");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
      console.log("Register Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmission = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required!";
    if (!formData.email.trim()) newErrors.email = "Email is required!";
    if (!formData.password.trim()) newErrors.password = "Password is required!";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required!";

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    registerFunction();

    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
      role: "Developer",
      avatar: null,
      linkedin: "",
      github: "",
      company: "",
      skills: [],
    });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !formData.skills.includes(value)) {
        setFormData({
          ...formData,
          skills: [...formData.skills, value],
        });
      }
      e.target.value = "";
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
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

        <div className="hidden lg:flex flex-col items-center justify-center space-y-4 p-4 border-r border-white/10">
          <Lottie
            animationData={registerAnim}
            loop
            className="w-full max-w-lg opacity-90 transition-opacity duration-500 hover:opacity-100"
          />
          <p className="text-xl font-semibold text-midnight-blue text-center mt-4">
            Join the Next-Gen Tech Community.
          </p>
        </div>


        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet tracking-tight">
            Register for <span className="text-white">DevConnect</span>
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed border-l-4 border-midnight-blue pl-3 py-1">
            Build your profile, collaborate on projects, and find your next
            opportunity.
          </p>

          <form className="space-y-6" onSubmit={handleSubmission}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                    focus:border-midnight-blue focus:ring-1 focus:ring-midnight-blue outline-none transition duration-300`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>


              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  placeholder="John_Doe_Dev"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-midnight-gray/50 text-white border 
                    ${errors.username
                      ? "border-red-500 ring-red-500"
                      : "border-white/10 hover:border-midnight-blue/50"
                    } 
                    focus:border-midnight-blue focus:ring-1 focus:ring-midnight-blue outline-none transition duration-300`}
                />
                {errors.username && (
                  <p className="text-red-400 text-xs mt-1">{errors.username}</p>
                )}
              </div>
            </div>


            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                Company Name (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                placeholder="e.g. Google, Startup Inc."
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-midnight-gray/50 text-white border border-white/10 hover:border-midnight-blue/50 focus:border-midnight-blue focus:ring-1 focus:ring-midnight-blue outline-none transition duration-300"
              />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                    focus:border-midnight-blue focus:ring-1 focus:ring-midnight-blue outline-none transition duration-300`}
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


              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    placeholder="••••••••"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-midnight-gray/50 text-white border
                    ${errors.confirmPassword
                        ? "border-red-500 ring-red-500"
                        : "border-white/10 hover:border-midnight-blue/50"
                      }
                    focus:border-midnight-blue focus:ring-1 focus:ring-midnight-blue outline-none transition duration-300`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-midnight-blue transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>


            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                Professional Bio (Optional)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                placeholder="Ex: Full-stack developer specializing in MERN stack, open to collaboration."
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-midnight-gray/50 text-white border border-white/10 hover:border-midnight-blue/50 focus:border-midnight-blue focus:ring-1 focus:ring-midnight-blue outline-none transition duration-300 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                Linkedin URL (optional)
              </label>
              <textarea
                name="linkedin"
                value={formData.linkedin}
                placeholder="Your Linkedin Profile URL"
                onChange={handleChange}
                rows={1}
                className="w-full px-4 py-3 rounded-lg bg-midnight-gray/50 text-white border border-white/10 hover:border-midnight-blue/50 focus:border-midnight-blue focus:ring-1 focus:ring-midnight-blue outline-none transition duration-300 resize-none"
              />
            </div>


            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                GitHub URL (optional)
              </label>
              <textarea
                name="github"
                value={formData.github}
                placeholder="Your GitHub Profile URL"
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-midnight-gray/50 text-white border border-white/10 hover:border-midnight-blue/50 focus:border-midnight-blue focus:ring-1 focus:ring-midnight-blue outline-none transition duration-300 resize-none"
              />
            </div>


            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Your Skills (add multiple)
              </label>

              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-midnight-blue/20 text-midnight-blue text-sm rounded-full flex items-center gap-2 border border-midnight-blue/40"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                placeholder="Type a skill & press Enter"
                onKeyDown={handleSkillKeyDown}
                className="w-full px-4 py-3 rounded-lg bg-midnight-gray/50 text-white border 
    border-white/10 hover:border-midnight-blue/50 focus:border-midnight-blue 
    focus:ring-1 focus:ring-midnight-blue outline-none transition duration-300"
              />
            </div>



            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Your Role
              </label>
              <div className="flex gap-4">
                {["Developer", "Recruiter"].map((r) => (
                  <label
                    key={r}
                    className={`cursor-pointer px-4 py-2 rounded-full border text-sm font-medium transition ${formData.role === r
                      ? "border-midnight-blue text-midnight-blue bg-midnight-blue/20 shadow-md shadow-midnight-blue/40"
                      : "border-white/10 text-gray-400 hover:border-gray-500"
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
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                Profile Avatar (Image)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-lg bg-midnight-gray/50 text-white border border-white/10 hover:border-midnight-blue/50 focus:border-midnight-blue focus:ring-1 focus:ring-midnight-blue outline-none transition duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-midnight-blue/10 file:text-midnight-blue hover:file:bg-midnight-blue/20"
              />
            </div>


            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="cursor-pointer w-full mt-8 py-3 rounded-lg bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-bold text-lg shadow-lg shadow-midnight-blue/20 hover:shadow-midnight-blue/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <RingLoader size={25} color="white" /> : "Create Account"}
            </motion.button>


            <p className="text-center text-gray-500 text-sm pt-2">
              Already have an account?
              <a
                href="/login"
                className="text-midnight-blue hover:text-blue-400 font-semibold ml-1 transition duration-300"
              >
                Log In Here
              </a>
            </p>
          </form>

        </div>
      </motion.div >
    </div >
  );
};

export default Register;
