import { Router } from "express";
import { deleteUser, getProfile, loginUser, signupUser } from "../controllers/auth.controllers.js";

const authRoutes = Router();


authRoutes.post("/signup", signupUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/getProfile/:id", getProfile);
authRoutes.get("/logout", logOutUser);
authRoutes.delete("/delete-user/:id", deleteUser);

export default authRoutes;
