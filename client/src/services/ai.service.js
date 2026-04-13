import { apiRequest } from "./api";
import { STORAGE_KEYS } from "../utils/constants";

const getSavedSuggestions = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.SAVED_SUGGESTIONS);
  return raw ? JSON.parse(raw) : [];
};

const saveSuggestions = (entry) => {
  const existing = getSavedSuggestions();
  const entryKey = entry.reportKey || entry.quizId;
  const filtered = entryKey
    ? existing.filter((item) => (item.reportKey || item.quizId) !== entryKey)
    : existing;
  const updated = [entry, ...filtered].slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.SAVED_SUGGESTIONS, JSON.stringify(updated));
};

const normalizeSuggestions = (response) => {
  return Array.isArray(response?.data) ? response.data : [];
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
    const payload = quizResult
      ? {
          riasecScores: quizResult.scores,
          topTraits: quizResult.dominantTypes,
          classLevel: quizResult.classLevel,
          interests: quizResult.interests
        }
      : {};

    const response = await apiRequest("/api/v1/careerRecommendation/recommendation", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const suggestions = normalizeSuggestions(response);
    const entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      quizId: quizResult?.id || null,
      reportKey: quizResult?.id || "backend-profile",
      suggestions
    };
    saveSuggestions(entry);
    return entry;
  } catch {
    if (!quizResult) {
      throw new Error("Unable to load AI report from backend");
    }

    const suggestions = fallbackSuggestions(quizResult);
    const entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      quizId: quizResult.id,
      reportKey: quizResult.id,
      suggestions,
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

const detectChatIntent = (message) => {
  const text = (message || "").toLowerCase();

  if (/skill|learn|improv|course|subject/.test(text)) return "skills";
  if (/roadmap|plan|step|path|how to start|next/.test(text)) return "roadmap";
  if (/project|portfolio|resume|cv|internship/.test(text)) return "projects";
  if (/salary|pay|package|income/.test(text)) return "salary";

  return "general";
};

const formatChatReplyFromRecommendations = (recommendations, userMessage) => {
  const topRecommendations = recommendations.slice(0, 3);
  const intent = detectChatIntent(userMessage);

  if (intent === "skills") {
    const lines = topRecommendations.map((item, index) => {
      const skills = Array.isArray(item.requiredSkills)
        ? item.requiredSkills.slice(0, 5).join(", ")
        : "Communication, analytical thinking, and practical execution";
      return `${index + 1}. ${item.title}: ${skills}`;
    });

    return `For your question on skills, focus on these role-wise priorities:\n\n${lines.join("\n")}\n\nStart with one role, build 2 projects around these skills, and update your resume with measurable outcomes.`;
  }

  if (intent === "roadmap") {
    const primary = topRecommendations[0];
    const roadmap = Array.isArray(primary?.roadmap) && primary.roadmap.length
      ? primary.roadmap.slice(0, 4)
      : [
          "Build core fundamentals from one trusted source.",
          "Create two practical projects with clear outcomes.",
          "Practice interview questions and communication weekly.",
          "Apply consistently to internships and entry-level roles."
        ];

    const steps = roadmap.map((step, index) => `${index + 1}. ${step}`).join("\n");
    return `Great question. A practical roadmap for ${primary?.title || "your target role"}:\n\n${steps}`;
  }

  if (intent === "projects") {
    const lines = topRecommendations.map((item, index) => {
      const reason = item.reason || "Aligned with your profile and interests.";
      return `${index + 1}. ${item.title}: build one mini-project and one end-to-end project. Why: ${reason}`;
    });

    return `To strengthen your portfolio, work on these tracks:\n\n${lines.join("\n")}`;
  }

  if (intent === "salary") {
    const roles = topRecommendations.map((item) => item.title).join(", ");
    return `I cannot provide exact salary ranges from current backend data, but these roles are your best fit right now: ${roles}.\n\nIf you want, ask: "Which role should I target in the next 90 days and what should I learn first?"`;
  }

  const lines = topRecommendations.map((item, index) => {
    const skills = Array.isArray(item.requiredSkills)
      ? item.requiredSkills.slice(0, 3).join(", ")
      : "Skill details unavailable";
    const reason = item.reason || "No detailed reason provided.";
    return `${index + 1}. ${item.title}\nReason: ${reason}\nTop skills: ${skills}`;
  });

  return `Here is a focused answer based on your profile:\n\n${lines.join("\n\n")}\n\nAsk a specific follow-up like: "skills for role 1", "roadmap for role 2", or "project ideas".`;
};

const chatWithAI = async (message) => {
  try {
    const response = await apiRequest("/api/v1/careerRecommendation/recommendation", {
      method: "POST",
      body: JSON.stringify({ prompt: message })
    });

    const recommendations = normalizeSuggestions(response);

    if (!recommendations.length) {
      return "I could not fetch recommendations right now. Please complete the quiz once and try again.";
    }

    return formatChatReplyFromRecommendations(recommendations, message);
  } catch {
    return "I am unable to reach the server at the moment. Please try again in a few seconds, then ask about skills, roadmap, or projects.";
  }
};

export const aiService = {
  getCareerSuggestions,
  getSavedSuggestions,
  chatWithAI,
  getChatHistory,
  saveChatHistory
};