import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
    {
        // Participants
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        developer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
        },

        // Scheduling
        scheduledAt: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            default: 60, // minutes
        },
        timezone: {
            type: String,
            default: "UTC",
        },

        // Status
        status: {
            type: String,
            enum: ["scheduled", "in-progress", "completed", "cancelled", "no-show"],
            default: "scheduled",
        },

        // Room Details
        roomId: {
            type: String,
            unique: true,
            required: true,
        },
        meetingLink: String,

        // Interview Data
        notes: String, // Recruiter's private notes
        feedback: String, // Post-interview feedback
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },

        // Code/Whiteboard snapshots
        codeSnapshots: [
            {
                timestamp: Date,
                code: String,
                language: String,
            },
        ],
        whiteboardData: String,

        // Metadata
        startedAt: Date,
        endedAt: Date,
        actualDuration: Number, // minutes
    },
    { timestamps: true }
);

const Interview = mongoose.model("Interview", InterviewSchema);
export default Interview;
