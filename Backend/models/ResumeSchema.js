import mongoose from "mongoose";

const ResumeSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            default: "My Resume",
        },
        template: {
            type: String,
            enum: ["modern", "classic"],
            default: "modern",
        },
        personalInfo: {
            fullName: String,
            email: String,
            phone: String,
            location: String,
            website: String,
            linkedin: String,
            github: String,
        },
        summary: {
            type: String,
            default: "",
        },
        experience: [
            {
                company: String,
                position: String,
                location: String,
                startDate: String,
                endDate: String,
                current: Boolean,
                description: String,
            },
        ],
        education: [
            {
                institution: String,
                degree: String,
                field: String,
                startDate: String,
                endDate: String,
                gpa: String,
                description: String,
            },
        ],
        skills: {
            technical: [String],
            soft: [String],
        },
        projects: [
            {
                title: String,
                description: String,
                techStack: [String],
                liveLink: String,
                githubLink: String,
                startDate: String,
                endDate: String,
            },
        ],
        certifications: [
            {
                name: String,
                issuer: String,
                date: String,
                credentialId: String,
                link: String,
            },
        ],
        languages: [
            {
                name: String,
                proficiency: String,
            },
        ],
    },
    { timestamps: true }
);

const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;
