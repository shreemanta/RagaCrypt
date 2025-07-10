import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../EncryptTech/EncryptTech.css";
import caesarBg from "../assets/bg2.jpg"; // Your Caesar-related gif

const CaesarEncrypt = () => {
  const [message, setMessage] = useState("");
  const [shift, setShift] = useState("");
  const [output, setOutput] = useState("");

  const handleEncrypt = (e) => {
    e.preventDefault();
    const shiftAmount = parseInt(shift);
    if (isNaN(shiftAmount)) {
      setOutput("⚠️ Please enter a valid number for shift.");
      return;
    }

    const encrypted = message
      .toUpperCase()
      .split("")
      .map((char) => {
        if (char >= "A" && char <= "Z") {
          const shifted = ((char.charCodeAt(0) - 65 + shiftAmount) % 26) + 65;
          return String.fromCharCode(shifted);
        }
        return char;
      })
      .join("");

    setOutput(encrypted);
  };

  return (
    <div className="cipher-page">
      <div
        className="cipher-bg"
        style={{ backgroundImage: `url(${caesarBg})` }}
      ></div>
      <div className="cipher-overlay"></div>

      <div className="cipher-content">
        <h1>🔐 Caesar Cipher Encryption</h1>
        <p>
          Learn how Julius Caesar protected his military secrets by shifting
          letters in the alphabet.
        </p>

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
            placeholder="Enter Shift Key (e.g. 3)"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
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
            The Caesar Cipher is a substitution cipher where each letter in your
            message is replaced by a letter some fixed number of positions down
            the alphabet.
          </p>
          <p>
            For example, with a shift of 3:
            <br />
            <code>HELLO → KHOOR</code>
          </p>
          <p>
            Caesar used this method to keep his communications secret — now you
            can explore how it works hands-on.
          </p>
        </section>
        <div className="next-technique">
          <p>➡️ Ready for the next cipher?</p>
          <Link to="/encrypt/vigenere" className="next-link">
            Try Vigenère Cipher →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaesarEncrypt;
