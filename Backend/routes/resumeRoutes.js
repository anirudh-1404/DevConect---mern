import express from "express";
import {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
    autoFillFromProfile,
} from "../controllers/resumeController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, createResume);
router.get("/", protectRoute, getUserResumes);
router.get("/autofill", protectRoute, autoFillFromProfile);
router.get("/:id", protectRoute, getResumeById);
router.put("/:id", protectRoute, updateResume);
router.delete("/:id", protectRoute, deleteResume);

export default router;
