import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { careerRecommendation } from "../controllers/ai.controllers.js";


const careerRoutes = Router();

careerRoutes.post("/recommendation", authMiddleware, careerRecommendation);

export default careerRoutes;