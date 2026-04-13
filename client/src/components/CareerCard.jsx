export default function CareerCard({ career, index }) {
  return (
    <article className="card career-card">
      <h3>
        {index + 1}. {career.title}
      </h3>
      <p className="muted">{career.reason}</p>

      <h4>Required Skills</h4>
      <div className="chip-wrap">
        {(career.requiredSkills || []).map((skill) => (
          <span className="chip" key={skill}>{skill}</span>
        ))}
      </div>

      {!!career.roadmap?.length && (
        <>
          <h4>Roadmap</h4>
          <ol className="roadmap-list">
            {career.roadmap.map((step, stepIndex) => (
              <li key={`${career.title}-step-${stepIndex}`}>{step}</li>
            ))}
          </ol>
        </>
      )}
    </article>
  );
}