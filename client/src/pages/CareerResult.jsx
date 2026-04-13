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
    if (location.state?.quizResult) {
      return location.state.quizResult;
    }
    const history = quizService.getQuizHistory();
    return history[0] || null;
  }, [location.state]);

  useEffect(() => {
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
  }, [quizResult]);

  return (
    <main className="page-shell">
      <section className="card">
        <h1>Career Result</h1>
        <p className="muted">
          {quizResult
            ? `Dominant profile: ${quizResult.dominantTypes.join(" - ")}`
            : "Backend-generated profile recommendations"}
        </p>
        <p className="small muted">
          Generated on {new Date(quizResult?.createdAt || Date.now()).toLocaleString()}
        </p>

        {loading && <p className="status-info">Generating AI suggestions...</p>}
        {error && <p className="status-error">{error}</p>}
        {!quizResult && !loading && !error && (
          <p className="status-info">Showing recommendation data fetched directly from backend profile.</p>
        )}
        {entry?.isFallback && (
          <p className="status-info">
            AI API is unavailable right now, so we generated a guided fallback recommendation set.
          </p>
        )}
      </section>

      <section className="result-grid">
        {quizResult ? (
          <RadarChart scores={quizResult.scores} />
        ) : (
          <article className="card">
            <h3>Quiz Snapshot</h3>
            <p className="muted">No local quiz result available in this browser session.</p>
            <button type="button" className="btn-primary inline-btn" onClick={() => navigate("/quiz")}>
              Take Quiz
            </button>
          </article>
        )}

        <article className="card">
          <h3>Score Breakdown</h3>
          {quizResult ? (
            <div className="chip-wrap">
              {Object.entries(quizResult.scores).map(([type, score]) => (
                <span key={type} className="chip">{type}: {score}</span>
              ))}
            </div>
          ) : (
            <p className="muted">Score breakdown appears here after quiz submission.</p>
          )}

          <h4>Interests</h4>
          <p className="muted">{quizResult?.interests || "Not specified"}</p>

          <h4>Class/Year</h4>
          <p className="muted">{quizResult?.classLevel || "Not specified"}</p>

          <Link className="btn-secondary inline-btn" to="/chat">Discuss with AI Chat</Link>
        </article>
      </section>

      <section className="grid-2">
        {(entry?.suggestions || []).map((career, index) => (
          <CareerCard key={`${career.title}-${index}`} career={career} index={index} />
        ))}
      </section>
    </main>
  );
}
