import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CareerResult from "./pages/CareerResult";
import Chat from "./pages/Chat";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Signup from "./pages/Signup";

export default function App() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="app-layout">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/quiz"
          element={(
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/career-result"
          element={(
            <ProtectedRoute>
              <CareerResult />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/chat"
          element={(
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          )}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="app-footer">
        <p>© {currentYear} CareerPilot AI</p>
      </footer>
    </div>
  );
}
