import mongoose from "mongoose";

const connectDB = async () => {
    try {
        let MONGODB_URI = process.env.MONGODB_URI
        const projectName = "AI_Career_Guidance_Application"

        if(!MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable not set")
        }
        
        mongoose.connection.on("connected", () => {
            console.log("Database connect ho gaya hai! 🔥")
        })
        
        await mongoose.connect(`${MONGODB_URI}/${projectName}`)

    } catch (error) {
        console.log("MongoDB connection me error aa rha hai: ", error);
        process.exit(1);
    }
}

export default connectDB;