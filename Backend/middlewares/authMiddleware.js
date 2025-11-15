import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/UserSchema.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decode.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized access!",
    });
  }
};
