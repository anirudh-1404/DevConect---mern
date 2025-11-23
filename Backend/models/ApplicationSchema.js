import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["Applied", "Interview Scheduled", "Interviewing", "Hired", "Offered", "Rejected"],
            default: "Applied",
        },
        coverLetter: {
            type: String,
        },
        interviewDate: {
            type: Date,
        },
        interviewTime: {
            type: String,
        },
        interviewMode: {
            type: String,
            enum: ["Online", "Offline"],
        },
        interviewType: {
            type: String,
            enum: ["Technical", "HR", "Managerial"],
        },
    },
    { timestamps: true }
);


applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
