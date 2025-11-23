import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
    createHackathon,
    getAllHackathons,
    getHackathonById,
    registerParticipant,
} from "../controllers/hackathonController.js";

const router = express.Router();

router.post("/create", protectRoute, createHackathon);
router.get("/", getAllHackathons);
router.get("/:id", getHackathonById);
router.post("/:id/register", protectRoute, registerParticipant);

export default router;
