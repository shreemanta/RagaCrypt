import React, { useState } from "react";
import "./Login.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import bgImg from "../assets/loginbg.jpg";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("⚠️ Please fill in both fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("❌ Enter a valid email format.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save user + token + expiry (2h handled inside AuthContext)
        login({
          id: data.user.id,
          fullname: data.user.fullname,
          email: data.user.email,
          role: data.user.role,
          token: data.token,
        });

        navigate("/"); // 🔄 redirect to Home
        console.log("🔐 Login success:", data);
      } else {
        setError("❌ " + (data.error || "Invalid credentials"));
      }
    } catch (err) {
      console.error(err);
      setError("❌ Server error, try again later.");
    }
  };

  return (
    <div className="login-container">
      <div
        className="cipher-bg"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>
      <div className="cipher-overlay"></div>
      <div className="login-content">
        <h1 className="login-heading">🛡️ स्वागत है RagaCrypt में</h1>
        <p className="typing-effect">
          Step into India's own world of digital security...
        </p>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            🔓 Login & Enter
          </button>
          <p className="login-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/registration")}>Register</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
