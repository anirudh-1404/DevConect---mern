import Resume from "../models/ResumeSchema.js";
import User from "../models/UserSchema.js";


export const createResume = async (req, res) => {
    try {
        const userId = req.user._id;
        const resumeData = req.body;

        const newResume = new Resume({
            user: userId,
            ...resumeData,
        });

        await newResume.save();

        return res.status(201).json({
            message: "Resume created successfully!",
            resume: newResume,
        });
    } catch (err) {
        console.log("Error in createResume:", err.message);
        return res.status(500).json({
            message: "Failed to create resume",
            error: err.message,
        });
    }
};


export const getUserResumes = async (req, res) => {
    try {
        const userId = req.user._id;

        const resumes = await Resume.find({ user: userId }).sort({
            updatedAt: -1,
        });

        return res.status(200).json({
            resumes,
            count: resumes.length,
        });
    } catch (err) {
        console.log("Error in getUserResumes:", err.message);
        return res.status(500).json({
            message: "Failed to fetch resumes",
            error: err.message,
        });
    }
};


export const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const resume = await Resume.findOne({ _id: id, user: userId });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found",
            });
        }

        return res.status(200).json({
            resume,
        });
    } catch (err) {
        console.log("Error in getResumeById:", err.message);
        return res.status(500).json({
            message: "Failed to fetch resume",
            error: err.message,
        });
    }
};


export const updateResume = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        const resume = await Resume.findOne({ _id: id, user: userId });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found",
            });
        }


        Object.keys(updateData).forEach((key) => {
            resume[key] = updateData[key];
        });

        await resume.save();

        return res.status(200).json({
            message: "Resume updated successfully!",
            resume,
        });
    } catch (err) {
        console.log("Error in updateResume:", err.message);
        return res.status(500).json({
            message: "Failed to update resume",
            error: err.message,
        });
    }
};


export const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const resume = await Resume.findOneAndDelete({ _id: id, user: userId });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found",
            });
        }

        return res.status(200).json({
            message: "Resume deleted successfully!",
        });
    } catch (err) {
        console.log("Error in deleteResume:", err.message);
        return res.status(500).json({
            message: "Failed to delete resume",
            error: err.message,
        });
    }
};


export const autoFillFromProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }


        const autoFilledData = {
            personalInfo: {
                fullName: user.username,
                email: user.email,
                linkedin: user.linkedin || "",
                github: user.github || "",
            },
            summary: user.bio || "",
            skills: {
                technical: user.skills || [],
                soft: [],
            },
        };

        return res.status(200).json({
            message: "Profile data retrieved successfully!",
            data: autoFilledData,
        });
    } catch (err) {
        console.log("Error in autoFillFromProfile:", err.message);
        return res.status(500).json({
            message: "Failed to auto-fill from profile",
            error: err.message,
        });
    }
};
