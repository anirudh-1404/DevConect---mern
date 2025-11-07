import express from "express";
import {
  fetchAllRecruiters,
  fetchRecruiter,
} from "../controllers/recruiterController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/recruiters", protectRoute, fetchAllRecruiters);
router.get("/recruiters/:id", protectRoute, fetchRecruiter);

export default router;
