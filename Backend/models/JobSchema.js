import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["Remote", "Onsite", "Hybrid"],
            required: true,
        },
        salary: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        requirements: [
            {
                type: String,
            },
        ],
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["Open", "Closed"],
            default: "Open",
        },
    },
    { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
