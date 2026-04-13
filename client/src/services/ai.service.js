import { apiRequest } from "./api";
import { STORAGE_KEYS } from "../utils/constants";

const getSavedSuggestions = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.SAVED_SUGGESTIONS);
  return raw ? JSON.parse(raw) : [];
};

const saveSuggestions = (entry) => {
  const existing = getSavedSuggestions();
  const updated = [entry, ...existing].slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.SAVED_SUGGESTIONS, JSON.stringify(updated));
};

const fallbackSuggestions = (quizResult) => {
  const [topType] = quizResult.dominantTypes;
  const byType = {
    R: ["Mechanical Engineer", "Civil Technician", "Field Operations Specialist"],
    I: ["Data Analyst", "Software Engineer", "Research Associate"],
    A: ["UI/UX Designer", "Content Strategist", "Multimedia Creator"],
    S: ["Counselor", "Teacher", "HR Specialist"],
    E: ["Product Manager", "Business Development Associate", "Startup Founder"],
    C: ["Operations Analyst", "Account Coordinator", "Compliance Associate"]
  };

  return (byType[topType] || byType.I).map((title) => ({
    title,
    reason: `Aligned with your ${quizResult.dominantTypes.join("/")} profile and interests in ${quizResult.interests || "multi-domain growth"}.`,
    requiredSkills: ["Communication", "Domain Fundamentals", "Problem Solving", "Project Execution"],
    roadmap: [
      "Build fundamentals through structured courses and notes.",
      "Create two portfolio projects solving real problems.",
      "Practice interview questions and mock discussions weekly.",
      "Apply for internships and entry-level opportunities consistently."
    ]
  }));
};

const getCareerSuggestions = async (quizResult) => {
  try {
    const response = await apiRequest("/api/v1/careerRecommendation/recommendation", {
      method: "POST",
      body: JSON.stringify({ quizResult })
    });

    const entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      quizId: quizResult.id,
      careerRecommendation: response.data
    };
    saveSuggestions(entry);
    return entry;
  } catch {
    const suggestions = fallbackSuggestions(quizResult);
    const entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      quizId: quizResult.id,
      careerRecommendation: {
        careers: suggestions,
        roadmap: suggestions[0]?.roadmap || []
      },
      isFallback: true
    };
    saveSuggestions(entry);
    return entry;
  }
};

const getChatHistory = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
  return raw ? JSON.parse(raw) : [];
};

const saveChatHistory = (messages) => {
  localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
};

const chatWithAI = async (message) => {
  try {
    const response = await apiRequest("/api/v1/careerRecommendation/chat", { // ✅ use correct chat endpoint
      method: "POST",
      body: JSON.stringify({ prompt: message })
    });
    return response?.data?.summary || "I analyzed your request. Try taking the RIASEC quiz for more accurate guidance.";
  } catch {
    return "I can help you plan your career path. Ask about skills, projects, or roadmap for your target role.";
  }
};

export const aiService = {
  getCareerSuggestions,
  getSavedSuggestions,
  chatWithAI,
  getChatHistory,
  saveChatHistory
};