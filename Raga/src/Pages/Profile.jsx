// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
// import backgroundGif from "../assets/crypto-bg.gif"; // Uncomment if added

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [typedName, setTypedName] = useState("");

  useEffect(() => {
    const name = currentUser?.name || currentUser?.email?.split("@")[0];
    if (name) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedName(name.slice(0, i + 1));
        i++;
        if (i === name.length) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <div className="overlay" />
      <div className="profile-content">
        <h1 className="profile-heading">
          Welcome, <span className="typing">{typedName}</span>
        </h1>
        <p className="quote">“Those who understand ciphers, hold the keys to secrets.”</p>

        <div className="profile-stats">
          <div className="stat-card">🔐 7 Cipher Techniques</div>
          <div className="stat-card">📜 5 Decryption Modules</div>
          <div className="stat-card">📈 Your Progress: Beginner</div>
        </div>

        <div className="button-group">
          <button onClick={() => navigate("/encrypt")} className="action-button">
            Explore Ciphers
          </button>
          <button onClick={() => navigate("/history")} className="action-button">
            View History
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
