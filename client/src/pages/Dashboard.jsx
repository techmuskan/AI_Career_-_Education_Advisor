import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { aiService } from "../services/ai.service";
import { quizService } from "../services/quiz.service";

export default function Dashboard() {
  const { user } = useAuth();

  const quizHistory = useMemo(() => quizService.getQuizHistory(), []);
  const savedSuggestions = useMemo(() => aiService.getSavedSuggestions(), []);

  const latestQuiz = quizHistory[0] || null;
  const latestSuggestion = savedSuggestions[0] || null;

  return (
    <main className="page-shell dashboard-grid" style={{ gap: "1.5rem" }}>
      
      {/* HERO */}
      <section className="surface dashboard-hero" style={{ padding: "1.8rem" }}>
        <div className="hero-grid" style={{ alignItems: "center" }}>
          
          {/* LEFT */}
          <div className="hero-panel" style={{ gap: "1.2rem" }}>
            <span className="eyebrow">Dashboard</span>

            <h1 className="hero-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Your career journey, organized.
            </h1>

            <p className="hero-copy">
              Track your quiz results, explore AI-generated career paths, and manage your profile - all in one place.
            </p>

            <div className="hero-actions auth-actions">
              <Link to="/quiz" className="btn-primary">Take quiz</Link>
              <Link to="/career-result" className="btn-secondary">View report</Link>
            </div>
          </div>

          {/* RIGHT (PROFILE CARD) */}
          <div className="surface-soft" style={{ padding: "1.4rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Profile summary</h3>

            <div className="stack">
              <div>
                <p className="small muted">Name</p>
                <h4>{user?.name || "Learner"}</h4>
              </div>

              <div>
                <p className="small muted">Email</p>
                <h4>{user?.email || "Not available"}</h4>
              </div>

              <div>
                <p className="small muted">Class / Year</p>
                <h4>{user?.classLevel || "Not set"}</h4>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="stats-grid" style={{ gap: "1.2rem" }}>
        
        <article className="card stat-card" style={{ textAlign: "center" }}>
          <div className="stat-value">{quizHistory.length}</div>
          <div className="stat-label">Quiz Attempts</div>
        </article>

        <article className="card stat-card" style={{ textAlign: "center" }}>
          <div className="stat-value">{savedSuggestions.length}</div>
          <div className="stat-label">Saved Reports</div>
        </article>

        <article className="card stat-card" style={{ textAlign: "center" }}>
          <div className="stat-value">
            {user?.classLevel ? "Complete" : "Incomplete"}
          </div>
          <div className="stat-label">Profile Status</div>
        </article>

      </section>

      {/* MAIN CONTENT */}
      <section className="two-col" style={{ gap: "1.2rem" }}>

        {/* QUIZ CARD */}
        <section className="card" style={{ padding: "1.4rem" }}>
          <h2 style={{ marginBottom: "0.8rem" }}>Latest Quiz Result</h2>

          {latestQuiz ? (
            <div className="stack">
              <p className="muted">
                {latestQuiz.dominantTypes?.join(" - ") || "No data"}
              </p>

              <p className="small muted">
                {new Date(latestQuiz.createdAt).toLocaleString()}
              </p>

              <div className="chip-wrap">
                {Object.entries(latestQuiz.scores || {}).map(([key, value]) => (
                  <span key={`${latestQuiz.id}-${key}`} className="chip">
                    {key}: {value}
                  </span>
                ))}
              </div>

              <Link className="btn-secondary inline-btn" to="/career-result">
                View full report
              </Link>
            </div>
          ) : (
            <p className="muted">No quiz attempts yet.</p>
          )}
        </section>

        {/* SUGGESTION CARD */}
        <section className="card" style={{ padding: "1.4rem" }}>
          <h2 style={{ marginBottom: "0.8rem" }}>Latest Career Report</h2>

          {latestSuggestion ? (
            <div className="stack">
              <p className="small muted">
                {new Date(latestSuggestion.createdAt).toLocaleString()}
              </p>

              <div className="tag-row">
                {(latestSuggestion.suggestions || []).slice(0, 4).map((item) => (
                  <span key={item.title} className="tag">
                    {item.title}
                  </span>
                ))}
              </div>

              <Link className="btn-secondary inline-btn" to="/career-result">
                Reopen report
              </Link>
            </div>
          ) : (
            <p className="muted">No reports generated yet.</p>
          )}
        </section>

      </section>


    </main>
  );
}