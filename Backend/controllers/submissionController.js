import { Submission } from "../models/SubmissionSchema.js";
import { Team } from "../models/TeamSchema.js";

export const createSubmission = async (req, res) => {
    try {
        const { hackathonId, teamId, title, description, repoLink, demoVideo } =
            req.body;
        const userId = req.user._id;

        // Verify user is in the team
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found!" });
        }

        if (!team.members.includes(userId)) {
            return res
                .status(403)
                .json({ message: "You are not a member of this team!" });
        }

        // Check if submission already exists
        const existingSubmission = await Submission.findOne({ team: teamId });
        if (existingSubmission) {
            // Update existing
            existingSubmission.title = title;
            existingSubmission.description = description;
            existingSubmission.repoLink = repoLink;
            existingSubmission.demoVideo = demoVideo;
            await existingSubmission.save();
            return res.status(200).json({
                message: "Submission updated successfully!",
                submission: existingSubmission,
            });
        }

        const submission = await Submission.create({
            hackathon: hackathonId,
            team: teamId,
            title,
            description,
            repoLink,
            demoVideo,
        });

        // Link submission to team
        team.projectSubmission = submission._id;
        await team.save();

        res.status(201).json({
            message: "Project submitted successfully!",
            submission,
        });
    } catch (err) {
        console.error("Error submitting project:", err);
        res.status(500).json({ message: "Error submitting project" });
    }
};

export const getSubmissions = async (req, res) => {
    try {
        const { hackathonId } = req.params;
        const submissions = await Submission.find({ hackathon: hackathonId })
            .populate("team", "name members")
            .populate({
                path: "team",
                populate: { path: "members", select: "username avatar" },
            });

        res.status(200).json({
            message: "Submissions fetched successfully!",
            submissions,
        });
    } catch (err) {
        console.error("Error fetching submissions:", err);
        res.status(500).json({ message: "Error fetching submissions" });
    }
};

export const voteSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const submission = await Submission.findById(id);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found!" });
        }

        const isVoted = submission.votes.includes(userId);

        if (isVoted) {
            submission.votes = submission.votes.filter(
                (v) => v.toString() !== userId.toString()
            );
        } else {
            submission.votes.push(userId);
        }

        await submission.save();

        res.status(200).json({
            message: isVoted ? "Vote removed" : "Voted successfully",
            submission,
        });
    } catch (err) {
        console.error("Error voting:", err);
        res.status(500).json({ message: "Error voting" });
    }
};
