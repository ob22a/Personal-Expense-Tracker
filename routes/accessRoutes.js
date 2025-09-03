import { Router } from "express";
import generateToken from "../controllers/accessControllers.js";

const router = Router();

router.get('/',generateToken);

export default router;