import User from "../models/UserSchema.js";

export const fetchAllDevs = async (req, res, next) => {
  try {
    const allDevs = await User.find({ role: "Developer" }).select("-password");

    if (!allDevs) {
      return res.status(400).json({
        message: "No developers found!",
      });
    }

    res.status(200).json({
      message: "All Developers fetched successfully!",
      devs: allDevs,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while fetching developers!",
    });
  }
};

export const fetchDeveloper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const developer = await User.findById(id).select("-password");

    if (!developer) {
      return res.status(400).json({
        message: "Developer not found!",
      });
    }

    res.status(200).json({
      message: "Developer fetched successfully!",
      dev: developer,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch developer!",
    });
  }
};
