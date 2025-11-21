import mongoose from "mongoose";

const profileViewSchema = new mongoose.Schema(
    {
        viewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        viewedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);


profileViewSchema.index({ viewer: 1, viewedUser: 1, createdAt: 1 });

export const ProfileView = mongoose.model("ProfileView", profileViewSchema);
