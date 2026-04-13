export const STORAGE_KEYS = {
  TOKEN: "career-token",
  USER: "career-user",
  QUIZ_HISTORY: "career-quiz-history",
  SAVED_SUGGESTIONS: "career-saved-suggestions",
  CHAT_HISTORY: "career-chat-history"
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const RIASEC_TYPES = ["R", "I", "A", "S", "E", "C"];

export const RIASEC_QUESTIONS = [
  { id: 1, category: "R", text: "I enjoy building, repairing, or assembling practical things." },
  { id: 2, category: "R", text: "I prefer hands-on projects over mostly theoretical work." },
  { id: 3, category: "R", text: "I like working with tools, equipment, or technical setups." },
  { id: 4, category: "R", text: "I feel energized by physical, field, or workshop activities." },

  { id: 5, category: "I", text: "I enjoy research, analysis, and solving complex problems." },
  { id: 6, category: "I", text: "I am curious about how systems work under the surface." },
  { id: 7, category: "I", text: "I like subjects involving logic, data, and experimentation." },
  { id: 8, category: "I", text: "I prefer investigating ideas before making a decision." },

  { id: 9, category: "A", text: "I enjoy expressing ideas through design, writing, or media." },
  { id: 10, category: "A", text: "I like turning abstract thoughts into creative output." },
  { id: 11, category: "A", text: "I prefer flexible environments that encourage originality." },
  { id: 12, category: "A", text: "I enjoy storytelling, visual identity, or content creation." },

  { id: 13, category: "S", text: "I feel fulfilled when helping people learn or grow." },
  { id: 14, category: "S", text: "I naturally support, coach, or guide others in teams." },
  { id: 15, category: "S", text: "I am patient and empathetic in people-focused situations." },
  { id: 16, category: "S", text: "I enjoy work that creates direct social impact." },

  { id: 17, category: "E", text: "I enjoy leading initiatives and motivating others." },
  { id: 18, category: "E", text: "I like pitching ideas and influencing decisions." },
  { id: 19, category: "E", text: "I am interested in entrepreneurship or management roles." },
  { id: 20, category: "E", text: "I am comfortable taking ownership under uncertainty." },

  { id: 21, category: "C", text: "I enjoy organizing information and building clear systems." },
  { id: 22, category: "C", text: "I value precision, planning, and process-driven execution." },
  { id: 23, category: "C", text: "I like tracking details, schedules, and structured tasks." },
  { id: 24, category: "C", text: "I perform best with clear expectations and measurable output." }
];

export const SCALE_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" }
];