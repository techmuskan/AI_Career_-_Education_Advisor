import { SCALE_OPTIONS } from "../utils/constants";

export default function QuestionCard({ question, value, onSelect }) {
  return (
    <article className="card question-card">
      <div className="question-meta">
        <span>Q{question.id}</span>
        <span className="pill">{question.category}</span>
      </div>
      <h3>{question.text}</h3>

      <div className="scale-grid" role="radiogroup" aria-label={`Question ${question.id}`}>
        {SCALE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(question.id, option.value)}
            className={`scale-btn ${value === option.value ? "selected" : ""}`}
            title={option.label}
            aria-pressed={value === option.value}
          >
            {option.value}
          </button>
        ))}
      </div>
    </article>
  );
}