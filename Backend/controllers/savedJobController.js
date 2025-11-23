import { SavedJob } from "../models/SavedJobSchema.js";
import { Job } from "../models/JobSchema.js";

// Save a job
export const saveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if already saved
        const existingSave = await SavedJob.findOne({ user: userId, job: jobId });
        if (existingSave) {
            return res.status(400).json({ message: "Job already saved" });
        }

        // Save the job
        const savedJob = await SavedJob.create({
            user: userId,
            job: jobId,
        });

        res.status(201).json({
            message: "Job saved successfully",
            savedJob,
        });
    } catch (error) {
        console.error("Error saving job:", error);
        res.status(500).json({ message: "Failed to save job" });
    }
};

// Unsave a job
export const unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;

        const result = await SavedJob.findOneAndDelete({
            user: userId,
            job: jobId,
        });

        if (!result) {
            return res.status(404).json({ message: "Saved job not found" });
        }

        res.status(200).json({ message: "Job unsaved successfully" });
    } catch (error) {
        console.error("Error unsaving job:", error);
        res.status(500).json({ message: "Failed to unsave job" });
    }
};

// Get all saved jobs for a user
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user._id;

        const savedJobs = await SavedJob.find({ user: userId })
            .populate({
                path: "job",
                populate: {
                    path: "postedBy",
                    select: "username avatar company",
                },
            })
            .sort({ createdAt: -1 });

        // Filter out any saved jobs where the job has been deleted
        const validSavedJobs = savedJobs.filter((saved) => saved.job !== null);

        res.status(200).json({
            savedJobs: validSavedJobs,
            count: validSavedJobs.length,
        });
    } catch (error) {
        console.error("Error fetching saved jobs:", error);
        res.status(500).json({ message: "Failed to fetch saved jobs" });
    }
};

// Check if a job is saved by the user
export const checkIfJobSaved = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;

        const savedJob = await SavedJob.findOne({ user: userId, job: jobId });

        res.status(200).json({ isSaved: !!savedJob });
    } catch (error) {
        console.error("Error checking saved job:", error);
        res.status(500).json({ message: "Failed to check saved status" });
    }
};
