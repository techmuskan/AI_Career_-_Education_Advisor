export default function CareerCard({ career, index }) {
  return (
    <article className="card career-card">
      <h3 className="font-bold text-lg">
        {index + 1}. {career.title}
      </h3>
      <p className="muted">{career.reason}</p>

      <h4 className="py-2 font-semibold text-md">Required Skills</h4>
      <div className="chip-wrap">
        {(career.requiredSkills || []).map((skill) => (
          <span className="chip" key={skill}>{skill}</span>
        ))}
      </div>

      {!!career.roadmap?.length && (
        <>
          <h4 className="py-2 font-semibold text-md">Roadmap</h4>
          <ol className="roadmap-list text-amber-600">
            {career.roadmap.map((step, stepIndex) => (
              <li key={`${career.title}-step-${stepIndex}`}>{step}</li>
            ))}
          </ol>
        </>
      )}
    </article>
  );
}