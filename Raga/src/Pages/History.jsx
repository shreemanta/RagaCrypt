// src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import './History.css';
import backgroundGif from '../assets/gif.gif';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (!user || !token) throw new Error("User not logged in");

      const res = await fetch(`http://localhost:3001/api/history/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setHistory(data);
      } else {
        setError(data.error || "Failed to load history");
      }
    } catch (err) {
      console.error("Fetch history error:", err);
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="history-container" style={{ backgroundImage: `url(${backgroundGif})` }}>
      <h2 className="history-title">Your Encryption & Decryption History</h2>
      <div className="history-list">
        {loading ? (
          <p className="loading-text">Loading history...</p>
        ) : error ? (
          <p className="loading-text">{error}</p>
        ) : history.length === 0 ? (
          <p className="loading-text">No history found.</p>
        ) : (
          history.map((item) => (
            <div key={item._id} className="history-card">
              <h3>{item.action} - {item.type}</h3>
              <p><strong>Input:</strong> {item.input}</p>
              <p><strong>Output:</strong> {item.output}</p>
              <p className="timestamp">{new Date(item.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
