import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../EncryptTech/EncryptTech.css";
import bgImg from "../assets/bg2.jpg";
const MonoalphabeticEncrypt = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");

  const handleEncrypt = (e) => {
    e.preventDefault();
    const result = message.split('').reverse().join('') + " (Simulated)";
    setOutput(result);
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
      <div className="cipher-overlay"></div>

      <div className="cipher-content">
        <h1>🔐 Monoalphabetic Cipher Encryption</h1>
        <p>Replace each letter with a fixed corresponding letter in a shuffled alphabet.</p>

        <form onSubmit={handleEncrypt} className="cipher-form">
          <input
            type="text"
            placeholder="Enter Plaintext"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Mapping Key (26-letter shuffled alphabet)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
          <button type="submit">Encrypt Message</button>
        </form>

        <div className="output-section">
          <h3>🔏 Encrypted Output</h3>
          <div className="output-box">{output}</div>
        </div>

        <section className="explanation">
          <h3>📚 How It Works</h3>
          <p>
            Each letter from the normal alphabet is replaced by a corresponding letter in the key.
          </p>
          <p>
            For example:
            <br />
            <code>HELLO → QAZZI (with a sample mapping)</code>
          </p>
        </section>

        <div className="next-technique">
          <p>➡️ Ready for the next cipher?</p>
          <Link to="/encrypt/playfair" className="next-link"> Try Playfair Cipher →</Link>
        </div>
      </div>
    </div>
  );
};

export default MonoalphabeticEncrypt;
