import User from "../models/UserSchema.js";

export const fetchAllRecruiters = async (req, res, next) => {
  try {
    const { company, industry, search } = req.query;

    
    let query = { role: { $regex: /^Recruiter$/i } };

    
    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }

    
    if (industry) {
      query.industry = { $regex: industry, $options: 'i' };
    }

    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    const recruiters = await User.find(query).select("-password");

    res.status(200).json({
      message: "All recruiters fetched successfully!",
      allRecruiters: recruiters,
      count: recruiters.length
    });
  } catch (err) {
    console.error("Error fetching recruiters:", err);
    res.status(500).json({
      message: "Something went wrong while fetching recruiters",
    });
  }
};

export const fetchRecruiter = async (req, res, next) => {
  const { id } = req.params;
  const recruiter = await User.findById(id)
    .select("-password")
    .populate("followers", "username avatar")
    .populate("following", "username avatar");

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
