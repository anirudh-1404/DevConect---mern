import mongoose from "mongoose";

const endorsementSchema = new mongoose.Schema(
    {
        endorser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        endorsedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        skill: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);


endorsementSchema.index({ endorser: 1, endorsedUser: 1, skill: 1 }, { unique: true });

export const Endorsement = mongoose.model("Endorsement", endorsementSchema);
