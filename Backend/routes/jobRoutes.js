import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
    createJob,
    getAllJobs,
    getJobById,
    getMyJobs,
    updateJob,
    deleteJob,
    applyForJob,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
} from "../controllers/jobController.js";

const router = express.Router();


router.post("/", protectRoute, createJob);
router.get("/", getAllJobs);
router.get("/my-jobs", protectRoute, getMyJobs);
router.get("/:id", getJobById);
router.put("/:id", protectRoute, updateJob);
router.delete("/:id", protectRoute, deleteJob);


router.post("/:id/apply", protectRoute, applyForJob);
router.get("/:id/applications", protectRoute, getJobApplications);
router.get("/applications/my", protectRoute, getMyApplications);
router.put("/applications/:id/status", protectRoute, updateApplicationStatus);

export default router;
