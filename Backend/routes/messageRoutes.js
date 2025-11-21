import express from "express";
import {
    getMessages,
    sendMessage,
    getConversations,
    markMessagesAsRead,
    getUnreadCount,
} from "../controllers/messageController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/unread-count", protectRoute, getUnreadCount);
router.put("/mark-read/:id", protectRoute, markMessagesAsRead);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
