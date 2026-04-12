import { llm } from "../../config/llm.js";
import { careerPrompt } from "../prompts/career.prompt.js";

export const careerChain = careerPrompt.pipe(llm);