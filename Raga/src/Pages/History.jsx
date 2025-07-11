// src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import './History.css';
import backgroundGif from '../assets/gif.gif';


const mockHistory = [
  {
    id: 1,
    type: 'Caesar Cipher',
    action: 'Encryption',
    input: 'HELLO',
    output: 'KHOOR',
    time: '2025-07-10 15:05',
  },
  {
    id: 2,
    type: 'Vigenère Cipher',
    action: 'Decryption',
    input: 'RIJVS',
    output: 'HELLO',
    time: '2025-07-10 14:45',
  },
  {
    id: 3,
    type: 'Hill Cipher',
    action: 'Encryption',
    input: 'HELP',
    output: 'KFAN',
    time: '2025-07-09 17:00',
  },
];

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Simulate fetching history
    setTimeout(() => {
      setHistory(mockHistory);
    }, 500);
  }, []);

  return (
    <div className="history-container">
      <h2 className="history-title">Your Encryption & Decryption History</h2>
      <div className="history-list">
        {history.length === 0 ? (
          <p className="loading-text">Loading history...</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-card">
              <h3>{item.type} - {item.action}</h3>
              <p><strong>Input:</strong> {item.input}</p>
              <p><strong>Output:</strong> {item.output}</p>
              <p className="timestamp">{item.time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
