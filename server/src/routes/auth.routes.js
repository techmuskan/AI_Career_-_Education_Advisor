import { Router } from "express";
import { deleteUser, getProfile, loginUser, signupUser } from "../controllers/auth.controllers.js";

const authRoutes = Router();


authRoutes.post("/signup", signupUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/getProfile", getProfile);
authRoutes.delete("/delete-user", deleteUser);

export default authRoutes;
