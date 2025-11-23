import { Team } from "../models/TeamSchema.js";
import { Hackathon } from "../models/HackathonSchema.js";

export const createTeam = async (req, res) => {
    try {
        const { name, hackathonId, lookingFor } = req.body;
        const userId = req.user._id;

        // Check if user is already in a team for this hackathon
        const existingTeam = await Team.findOne({
            hackathon: hackathonId,
            members: userId,
        });

        if (existingTeam) {
            return res.status(400).json({ message: "You are already in a team!" });
        }

        const team = await Team.create({
            name,
            hackathon: hackathonId,
            leader: userId,
            members: [userId],
            lookingFor,
        });

        res.status(201).json({
            message: "Team created successfully!",
            team,
        });
    } catch (err) {
        console.error("Error creating team:", err);
        res.status(500).json({ message: "Error creating team" });
    }
};

export const joinTeam = async (req, res) => {
    try {
        const { teamId } = req.body;
        const userId = req.user._id;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found!" });
        }

        // Check if user is already in a team for this hackathon
        const existingTeam = await Team.findOne({
            hackathon: team.hackathon,
            members: userId,
        });

        if (existingTeam) {
            return res.status(400).json({ message: "You are already in a team!" });
        }

        team.members.push(userId);
        await team.save();

        res.status(200).json({
            message: "Joined team successfully!",
            team,
        });
    } catch (err) {
        console.error("Error joining team:", err);
        res.status(500).json({ message: "Error joining team" });
    }
};

export const getTeams = async (req, res) => {
    try {
        const { hackathonId } = req.params;
        const teams = await Team.find({ hackathon: hackathonId })
            .populate("leader", "username avatar")
            .populate("members", "username avatar");

        res.status(200).json({
            message: "Teams fetched successfully!",
            teams,
        });
    } catch (err) {
        console.error("Error fetching teams:", err);
        res.status(500).json({ message: "Error fetching teams" });
    }
};

export const getMyTeam = async (req, res) => {
    try {
        const { hackathonId } = req.params;
        const userId = req.user._id;

        const team = await Team.findOne({
            hackathon: hackathonId,
            members: userId,
        })
            .populate("leader", "username avatar")
            .populate("members", "username avatar");

        res.status(200).json({
            message: "Team fetched successfully!",
            team,
        });
    } catch (err) {
        console.error("Error fetching my team:", err);
        res.status(500).json({ message: "Error fetching my team" });
    }
};

export const autoMatch = async (req, res) => {
    try {
        const { hackathonId } = req.body;
        const userId = req.user._id;

        // Check if already in team
        const existingTeam = await Team.findOne({
            hackathon: hackathonId,
            members: userId,
        });

        if (existingTeam) {
            return res.status(400).json({ message: "You are already in a team!" });
        }

        // Find a team with < 4 members
        // Note: This is a simple implementation. In production, use aggregation to count members.
        const teams = await Team.find({ hackathon: hackathonId });
        const openTeam = teams.find((t) => t.members.length < 4);

        if (openTeam) {
            openTeam.members.push(userId);
            await openTeam.save();
            return res.status(200).json({
                message: "Auto-matched successfully!",
                team: openTeam,
            });
        }

        res.status(404).json({ message: "No open teams found. Create one!" });
    } catch (err) {
        console.error("Error auto-matching:", err);
        res.status(500).json({ message: "Error auto-matching" });
    }
};
