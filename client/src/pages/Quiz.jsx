import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { quizService } from "../services/quiz.service";
import { RIASEC_QUESTIONS } from "../utils/constants";

export default function Quiz() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [classLevel, setClassLevel] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const answeredCount = Object.keys(answers).length;
  const progress = useMemo(
    () => Math.round((answeredCount / RIASEC_QUESTIONS.length) * 100),
    [answeredCount]
  );

  const onSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const onSubmit = async () => {
    if (answeredCount !== RIASEC_QUESTIONS.length) {
      setError("Please answer every question before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await quizService.submitQuiz({
        questions: RIASEC_QUESTIONS,
        answers,
        classLevel,
        interests
      });

      navigate("/result", {
        state: {
          quizResult: result.quizResult,
          careerRecommendation: result.careerRecommendation
        }
      });
      
    } catch (err) {
      setError(err.message || "Failed to submit quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="card">
        <h1>RIASEC Career Quiz</h1>
        <p className="muted">Rate each statement from 1 to 5. This profile powers your AI career recommendations.</p>

        <div className="meta-grid">
          <div>
            <label className="field-label" htmlFor="classLevel">Class/Year</label>
            <input
              id="classLevel"
              className="field"
              value={classLevel}
              onChange={(event) => setClassLevel(event.target.value)}
              placeholder="12th, B.Tech 1st Year"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="interests">Interests</label>
            <input
              id="interests"
              className="field"
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
              placeholder="technology, healthcare, design"
            />
          </div>
        </div>

        <div className="progress-wrap">
          <p className="small muted">Progress: {answeredCount}/{RIASEC_QUESTIONS.length}</p>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        </div>
      </section>

      <section className="quiz-grid">
        {RIASEC_QUESTIONS.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            value={answers[question.id]}
            onSelect={onSelect}
          />
        ))}
      </section>

      <section className="submit-wrap">
        {error && <p className="status-error">{error}</p>}
        <button type="button" className="btn-primary" disabled={loading} onClick={onSubmit}>
          {loading ? "Processing profile..." : "Submit Quiz"}
        </button>
      </section>
    </main>
  );
}
