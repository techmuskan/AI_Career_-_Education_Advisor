import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">CareerPilot AI</Link>

      <nav className="nav-links" aria-label="Primary">
        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        <NavLink to="/quiz" className="nav-link">Quiz</NavLink>
        <NavLink to="/career-result" className="nav-link">Result</NavLink>
        <NavLink to="/chat" className="nav-link">Chat</NavLink>
      </nav>

      <div className="nav-actions">
        {!isAuthenticated && <Link to="/login" className="btn-secondary">Login</Link>}
        {!isAuthenticated && <Link to="/signup" className="btn-primary">Sign Up</Link>}
        {isAuthenticated && (
          <button type="button" className="btn-primary" onClick={onLogout}>
            Log Out
          </button>
        )}
      </div>
    </header>
  );
}