import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../EncryptTech/EncryptTech.css";
import caesarBg from "../assets/bg2.jpg";

const CaesarEncrypt = () => {
  const [message, setMessage] = useState("");
  const [shift, setShift] = useState("");
  const [steps, setSteps] = useState([]);
  const [finalResult, setFinalResult] = useState("");

  const handleEncrypt = (e) => {
    e.preventDefault();
    const shiftAmount = parseInt(shift);
    if (isNaN(shiftAmount)) {
      setFinalResult("⚠️ Please enter a valid number for shift.");
      return;
    }

    let result = "";
    let explanationSteps = [];

    const upperMessage = message.toUpperCase();

    for (let i = 0; i < upperMessage.length; i++) {
      const char = upperMessage[i];

      if (char >= "A" && char <= "Z") {
        const originalPos = char.charCodeAt(0) - 65;
        const newPos = (originalPos + shiftAmount) % 26;
        const newChar = String.fromCharCode(newPos + 65);
        result += newChar;

        explanationSteps.push({
          id: i + 1,
          content: `Step ${i + 1}: The letter "${char}" is at position ${originalPos} in the alphabet.
          We add the shift value (${shiftAmount}): ${originalPos} + ${shiftAmount} = ${originalPos + shiftAmount}.
          After taking modulo 26: (${originalPos + shiftAmount} % 26 = ${newPos}),
          we get new position ${newPos}, which is "${newChar}".`
        });
      } else {
        result += char;
        explanationSteps.push({
          id: i + 1,
          content: `Step ${i + 1}: The character "${char}" is not a letter, so we keep it unchanged.`
        });
      }
    }

    setFinalResult(result);
    setSteps(explanationSteps);
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${caesarBg})` }}></div>
      <div className="cipher-overlay"></div>

      <div className={`cipher-content-wrapper ${finalResult ? "show-output" : ""}`}>
        {/* Left Input Section */}
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔐 Caesar Cipher Encryption</h1>
            <p>
              The Caesar Cipher is a very simple way to hide a message.
              It works by shifting every letter in your message forward by a fixed number.
              For example, with a shift of 3: A becomes D, B becomes E, etc.
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

            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                Each letter is moved forward by the number you choose (called the shift key).
                After 'Z', we start again from 'A'. Any spaces or punctuation are not changed.
              </p>
              <p>
                For example, with a shift of 3:
                <br />
                <code>HELLO → KHOOR</code>
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

        {/* Right Output Section */}
        {finalResult && (
          <div className="right-section white-output-box">
            <h2>🔏 Encrypted Output</h2>
            <p><strong>Original Message:</strong> {message.toUpperCase()}</p>
            <p><strong>Shift Key:</strong> {shift}</p>

            <h3>🧠 Step-by-Step Explanation</h3>
            <ul className="step-list">
              {steps.map((step) => (
                <li key={step.id}>{step.content}</li>
              ))}
            </ul>

            <h3>✅ Final Encrypted Message:</h3>
            <div className="final-encryption-box">{finalResult}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaesarEncrypt;
