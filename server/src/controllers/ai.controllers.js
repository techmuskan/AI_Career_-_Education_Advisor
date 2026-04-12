import User from "../models/User.js";
import { careerChain } from "../ai/chains/career.chain.js";

export const careerRecommendation = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId).select(
            "riasecScores topTraits interests classLevel"
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        const response = await careerChain.invoke({
            riasecScores: JSON.stringify(user.riasecScores),
            classLevel: user.classLevel,
            topTraits: user.topTraits.join(", "),
            interests: user.interests.join(", ")
        })

        let text = response.content;

        text = text.replace("```json", "").replace("```", "").trim();

        const careerRecommendations = JSON.parse(text);

        return res.status(200).json({
            success: true,
            data: careerRecommendations
        })

    } catch (error) {
        console.error("Error generating career recommendation:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to generate career recommendation"
        });
    }
}