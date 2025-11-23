import { Application } from "../models/ApplicationSchema.js";
import { Job } from "../models/JobSchema.js";
import Message from "../models/MessageSchema.js";


export const applyForJob = async (req, res) => {
    try {
        const { coverLetter } = req.body;
        const jobId = req.params.id;
        const userId = req.user._id;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found!" });

        if (job.status !== "Open") {
            return res.status(400).json({ message: "This job is no longer accepting applications!" });
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job!" });
        }

        const application = await Application.create({
            job: jobId,
            applicant: userId,
            coverLetter,
            status: "Applied",
        });

        

        res.status(201).json({ message: "Application submitted successfully!", application });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ message: "Job not found!" });

        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        const applications = await Application.find({ job: req.params.id })
            .populate("applicant", "username avatar email skills bio github linkedin")
            .sort({ createdAt: -1 });

        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate({
                path: "job",
                populate: { path: "postedBy", select: "username company" }
            })
            .sort({ createdAt: -1 });

        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateApplicationStatus = async (req, res) => {
    try {
        const { status, interviewDate, interviewTime, interviewMode, interviewType } = req.body;
        const application = await Application.findById(req.params.id).populate("job");

        if (!application) {
            return res.status(404).json({ message: "Application not found!" });
        }

        if (application.job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        application.status = status;

        
        if (status === "Interview Scheduled") {
            if (!interviewDate || !interviewTime || !interviewMode || !interviewType) {
                return res.status(400).json({ message: "All interview details are required!" });
            }
            application.interviewDate = interviewDate;
            application.interviewTime = interviewTime;
            application.interviewMode = interviewMode;
            application.interviewType = interviewType;
        }

        await application.save();

        
        const applicantId = application.applicant;
        const recruiterId = req.user._id;
        let messageContent = "";

        switch (status) {
            case "Interview Scheduled":
                messageContent = `Hello! We are pleased to inform you that an interview has been scheduled for the ${application.job.title} position.\n\nDetails:\nDate: ${new Date(interviewDate).toLocaleDateString()}\nTime: ${interviewTime}\nMode: ${interviewMode}\nType: ${interviewType}\n\nPlease confirm your availability.`;
                break;
            case "Interviewing":
                messageContent = `Hello! Your application for ${application.job.title} is now in the interviewing stage. We will be in touch shortly with next steps.`;
                break;
            case "Hired":
                messageContent = `Congratulations! We are thrilled to offer you the position of ${application.job.title}. We will send over the official offer letter shortly.`;
                break;
            case "Offered":
                messageContent = `We are pleased to extend an offer for the ${application.job.title} position. Please check your email for details.`;
                break;
            case "Rejected":
                messageContent = `Thank you for your interest in the ${application.job.title} position. After careful consideration, we have decided to move forward with other candidates. We wish you the best in your job search.`;
                break;
            default:
                messageContent = `Your application status for ${application.job.title} has been updated to: ${status}.`;
        }

        
        await Message.create({
            senderId: recruiterId,
            receiverId: applicantId,
            message: messageContent,
        });

        
        
        

        

        res.status(200).json({ message: "Application status updated and notification sent!", application });
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
