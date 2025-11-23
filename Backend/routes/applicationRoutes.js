import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
    applyForJob,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus
} from "../controllers/applicationController.js";

const router = express.Router();


router.post("/:id/apply", protectRoute, applyForJob);


router.get("/job/:id", protectRoute, getJobApplications);


router.get("/my-applications", protectRoute, getMyApplications);


router.put("/:id/status", protectRoute, updateApplicationStatus);

export default router;
