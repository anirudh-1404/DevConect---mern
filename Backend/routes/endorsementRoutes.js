import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { endorseSkill, unendorseSkill, getEndorsements } from "../controllers/endorsementController.js";

const router = express.Router();

router.post("/endorse", protectRoute, endorseSkill);
router.post("/unendorse", protectRoute, unendorseSkill);
router.get("/:userId", getEndorsements);

export default router;
