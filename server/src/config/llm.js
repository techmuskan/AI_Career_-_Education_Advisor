import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


export const llm = new ChatGoogleGenerativeAI({
    model: "gemini-3-flash-preview",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
});