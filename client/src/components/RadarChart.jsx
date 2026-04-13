import { RIASEC_TYPES } from "../utils/constants";

const center = 120;
const radius = 90;

const toPoint = (angle, valueRatio) => {
  const r = radius * valueRatio;
  const x = center + r * Math.cos(angle);
  const y = center + r * Math.sin(angle);
  return `${x},${y}`;
};

export default function RadarChart({ scores }) {
  const safeScores = scores || {};
  const maxScore = Math.max(...Object.values(safeScores).map(Number), 1);

  const points = RIASEC_TYPES.map((type, idx) => {
    const angle = (Math.PI * 2 * idx) / RIASEC_TYPES.length - Math.PI / 2;
    const ratio = Number(safeScores[type] || 0) / maxScore;
    return toPoint(angle, ratio);
  }).join(" ");

  if (!scores) return null;

  return (
    <div className="card chart-card">
      <h3>RIASEC Score Radar</h3>
      <svg viewBox="0 0 240 240" className="radar-svg" role="img" aria-label="RIASEC radar chart">
        {[0.25, 0.5, 0.75, 1].map((layer) => (
          <circle
            key={layer}
            cx={center}
            cy={center}
            r={radius * layer}
            fill="none"
            className="radar-grid"
          />
        ))}

        {RIASEC_TYPES.map((type, idx) => {
          const angle = (Math.PI * 2 * idx) / RIASEC_TYPES.length - Math.PI / 2;
          const x = center + (radius + 16) * Math.cos(angle);
          const y = center + (radius + 16) * Math.sin(angle);
          return <text key={type} x={x} y={y} className="radar-label">{type}</text>;
        })}

        <polygon points={points} className="radar-area" />
      </svg>
    </div>
  );
}