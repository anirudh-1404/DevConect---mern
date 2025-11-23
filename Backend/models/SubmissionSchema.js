import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
    {
        hackathon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hackathon",
            required: true,
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        repoLink: {
            type: String,
            required: true,
        },
        demoVideo: {
            type: String,
        },
        images: [
            {
                type: String,
            },
        ],
        votes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

export const Submission = mongoose.model("Submission", SubmissionSchema);
