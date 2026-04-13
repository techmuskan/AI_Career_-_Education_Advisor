import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!form.email.trim() || !form.password.trim()) {
      return "Email and password are required.";
    }
    if (!form.email.includes("@")) {
      return "Please enter a valid email.";
    }
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login({
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-gray-800 text-white px-4">
      <form
        onSubmit={onSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        <p className="text-gray-400 text-center mt-2">
          Sign in to continue your AI-guided career journey
        </p>

        {/* Email */}
        <div className="mt-6">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => {
              setError("");
              setForm({ ...form, email: e.target.value });
            }}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => {
              setError("");
              setForm({ ...form, password: e.target.value });
            }}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-4 text-sm">
          Don’t have an account?
          <Link to="/signup" className="text-blue-500 ml-1">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}