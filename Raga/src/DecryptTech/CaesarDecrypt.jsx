// src/DecryptTech/CaesarDecrypt.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../DecryptTech/DecryptTech.css";
import caesarBg from "../assets/bg2.jpg";

const CaesarDecrypt = () => {
  const [ciphertext, setCiphertext] = useState("");
  const [shift, setShift] = useState("");
  const [steps, setSteps] = useState([]);
  const [finalResult, setFinalResult] = useState("");

  const handleDecrypt = (e) => {
    e.preventDefault();
    const shiftAmount = parseInt(shift);
    if (isNaN(shiftAmount)) {
      setFinalResult("⚠️ Please enter a valid number for shift.");
      return;
    }

    let result = "";
    let explanationSteps = [];

    const upperCipher = ciphertext.toUpperCase();

    for (let i = 0; i < upperCipher.length; i++) {
      const char = upperCipher[i];

      if (char >= "A" && char <= "Z") {
        const originalPos = char.charCodeAt(0) - 65;
        const newPos = (originalPos - shiftAmount + 26) % 26;
        const newChar = String.fromCharCode(newPos + 65);
        result += newChar;

        explanationSteps.push({
          id: i + 1,
          content: `Step ${i + 1}: The letter "${char}" is at position ${originalPos} in the alphabet.
          We subtract the shift value (${shiftAmount}): ${originalPos} - ${shiftAmount} = ${originalPos - shiftAmount}.
          After taking modulo 26: ((${originalPos} - ${shiftAmount} + 26) % 26 = ${newPos}),
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
            <h1>🧮 Caesar Cipher Decryption</h1>
            <p>
              Caesar Decryption works by shifting every letter <b>backward</b> in the alphabet
              using the same shift key. Spaces and punctuation remain unchanged.
            </p>

            <form onSubmit={handleDecrypt} className="cipher-form">
              <input
                type="text"
                placeholder="Enter Ciphertext"
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Enter Shift Key (e.g. 3)"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                required
              />
              <button type="submit">Decrypt Message</button>
            </form>

            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                Each letter is moved backward by the shift key. If we go before 'A',
                we wrap around to 'Z'.
              </p>
              <p>
                Example with shift = 3:
                <br />
                <code>KHOOR → HELLO</code>
              </p>
            </section>

            <div className="next-technique">
              <p>➡️ Ready for the next cipher?</p>
              <Link to="/decrypt/vigenere" className="next-link">
                Try Vigenère Decryption →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Output Section */}
        {finalResult && (
          <div className="right-section white-output-box">
            <h2>🔓 Decrypted Output</h2>
            <p><strong>Ciphertext:</strong> {ciphertext.toUpperCase()}</p>
            <p><strong>Shift Key:</strong> {shift}</p>

            <h3>🧠 Step-by-Step Explanation</h3>
            <ul className="step-list">
              {steps.map((step) => (
                <li key={step.id}>{step.content}</li>
              ))}
            </ul>

            <h3>✅ Final Decrypted Message:</h3>
            <div className="final-encryption-box">{finalResult}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaesarDecrypt;
