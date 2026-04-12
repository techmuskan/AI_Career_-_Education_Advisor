import { ChatPromptTemplate } from "@langchain/core/prompts";

export const careerPrompt = ChatPromptTemplate.fromTemplate(`
You are a career guidance expert for Indian students.

Student Profile:
- Class Level: {classLevel}
- RIASEC Scores: {riasecScores}
- Top Traits: {topTraits}
- Interests: {interests}

Task:
1. Suggest 3 best career options
2. Explain WHY each career fits
3. Provide a roadmap for the best career

Rules:
- Keep answers simple and practical
- Focus on Indian education system
- Avoid unrealistic careers

Output ONLY JSON:
{{
    "careers": [
    {{
        "title": "",
        "reason": ""
    }}
    ],
    "roadmap": [
        "Step 1",
        "Step 2"
    ]
}}
`);