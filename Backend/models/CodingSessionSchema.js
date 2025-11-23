import mongoose from "mongoose";

const codingSessionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        language: {
            type: String,
            default: "javascript",
            enum: [
                "javascript",
                "python",
                "java",
                "cpp",
                "c",
                "csharp",
                "go",
                "rust",
                "typescript",
                "php",
                "ruby",
                "swift",
            ],
        },
        code: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["active", "ended"],
            default: "active",
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        endedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);


codingSessionSchema.index({ host: 1, status: 1 });
codingSessionSchema.index({ participants: 1, status: 1 });
codingSessionSchema.index({ status: 1, createdAt: -1 });

export const CodingSession = mongoose.model("CodingSession", codingSessionSchema);
