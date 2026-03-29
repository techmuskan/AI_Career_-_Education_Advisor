import mongoose from "mongoose";

const riasecSchema = new mongoose.Schema({
    R: { type: Number, default: 0 },
    I: { type: Number, default: 0 },
    A: { type: Number, default: 0 },
    S: { type: Number, default: 0 },
    E: { type: Number, default: 0 },
    C: { type: Number, default: 0 }
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },

    classLevel: {
        type: String,
        enum: ["10th", "12th", "graduate"],
        required: true
    },

    // 🧠 AI PERSONALIZATION DATA
    riasecScores: riasecSchema,

    topTraits: {
        type: [String], // ["I", "R"]
        default: []
    },

    interests: {
        type: [String], // ["technology", "design"]
        default: []
    },

    // Security & Auth
    isVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },

    // Tokens (optional for refresh tokens)
    refreshToken: {
        type: String
    }
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: true
}
);

export default mongoose.model("User", userSchema);