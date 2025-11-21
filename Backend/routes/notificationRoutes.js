import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
    getNotifications,
    deleteNotifications,
    markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteNotifications);
router.put("/:id", protectRoute, markAsRead);

export default router;
