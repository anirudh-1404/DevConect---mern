import { Job } from "../models/JobSchema.js";
import { Application } from "../models/ApplicationSchema.js";

export const createJob = async (req, res) => {
    try {
        const { title, company, location, type, salary, description, requirements } = req.body;

        if (!title || !company || !location || !type || !description) {
            return res.status(400).json({ message: "All required fields must be provided!" });
        }

        if (req.user.role?.toLowerCase() !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can post jobs!" });
        }

        const newJob = await Job.create({
            title,
            company,
            location,
            type,
            salary,
            description,
            requirements: requirements || [],
            postedBy: req.user._id,
        });

        res.status(201).json({ message: "Job posted successfully!", job: newJob });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: "Open" })
            .populate("postedBy", "username avatar company")
            .sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("postedBy", "username avatar email company");

        if (!job) return res.status(404).json({ message: "Job not found!" });

        res.status(200).json(job);
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMyJobs = async (req, res) => {
    try {
        if (req.user.role?.toLowerCase() !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can view their jobs!" });
        }

        const jobs = await Job.find({ postedBy: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ message: "Job not found!" });

        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({ message: "Job updated!", job: updatedJob });
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ message: "Job not found!" });

        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        await job.deleteOne();
        await Application.deleteMany({ job: req.params.id });

        res.status(200).json({ message: "Job deleted successfully!" });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

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
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate("job");

        if (!application) {
            return res.status(404).json({ message: "Application not found!" });
        }

        if (application.job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        application.status = status;
        await application.save();

        res.status(200).json({ message: "Application status updated!", application });
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
