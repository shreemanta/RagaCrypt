import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../EncryptTech/EncryptTech.css";
import bgImg from "../assets/bg2.jpg"; 
const RailFenceEncrypt = () => {
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
        <h1>🔐 Rail Fence Cipher Encryption</h1>
        <p>Arrange the letters in a zig-zag pattern to obscure the original message.</p>

        <form onSubmit={handleEncrypt} className="cipher-form">
          <input
            type="text"
            placeholder="Enter Plaintext"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Enter Number of Rails (e.g. 2)"
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
            Characters are written in a zig-zag pattern and then read row-by-row to encrypt the message.
          </p>
          <p>
            For example:
            <br />
            <code>HELLO WORLD (2 rails) → HLOOL ELWRD</code>
          </p>
        </section>

        <div className="next-technique">
          <p>➡️ Ready for the next cipher?</p>
          <Link to="/encrypt/monoalphabetic" className="next-link">Try Monoalphabetic Cipher →</Link>
        </div>
      </div>
    </div>
  );
};

export default RailFenceEncrypt;
