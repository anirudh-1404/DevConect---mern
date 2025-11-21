import express from "express";
import { executeCode, getSupportedLanguages } from "../controllers/executionController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/execute", protectRoute, executeCode);
router.get("/languages", protectRoute, getSupportedLanguages);

export default router;
