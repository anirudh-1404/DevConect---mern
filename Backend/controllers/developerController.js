import User from "../models/UserSchema.js";

export const fetchAllDevs = async (req, res, next) => {
  try {
    const { skills, location, search } = req.query;

    
    let query = { role: { $regex: /^Developer$/i } };

    
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query.skills = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }

    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ];
    }

    const allDevs = await User.find(query).select("-password");

    res.status(200).json({
      message: "All Developers fetched successfully!",
      devs: allDevs,
      count: allDevs.length
    });
  } catch (err) {
    console.error("Error fetching developers:", err);
    res.status(500).json({
      message: "Something went wrong while fetching developers!",
    });
  }
};

export const fetchDeveloper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const developer = await User.findById(id)
      .select("-password")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

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
