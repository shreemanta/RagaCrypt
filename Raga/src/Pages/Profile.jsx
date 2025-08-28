import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const quotes = [
  "🔐 Security is not a product, but a process.",
  "🛡️ Strong encryption = strong freedom.",
  "📜 Ciphers are the language of secrets.",
  "⚡ Every key has a lock, every lock has a story.",
  "💡 Knowledge is power, encryption is freedom.",
];

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [typedName, setTypedName] = useState("");
  const [quote, setQuote] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  // Typing animation for name
  useEffect(() => {
    if (!currentUser) return;

    const displayName =
      currentUser.fullname || currentUser.username || currentUser.email;

    let i = 0;
    const interval = setInterval(() => {
      setTypedName(displayName.slice(0, i + 1));
      i++;
      if (i === displayName.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [currentUser]);

  // Random quote
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Session countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem("expiry");
      if (!expiry) return;

      const remaining = new Date(expiry) - new Date();
      if (remaining <= 0) {
        logout();
        navigate("/login");
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s left`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser) return null; // ProtectedRoute handles redirection

  return (
    <div className="profile-container">
      <div className="overlay" />
      <div className="profile-content fade-in">
        {/* Hero Section */}
        <div className="profile-hero slide-up">
          <img
            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser.email}`}
            alt="avatar"
            className="avatar"
          />
          <h1 className="profile-heading">
            Welcome, <span className="typing">{typedName}</span> 👋
          </h1>
          <p className="profile-sub">
            {currentUser.role || "Explorer of Ciphers"} | {currentUser.email}
          </p>
          <p className="session-info">⏳ Session: {timeLeft}</p>
        </div>

        {/* Quote */}
        <p className="quote fade-in-delayed">{quote}</p>

        {/* Stats Section */}
        <div className="profile-stats">
          <div className="stat-card hover-scale">🔐 7 Cipher Techniques</div>
          <div className="stat-card hover-scale">📜 5 Decryption Modules</div>
          <div className="stat-card hover-scale">
            📈 Progress: Beginner → Intermediate
          </div>
          <div className="stat-card hover-scale">🏆 Rank: Codebreaker</div>
        </div>

        {/* Action Buttons */}
        <div className="button-group">
          <button
            onClick={() => navigate("/encrypt")}
            className="action-button hover-glow"
          >
            🔒 Encrypt Message
          </button>
          <button
            onClick={() => navigate("/decrypt")}
            className="action-button hover-glow"
          >
            🔓 Decrypt Message
          </button>
          <button
            onClick={() => navigate("/history")}
            className="action-button hover-glow"
          >
            📜 View History
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="action-button hover-glow"
          >
            ⚙️ Settings
          </button>
          <button onClick={handleLogout} className="logout-button hover-scale">
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
