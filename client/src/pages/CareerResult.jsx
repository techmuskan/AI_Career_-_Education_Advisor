import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CareerCard from "../components/CareerCard";
import RadarChart from "../components/RadarChart";
import { aiService } from "../services/ai.service";
import { quizService } from "../services/quiz.service";

export default function CareerResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [entry, setEntry] = useState(null);

  const quizResult = useMemo(() => {
    if (location.state?.quizResult) return location.state.quizResult;
    const history = quizService.getQuizHistory();
    return history[0] || null;
  }, [location.state]);

  useEffect(() => {
    if (!quizResult) return;

    if (location.state?.careerRecommendation) {
      setEntry({ careerRecommendation: location.state.careerRecommendation });
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      setError("");
      try {
        const suggestions = await aiService.getCareerSuggestions(quizResult);
        setEntry(suggestions);
      } catch (err) {
        setError(err.message || "Unable to load suggestions");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [quizResult, location.state]);

  if (!quizResult) {
    return (
      <main className="page-shell">
        <section className="card center">
          <h1>No quiz result found</h1>
          <p className="muted">Complete the quiz to generate your AI-powered career report.</p>
          <button type="button" className="btn-primary" onClick={() => navigate("/quiz")}>
            Take Quiz
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="card">
        <h1>Career Result</h1>
        <p className="muted">
          Dominant profile: {quizResult.dominantTypes?.join(" - ") || "Not available"}
        </p>
        <p className="small muted">
          Generated on{" "}
          {quizResult.createdAt
            ? new Date(quizResult.createdAt).toLocaleString()
            : "Unknown"}
        </p>

        {loading && <p className="status-info">Generating AI suggestions...</p>}
        {error && <p className="status-error">{error}</p>}
        {entry?.isFallback && (
          <p className="status-info">
            AI API is unavailable right now, so we generated a guided fallback recommendation set.
          </p>
        )}
      </section>

      <section className="result-grid">
        <RadarChart scores={quizResult.scores} />

        <article className="card">
          <h3>Score Breakdown</h3>
          <div className="chip-wrap">
            {Object.entries(quizResult.scores || {}).map(([type, score]) => (
              <span key={type} className="chip">
                {type}: {score}
              </span>
            ))}
          </div>

          <h4>Interests</h4>
          <p className="muted">{quizResult.interests || "Not specified"}</p>

          <h4>Class/Year</h4>
          <p className="muted">{quizResult.classLevel || "Not specified"}</p>

          <Link className="btn-secondary inline-btn" to="/chat">
            Discuss with AI Chat
          </Link>
        </article>
      </section>

      {/* Career Cards */}
      {entry?.careerRecommendation?.careers?.length > 0 && (
        <section className="grid-2">
          {entry.careerRecommendation.careers.map((career, index) => (
            <CareerCard key={`${career.title}-${index}`} career={career} index={index} />
          ))}
        </section>
      )}

      {/* Roadmap */}
      {entry?.careerRecommendation?.roadmap?.length > 0 && (
        <section className="card">
          <h3>Your Roadmap</h3>
          <ol className="roadmap-list">
            {entry.careerRecommendation.roadmap.map((step, index) => (
              <li key={index} className="roadmap-item">
                {step}
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}