import { RIASEC_TYPES, STORAGE_KEYS } from "../utils/constants";

const getQuizHistory = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
  return raw ? JSON.parse(raw) : [];
};

const saveQuizHistory = (history) => {
  localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));
};

const calculateScores = (questions, answers) => {
  const scores = RIASEC_TYPES.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

  questions.forEach((question) => {
    const answer = Number(answers[question.id] || 0);
    scores[question.category] += answer;
  });

  return scores;
};

const dominantTypesFromScores = (scores) => {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type);
};

const submitQuiz = async ({ questions, answers, classLevel, interests }) => {
  const scores = calculateScores(questions, answers);
  const dominantTypes = dominantTypesFromScores(scores);

  const quizResult = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    classLevel,
    interests,
    scores,
    dominantTypes
  };

  const history = getQuizHistory();
  const updatedHistory = [quizResult, ...history].slice(0, 10);
  saveQuizHistory(updatedHistory);

  return quizResult;
};

export const quizService = {
  calculateScores,
  dominantTypesFromScores,
  submitQuiz,
  getQuizHistory
};