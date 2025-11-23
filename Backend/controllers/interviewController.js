import Interview from "../models/InterviewSchema.js";
import { v4 as uuidv4 } from "uuid";
import Notification from "../models/NotificationSchema.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Schedule a new interview
export const scheduleInterview = async (req, res) => {
    try {
        const { developerId, applicationId, scheduledAt, duration, timezone } = req.body;
        const recruiterId = req.user._id;

        if (!developerId || !scheduledAt) {
            return res.status(400).json({ message: "Developer and scheduled time are required!" });
        }

        const roomId = uuidv4();
        const meetingLink = `/interview/${roomId}`; // Relative path

        const interview = await Interview.create({
            recruiter: recruiterId,
            developer: developerId,
            application: applicationId,
            scheduledAt,
            duration: duration || 60,
            timezone: timezone || "UTC",
            roomId,
            meetingLink,
        });


        await interview.populate("recruiter developer", "username email avatar");

        // Send notification to developer
        const notification = new Notification({
            type: "interview",
            from: recruiterId,
            to: developerId,
            message: `scheduled an interview with you`,
            link: `/interview/${roomId}`,
        });
        await notification.save();

        const receiverSocketId = getReceiverSocketId(developerId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", notification);
        }

        res.status(201).json({
            message: "Interview scheduled successfully!",
            interview,
        });
    } catch (err) {
        console.error("Error scheduling interview:", err);
        console.error("Error details:", err.message);
        console.error("Stack trace:", err.stack);
        res.status(500).json({ message: "Error scheduling interview", error: err.message });
    }
};

// Get all interviews for that user
export const getInterviews = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, upcoming } = req.query;

        let query = {
            $or: [{ recruiter: userId }, { developer: userId }],
        };

        if (status) {
            query.status = status;
        }

        if (upcoming === "true") {
            query.scheduledAt = { $gte: new Date() };
            query.status = { $in: ["scheduled", "in-progress"] };
        }

        const interviews = await Interview.find(query)
            .populate("recruiter developer", "username email avatar role")
            .populate("application")
            .sort({ scheduledAt: -1 });

        res.status(200).json({
            message: "Interviews fetched successfully!",
            interviews,
        });
    } catch (err) {
        console.error("Error fetching interviews:", err);
        res.status(500).json({ message: "Error fetching interviews" });
    }
};

// Get interview by ID
export const getInterviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const interview = await Interview.findById(id)
            .populate("recruiter developer", "username email avatar role")
            .populate("application");

        if (!interview) {
            return res.status(404).json({ message: "Interview not found!" });
        }

        // Check if user is participant
        if (
            interview.recruiter._id.toString() !== userId.toString() &&
            interview.developer._id.toString() !== userId.toString()
        ) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        res.status(200).json({
            message: "Interview fetched successfully!",
            interview,
        });
    } catch (err) {
        console.error("Error fetching interview:", err);
        res.status(500).json({ message: "Error fetching interview" });
    }
};

// Get interview by room ID
export const getInterviewByRoomId = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user._id;

        const interview = await Interview.findOne({ roomId })
            .populate("recruiter developer", "username email avatar role")
            .populate("application");

        if (!interview) {
            return res.status(404).json({ message: "Interview not found!" });
        }

        // Check if user is participant
        if (
            interview.recruiter._id.toString() !== userId.toString() &&
            interview.developer._id.toString() !== userId.toString()
        ) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        res.status(200).json({
            message: "Interview fetched successfully!",
            interview,
        });
    } catch (err) {
        console.error("Error fetching interview:", err);
        res.status(500).json({ message: "Error fetching interview" });
    }
};

// Update interview status
export const updateInterviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, startedAt, endedAt } = req.body;
        const userId = req.user._id;

        const interview = await Interview.findById(id);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found!" });
        }

        // Check if user is participant
        if (
            interview.recruiter.toString() !== userId.toString() &&
            interview.developer.toString() !== userId.toString()
        ) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        if (status) interview.status = status;
        if (startedAt) interview.startedAt = startedAt;
        if (endedAt) {
            interview.endedAt = endedAt;
            if (interview.startedAt) {
                const duration = Math.floor((new Date(endedAt) - new Date(interview.startedAt)) / 60000);
                interview.actualDuration = duration;
            }
        }

        await interview.save();

        res.status(200).json({
            message: "Interview updated successfully!",
            interview,
        });
    } catch (err) {
        console.error("Error updating interview:", err);
        res.status(500).json({ message: "Error updating interview" });
    }
};

// Save interviewer notes
export const saveNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const userId = req.user._id;

        const interview = await Interview.findById(id);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found!" });
        }

        // Only recruiter can save notes
        if (interview.recruiter.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only recruiter can save notes!" });
        }

        interview.notes = notes;
        await interview.save();

        res.status(200).json({
            message: "Notes saved successfully!",
            interview,
        });
    } catch (err) {
        console.error("Error saving notes:", err);
        res.status(500).json({ message: "Error saving notes" });
    }
};

// Submit feedback
export const submitFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback, rating } = req.body;
        const userId = req.user._id;

        const interview = await Interview.findById(id);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found!" });
        }

        // Only recruiter can submit feedback
        if (interview.recruiter.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only recruiter can submit feedback!" });
        }

        interview.feedback = feedback;
        if (rating) interview.rating = rating;
        await interview.save();

        res.status(200).json({
            message: "Feedback submitted successfully!",
            interview,
        });
    } catch (err) {
        console.error("Error submitting feedback:", err);
        res.status(500).json({ message: "Error submitting feedback" });
    }
};

// Cancel interview
export const cancelInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const interview = await Interview.findById(id);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found!" });
        }

        // Check if user is participant
        if (
            interview.recruiter.toString() !== userId.toString() &&
            interview.developer.toString() !== userId.toString()
        ) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        interview.status = "cancelled";
        await interview.save();

        // Notify the other participant
        const otherUserId =
            interview.recruiter.toString() === userId.toString()
                ? interview.developer
                : interview.recruiter;

        const notification = new Notification({
            type: "interview",
            from: userId,
            to: otherUserId,
            message: `cancelled the interview`,
            link: `/interviews`,
        });
        await notification.save();

        const receiverSocketId = getReceiverSocketId(otherUserId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", notification);
        }

        res.status(200).json({
            message: "Interview cancelled successfully!",
            interview,
        });
    } catch (err) {
        console.error("Error cancelling interview:", err);
        res.status(500).json({ message: "Error cancelling interview" });
    }
};
