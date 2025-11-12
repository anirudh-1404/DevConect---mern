import User from "../models/UserSchema.js";
import genToken from "../utils/authToken.js";
import { hashedPassword } from "../utils/hashedPassword.js";
import bcrypt from "bcrypt";

export const fetchAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    if (!users) {
      return res.status(400).json({
        message: "No users found!",
      });
    }

    res.status(200).json({
      message: "All users fetched!",
      users: users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while fetching users!",
    });
  }
};

export const registerUser = async (req, res, next) => {
  const { email, username, password, bio, avatar, role } = req.body;
  try {
    if (!email || !password || !username || !role) {
      return res.status(401).json({
        message: "All feilds are required!",
      });
    }

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      res.status(400).json({ message: "User already exists!" });
    }

    const encryptedPassword = await hashedPassword(password);
    console.log("encrypt", encryptedPassword);
    const user = await User.create({
      username,
      email,
      password: encryptedPassword,
      bio,
      avatar,
      role,
    });
    console.log(role);
    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 * 2,
    });

    res.status(201).json({
      message: "User created Successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Invalid",
    });
  }
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(401).json({
        message: "User does not exists!",
      });
    }

    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password!",
      });
    }
    const token = await genToken(userExists._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 * 2,
    });

    return res.status(200).json({
      message: "login successfull!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "login failed!",
    });
  }
};

export const fetchUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    res.status(200).json({
      avatar: userData.avatar,
      username: userData.username,
      email: userData.email,
      id: userData._id,
      bio: userData.bio,
      role: userData.role,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({
      message: "Something went wrong while fetching profile!",
    });
  }
};

export const logoutController = async (req, res, next) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      message: "Logout successful!",
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while logging out",
    });
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userData = await User.findById(req.user);

    if (!userData) {
      return res.status(401).json({
        message: "User not found!",
      });
    }
    if (req.body.username) {
      userData.username = req.body.username;
    }

    if (req.body.bio) {
      userData.bio = req.body.bio;
    }

    if (req.body.avatar) {
      userData.avatar = req.body.avatar;
    }

    await userData.save();

    res.status(200).json({
      message: "Update successful!",
      username: userData.username,
      bio: userData.bio,
      avatar: userData.avatar,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while updating profile!",
    });
  }
};
