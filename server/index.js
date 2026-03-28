import "dotenv/config";
import express from "express";
import cors from "cors";


import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors({
    origin: "*",
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

app.get("/", (req, res) => {
    res.send({
        message: "Server chal rha hai 🔥"
    })
})