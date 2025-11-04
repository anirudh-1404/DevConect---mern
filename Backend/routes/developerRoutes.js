import express from "express";
import {
  fetchAllDevs,
  fetchDeveloper,
} from "../controllers/developerController.js";

const router = express.Router();

router.get("/developers", fetchAllDevs);
router.get("/developers/:id", fetchDeveloper);

export default router;
