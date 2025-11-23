import { Hackathon } from "../models/HackathonSchema.js";

export const createHackathon = async (req, res) => {
    try {
        const {
            title,
            description,
            startDate,
            endDate,
            registrationDeadline,
            prizes,
            tags,
            bannerImage,
            rules,
        } = req.body;

        if (!title || !description || !startDate || !endDate) {
            return res.status(400).json({ message: "Required fields are missing!" });
        }

        const hackathon = await Hackathon.create({
            title,
            description,
            organizer: req.user._id,
            startDate,
            endDate,
            registrationDeadline,
            prizes,
            tags,
            bannerImage,
            rules,
        });

        res.status(201).json({
            message: "Hackathon created successfully!",
            hackathon,
        });
    } catch (err) {
        console.error("Error creating hackathon:", err);
        res.status(500).json({ message: "Error creating hackathon" });
    }
};

export const getAllHackathons = async (req, res) => {
    try {
        const hackathons = await Hackathon.find()
            .populate("organizer", "username avatar company")
            .sort({ startDate: 1 }); // Sort by start date ascending

        res.status(200).json({
            message: "Hackathons fetched successfully!",
            hackathons,
        });
    } catch (err) {
        console.error("Error fetching hackathons:", err);
        res.status(500).json({ message: "Error fetching hackathons" });
    }
};

export const getHackathonById = async (req, res) => {
    try {
        const { id } = req.params;
        const hackathon = await Hackathon.findById(id).populate(
            "organizer",
            "username avatar company"
        );

        if (!hackathon) {
            return res.status(404).json({ message: "Hackathon not found!" });
        }

        res.status(200).json({
            message: "Hackathon fetched successfully!",
            hackathon,
        });
    } catch (err) {
        console.error("Error fetching hackathon:", err);
        res.status(500).json({ message: "Error fetching hackathon" });
    }
};

export const registerParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const hackathon = await Hackathon.findById(id);
        if (!hackathon) {
            return res.status(404).json({ message: "Hackathon not found!" });
        }

        if (hackathon.participants.includes(userId)) {
            return res.status(400).json({ message: "Already registered!" });
        }

        hackathon.participants.push(userId);
        await hackathon.save();

        res.status(200).json({
            message: "Registered successfully!",
            hackathon,
        });
    } catch (err) {
        console.error("Error registering for hackathon:", err);
        res.status(500).json({ message: "Error registering for hackathon" });
    }
};
