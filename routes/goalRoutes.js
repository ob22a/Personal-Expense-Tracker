import { Router } from "express";
import {userGoals,deleteUserGoal,updateUserGoal,createUserGoal} from '../controllers/goalController.js';

const router = Router();

router.get('/', userGoals);
router.post('/', createUserGoal);
router.put('/:id', updateUserGoal);
router.delete('/:id', deleteUserGoal);

export default router;