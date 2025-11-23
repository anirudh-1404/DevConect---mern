import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
    createTeam,
    joinTeam,
    getTeams,
    getMyTeam,
    autoMatch,
} from "../controllers/teamController.js";

const router = express.Router();

router.post("/create", protectRoute, createTeam);
router.post("/join", protectRoute, joinTeam);
router.post("/auto-match", protectRoute, autoMatch);
router.get("/:hackathonId", getTeams);
router.get("/my-team/:hackathonId", protectRoute, getMyTeam);

export default router;
