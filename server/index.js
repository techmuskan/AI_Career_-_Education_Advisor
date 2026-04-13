import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import careerRoutes from "./src/routes/ai.routes.js";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());


// Database Connection
await connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server chal rha hai ${PORT} per`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection me error aa rha hai: ", error);
        process.exit(1);
    })


// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/careerRecommendation", careerRoutes);

app.get("/", (req, res) => {
    res.send({
        message: "Server chal rha hai 🔥"
    })
})