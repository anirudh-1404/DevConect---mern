import User from "../models/UserSchema.js";

export const fetchAllRecruiters = async (req, res, next) => {
  try {
    const recruiters = await User.find({ role: "Recruiter" }).select(
      "-password"
    );

    if (!recruiters) {
      return res.status(400).json({
        message: "Unable to fetch Recruiters!",
      });
    }

    res.status(200).json({
      message: "All recruiters fetched successfully!",
      allRecruiters: recruiters,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while fetching recruiters",
    });
  }
};

export const fetchRecruiter = async (req, res, next) => {
  const { id } = req.params;
  const recruiter = await User.findById(id).select("-password");

  if (!recruiter) {
    return res.status(400).json({
      message: "Recruiter not found!",
    });
  }

  res.status(200).json({
    message: "Recruiter fetched successfully!",
    recruiter: recruiter,
  });
};
