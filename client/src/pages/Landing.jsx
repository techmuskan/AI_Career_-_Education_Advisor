import { Link } from "react-router-dom";

export default function Landing() {
	return (
		<main className="page-shell" style={{ gap: "2rem" }}>

			{/* HERO */}
			<section className="surface" style={{ padding: "2rem", textAlign: "center" }}>
				<span className="eyebrow">Career Saathi</span>

				<h1 className="hero-title" style={{ margin: "0.6rem auto", maxWidth: "16ch" }}>
					Not sure what to do next?
				</h1>

				<p className="hero-copy" style={{ margin: "0 auto", maxWidth: "48ch" }}>
					Answer a few questions. We’ll show you the direction.
				</p>

				<div
					className="hero-actions auth-actions"
					style={{ justifyContent: "center", marginTop: "1.2rem" }}
				>
					<Link to="/quiz" className="btn-primary">Start Quiz</Link>
					<Link to="/signup" className="btn-secondary">Continue</Link>
				</div>
			</section>

			{/* PROCESS FLOW */}
			<section className="grid-3" style={{ gap: "1.2rem" }}>
				
				<div className="card center">
					<div className="feature-icon">1</div>
					<h3>Answer</h3>
					<p className="muted">Quick personality + interest quiz</p>
				</div>

				<div className="card center">
					<div className="feature-icon">2</div>
					<h3>Analyze</h3>
					<p className="muted">System finds your strengths</p>
				</div>

				<div className="card center">
					<div className="feature-icon">3</div>
					<h3>Decide</h3>
					<p className="muted">Get roles + next steps</p>
				</div>

			</section>


		</main>
	);
}