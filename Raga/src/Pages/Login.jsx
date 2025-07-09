import React, { useState } from "react";
import "./Login.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("⚠️ Please fill in both fields.");
    } else if (!validateEmail(email)) {
      setError("❌ Enter a valid email format.");
    } else if (password.length !== 8) {
      setError("🔐 Password must be exactly 8 characters.");
    } else {
      setError("");
      login(); // fake login from AuthContext
      navigate("/"); // redirect to homepage
      console.log("🔐 Logging in:", email, password);

    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-heading">🛡️ स्वागत है RagaCrypt में</h1>
        <p className="typing-effect">
          Step into India's own world of digital security...
        </p>

        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmFzdjl4OTE0OTdvMHR5ajRvdHBvdHNndDNsYno1cG4xdXd4MDd6cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/It8qXjo51Rgek/giphy.gif"
          alt="Encryption Animation"
          className="login-gif"
        />

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="🔒 Password (8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            🔓 Login & Enter
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default Login;
