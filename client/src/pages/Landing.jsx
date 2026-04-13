import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col items-center px-6 py-16">
      {/* Hero Section */}
      <section className="max-w-3xl text-center">
        <p className="text-blue-400 uppercase tracking-widest text-sm mb-3">
          AI Career Guidance Application
        </p>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Discover Your Direction with Data-Driven Career Guidance
        </h1>

        <p className="mt-4 text-gray-400">
          Complete your RIASEC profile, receive AI-powered career suggestions,
          and follow a practical roadmap tailored to your strengths.
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Link
            to="/signup"
            className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-gray-500 px-6 py-3 rounded-xl hover:bg-gray-700"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 grid md:grid-cols-3 gap-6 max-w-6xl w-full">
        {[
          {
            title: "Adaptive RIASEC Profiling",
            desc: "Assess your Realistic, Investigative, Artistic, Social, Enterprising, and Conventional strengths in one guided flow.",
          },
          {
            title: "AI Career Suggestions",
            desc: "Receive explainable AI career recommendations with required skills and growth paths.",
          },
          {
            title: "Career Roadmap",
            desc: "Track your journey from learning fundamentals to projects, internships, and placements.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 p-6 rounded-2xl shadow-md hover:scale-105 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}