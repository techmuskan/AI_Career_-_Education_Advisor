import User from "../models/User.js";
import { careerChain } from "../ai/chains/career.chain.js";


// Controller to handle career recommendation based on RIASEC quiz results
// POST: /api/v1/careerRecommendation/recommendation
export const careerRecommendation = async (req, res) => {
    try {
        const userId = req.user.id;

        const { quizResult } = req.body;

        if (!quizResult) {
            console.error("Quiz result is required but not provided in the request body.");
            return res.status(400).json({
                success: false,
                message: "Quiz result is required!"
            })
        }
        
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
            quizResult: JSON.stringify(quizResult)
        })

        let text = response.content;

        text = text.replace("```json", "").replace("```", "").trim();

        const careerRecommendations = JSON.parse(text);
        console.log("Career Recommendations from server:", careerRecommendations);

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