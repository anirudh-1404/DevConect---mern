import express from "express";
import {
    saveJob,
    unsaveJob,
    getSavedJobs,
    checkIfJobSaved,
} from "../controllers/savedJobController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Get all saved jobs for the logged-in user
router.get("/", getSavedJobs);

// Save a job
router.post("/:jobId", saveJob);

// Unsave a job
router.delete("/:jobId", unsaveJob);

// Check if a job is saved
router.get("/check/:jobId", checkIfJobSaved);

export default router;
