import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
    createSubmission,
    getSubmissions,
    voteSubmission,
} from "../controllers/submissionController.js";

const router = express.Router();

router.post("/create", protectRoute, createSubmission);
router.get("/:hackathonId", getSubmissions);
router.post("/:id/vote", protectRoute, voteSubmission);

export default router;
