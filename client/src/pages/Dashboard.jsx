import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { aiService } from "../services/ai.service";
import { quizService } from "../services/quiz.service";

export default function Dashboard() {
  const { user } = useAuth();

  const quizHistory = useMemo(() => quizService.getQuizHistory(), []);
  const savedSuggestions = useMemo(() => aiService.getSavedSuggestions(), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6">
      {/* Header */}
      <section className="bg-gray-900 p-6 rounded-2xl shadow mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome back, {user?.name || "Learner"}
        </p>

        <div className="flex gap-4 mt-4">
          <Link
            to="/quiz"
            className="bg-blue-600 px-5 py-2 rounded-xl hover:bg-blue-700"
          >
            Take Quiz
          </Link>
          <Link
            to="/career-result"
            className="border border-gray-500 px-5 py-2 rounded-xl hover:bg-gray-700"
          >
            View Result
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-5 rounded-2xl">
          <h3 className="text-lg font-semibold">Profile</h3>
          <p className="text-gray-400 mt-2">Name: {user?.name || "N/A"}</p>
          <p className="text-gray-400">Email: {user?.email || "N/A"}</p>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl">
          <h3 className="text-lg font-semibold">Quiz Attempts</h3>
          <p className="text-gray-400 mt-2">
            {quizHistory.length} attempts saved
          </p>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl">
          <h3 className="text-lg font-semibold">Saved Suggestions</h3>
          <p className="text-gray-400 mt-2">
            {savedSuggestions.length} sets available
          </p>
        </div>
      </section>

      {/* Quiz History */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Previous Quiz Results</h2>

        {quizHistory.length === 0 ? (
          <div className="bg-gray-900 p-5 rounded-xl text-gray-400">
            No quiz history yet.
          </div>
        ) : (
          <div className="space-y-4">
            {quizHistory.map((item) => (
              <div key={item.id} className="bg-gray-900 p-5 rounded-xl">
                <h4 className="font-semibold">
                  {item.dominantTypes.join(" - ")}
                </h4>
                <p className="text-sm text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(item.scores).map(([key, value]) => (
                    <span
                      key={`${item.id}-${key}`}
                      className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved Suggestions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Saved Career Suggestions</h2>

        {savedSuggestions.length === 0 ? (
          <div className="bg-gray-900 p-5 rounded-xl text-gray-400">
            No suggestions saved yet.
          </div>
        ) : (
          <div className="space-y-4">
            {savedSuggestions.map((entry) => (
              <div key={entry.id} className="bg-gray-900 p-5 rounded-xl">
                <p className="text-sm text-gray-400">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {(entry.suggestions || []).map((item) => (
                    <span
                      key={`${entry.id}-${item.title}`}
                      className="bg-blue-600 px-3 py-1 rounded-full text-sm"
                    >
                      {item.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}