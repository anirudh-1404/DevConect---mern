import { Endorsement } from "../models/EndorsementSchema.js";
import User from "../models/UserSchema.js";

export const endorseSkill = async (req, res) => {
    try {
        const { userId, skill } = req.body;
        const endorserId = req.user._id;

        if (endorserId.toString() === userId) {
            return res.status(400).json({ message: "You cannot endorse yourself!" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        
        if (!user.skills || !user.skills.includes(skill)) {
            return res.status(400).json({ message: "User doesn't have this skill!" });
        }

        const existingEndorsement = await Endorsement.findOne({
            endorser: endorserId,
            endorsedUser: userId,
            skill,
        });

        if (existingEndorsement) {
            return res.status(400).json({ message: "You have already endorsed this skill!" });
        }

        await Endorsement.create({
            endorser: endorserId,
            endorsedUser: userId,
            skill,
        });

        res.status(201).json({ message: "Skill endorsed successfully!" });
    } catch (error) {
        console.error("Error endorsing skill:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const unendorseSkill = async (req, res) => {
    try {
        const { userId, skill } = req.body;
        const endorserId = req.user._id;

        const endorsement = await Endorsement.findOneAndDelete({
            endorser: endorserId,
            endorsedUser: userId,
            skill,
        });

        if (!endorsement) {
            return res.status(404).json({ message: "Endorsement not found!" });
        }

        res.status(200).json({ message: "Endorsement removed!" });
    } catch (error) {
        console.error("Error removing endorsement:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getEndorsements = async (req, res) => {
    try {
        const userId = req.params.userId;

        const endorsements = await Endorsement.find({ endorsedUser: userId })
            .populate("endorser", "username avatar")
            .sort({ createdAt: -1 });

        
        const groupedEndorsements = endorsements.reduce((acc, endorsement) => {
            const skill = endorsement.skill;
            if (!acc[skill]) {
                acc[skill] = [];
            }
            acc[skill].push({
                endorser: endorsement.endorser,
                createdAt: endorsement.createdAt,
            });
            return acc;
        }, {});

        res.status(200).json(groupedEndorsements);
    } catch (error) {
        console.error("Error fetching endorsements:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
