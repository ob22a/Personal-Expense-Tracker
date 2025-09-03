import { Router } from "express";
import { getGoalLogsHandler, addGoalLogHandler } from "../controllers/goalLogController.js";

const router = Router();

// GET /api/goalLog/:goalId - Get all saving logs for a specific goal
router.get("/:goalId", getGoalLogsHandler);

// POST /api/goalLog/:goalId - Add a new saving log for a specific goal
router.post("/:goalId", addGoalLogHandler);

export default router;