import express from "express";
import {
    createSession,
    getSessions,
    getSession,
    joinSession,
    endSession,
    updateCode,
    updateLanguage,
} from "../controllers/codingSessionController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/create", protectRoute, createSession);
router.get("/", protectRoute, getSessions);
router.get("/:id", protectRoute, getSession);
router.post("/:id/join", protectRoute, joinSession);
router.put("/:id/end", protectRoute, endSession);
router.put("/:id/code", protectRoute, updateCode);
router.put("/:id/language", protectRoute, updateLanguage);

export default router;
