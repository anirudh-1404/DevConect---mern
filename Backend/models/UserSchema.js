import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Developer", "Recruiter"],
      default: "Developer",
    },
    skills: {
      type: [String],
      default: [],
    },
    github: {
      type: "String",
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
