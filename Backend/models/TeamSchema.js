import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        hackathon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hackathon",
            required: true,
        },
        leader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        lookingFor: [
            {
                type: String, // Skills e.g., "Frontend", "Designer"
            },
        ],
        projectSubmission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission",
        },
    },
    { timestamps: true }
);

export const Team = mongoose.model("Team", TeamSchema);
