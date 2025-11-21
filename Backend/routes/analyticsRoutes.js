import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
    trackProfileView,
    getDashboardAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/dashboard", protectRoute, getDashboardAnalytics);
router.post("/profile-view/:userId", protectRoute, trackProfileView);

export default router;
