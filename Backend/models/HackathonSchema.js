import mongoose from "mongoose";

const HackathonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        registrationDeadline: {
            type: Date,
            required: true,
        },
        prizes: [
            {
                title: String, // e.g., "1st Place"
                amount: String, // e.g., "$5000"
                description: String,
            },
        ],
        tags: [
            {
                type: String,
            },
        ],
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        status: {
            type: String,
            enum: ["Upcoming", "Active", "Ended"],
            default: "Upcoming",
        },
        bannerImage: {
            type: String,
            default: "",
        },
        rules: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Hackathon = mongoose.model("Hackathon", HackathonSchema);
