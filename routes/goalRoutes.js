import { Router } from "express";
import {userGoals,deleteUserGoal,updateUserGoal,createUserGoal} from '../controllers/goalController.js';
import { monthlySummaryHandler } from "../controllers/reportsController.js";
import { getGoalLogsHandler, addGoalLogHandler } from "../controllers/goalLogController.js";

const router = Router();

router.get('/', userGoals);
router.post('/', createUserGoal);
router.put('/:id', updateUserGoal);
router.delete('/:id', deleteUserGoal);
router.get("/goalLog/:goalId", getGoalLogsHandler);
router.post("/goalLog", addGoalLogHandler);
router.get("/reports/monthly-summary", monthlySummaryHandler);

export default router;