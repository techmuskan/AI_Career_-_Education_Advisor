import { Router } from "express";
import { deleteUser, getProfile, loginUser, logOutUser, signupUser } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRoutes = Router();

// Public Routes
authRoutes.post("/signup", signupUser);
authRoutes.post("/login", loginUser);

// Protected Routes
authRoutes.get("/getProfile/", authMiddleware, getProfile);
authRoutes.get("/logout", authMiddleware, logOutUser);
authRoutes.delete("/delete/:id", authMiddleware, deleteUser);

export default authRoutes;
