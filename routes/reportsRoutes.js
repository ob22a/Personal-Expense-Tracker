import { Router } from "express";
import { monthlySummaryHandler } from "../controllers/reportsController.js";

const router = Router();

// GET /api/reports/monthly-summary?ownerId=1
router.get("/", monthlySummaryHandler);

export default router;