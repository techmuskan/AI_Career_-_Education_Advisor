import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    classLevel: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (
      !form.name.trim() ||
      !form.classLevel.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      return "All fields are required.";
    }
    if (!form.email.includes("@")) {
      return "Enter a valid email.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
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
      await signup({
        name: form.name.trim(),
        classLevel: form.classLevel.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      navigate("/quiz");
    } catch (err) {
      setError(err.message || "Signup failed");
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
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
        <p className="text-gray-400 text-center mt-2">
          Start your AI-powered career journey
        </p>

        {/* Name */}
        <div className="mt-5">
          <label className="block text-sm mb-1">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              setError("");
              setForm({ ...form, name: e.target.value });
            }}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        {/* Class */}
        <div className="mt-4">
          <label className="block text-sm mb-1">Class / Year</label>
          <input
            type="text"
            value={form.classLevel}
            onChange={(e) => {
              setError("");
              setForm({ ...form, classLevel: e.target.value });
            }}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="12th, BTech 2nd Year"
          />
        </div>

        {/* Email */}
        <div className="mt-4">
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
            placeholder="Enter password"
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
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-4 text-sm">
          Already have an account?
          <Link to="/login" className="text-blue-500 ml-1">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}