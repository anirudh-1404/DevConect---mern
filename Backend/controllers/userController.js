import User from "../models/UserSchema.js";
import Notification from "../models/NotificationSchema.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
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

export const registerUser = async (req, res) => {
  const { email, username, password, bio, role, skills, github, linkedin, company } =
    req.body;

  try {
    if (!email || !password || !username || !role) {
      return res.status(401).json({ message: "All fields are required!" });
    }

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const encryptedPassword = await hashedPassword(password);
    const skillsArray = skills ? JSON.parse(skills) : [];

    const user = await User.create({
      username,
      email,
      password: encryptedPassword,
      bio,
      avatar: req.file ? req.file.path : "",
      role,
      github,
      linkedin,
      skills: skillsArray,
      company,
    });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 * 2,
    });

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong!" });
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
      user: userExists,
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
    const userData = await User.findById(userId)
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

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
      linkedin: userData.linkedin,
      github: userData.github,
      skills: userData.skills,
      followers: userData.followers,
      following: userData.following,
      company: userData.company,
      createdAt: userData.createdAt,
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
    const userData = await User.findById(req.user._id);

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

    if (req.body.skills) {
      userData.skills = JSON.parse(req.body.skills);
    }

    if (req.body.company) {
      userData.company = req.body.company;
    }

    if (req.file) {
      userData.avatar = req.file.path;
    }

    await userData.save();

    res.status(200).json({
      message: "Update successful!",
      username: userData.username,
      bio: userData.bio,
      avatar: userData.avatar,
      avatar: userData.avatar,
      skills: userData.skills,
      company: userData.company,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while updating profile!",
    });
  }
};

export const toggleFollowUser = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const targetUserId = req.params.id;

    if (loggedInUserId.toString() === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself!",
      });
    }

    const loggedUser = await User.findById(loggedInUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    const isAlreadyFollowing = loggedUser.following.includes(targetUserId);

    if (isAlreadyFollowing) {
      loggedUser.following = loggedUser.following.filter(
        (id) => id.toString() !== targetUserId
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== loggedInUserId.toString()
      );

      await loggedUser.save();
      await targetUser.save();

      return res.status(200).json({
        message: "Unfollowed successfully!",
        isFollowing: false,
        followersCount: targetUser.followers.length,
      });
    }


    loggedUser.following.push(targetUserId);
    targetUser.followers.push(loggedInUserId);

    await loggedUser.save();
    await targetUser.save();


    const newNotification = new Notification({
      type: "follow",
      from: loggedInUserId,
      to: targetUserId,
      message: `${loggedUser.username} started following you`,
      link: `/profile/${loggedUser.username}`,
    });

    await newNotification.save();


    const receiverSocketId = getReceiverSocketId(targetUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification", newNotification);
    }

    return res.status(200).json({
      message: "Followed successfully!",
      isFollowing: true,
      followersCount: targetUser.followers.length,
    });
  } catch (err) {
    console.log("Error in toggleFollowUser: ", err.message);
    return res.status(500).json({
      message: "Something went wrong while following user!",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserById controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
