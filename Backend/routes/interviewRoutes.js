import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
    scheduleInterview,
    getInterviews,
    getInterviewById,
    getInterviewByRoomId,
    updateInterviewStatus,
    saveNotes,
    submitFeedback,
    cancelInterview,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/schedule", protectRoute, scheduleInterview);
router.get("/", protectRoute, getInterviews);
router.get("/:id", protectRoute, getInterviewById);
router.get("/room/:roomId", protectRoute, getInterviewByRoomId);
router.patch("/:id/status", protectRoute, updateInterviewStatus);
router.patch("/:id/notes", protectRoute, saveNotes);
router.post("/:id/feedback", protectRoute, submitFeedback);
router.patch("/:id/cancel", protectRoute, cancelInterview);

export default router;
