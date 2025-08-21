import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../EncryptTech/EncryptTech.css";
import bgImg from "../assets/bg2.jpg";

const RailFenceEncrypt = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [steps, setSteps] = useState([]);  // ✅ FIXED (no <string[]>)
  const [showOutput, setShowOutput] = useState(false);

  const handleEncrypt = (e) => {
    e.preventDefault();

    const railsCount = parseInt(key, 10);
    if (isNaN(railsCount) || railsCount < 2) {
      setSteps([
        "We need at least 2 rails (zig-zag lines) to do the Rail Fence Cipher. Please enter a number like 2, 3, or 4.",
      ]);
      setEncrypted("");
      setShowOutput(true);
      return;
    }

    // Build rails and record placements
    const rails = Array.from({ length: railsCount }, () => []);
    const placements = [];

    let row = 0;
    let goingDown = true;

    for (let i = 0; i < message.length; i++) {
      const ch = message[i];
      rails[row].push(ch);
      placements.push({ char: ch, rail: row, index: i });

      if (row === 0) goingDown = true;
      else if (row === railsCount - 1) goingDown = false;

      row += goingDown ? 1 : -1;
    }

    const cipher = rails.map(r => r.join("")).join("");

    // Child-friendly explanation
    const stepList = [];
    stepList.push(
      `We will write your message in a zig-zag across ${railsCount} rails (rows). Think of it like stairs: we go down one step at a time, and when we reach the bottom, we go back up.`
    );
    stepList.push(
      `Message: "${message}" — we place each character on a rail as we move down and up.`
    );

    placements.forEach((p, idx) => {
      stepList.push(`Step ${idx + 1}: Put '${p.char}' on rail ${p.rail + 1}.`);
    });

    rails.forEach((r, idx) => {
      stepList.push(`Rail ${idx + 1} reads: "${r.join("")}"`);
    });

    stepList.push("Finally, we read the rails from top to bottom and glue them together.");

    setEncrypted(cipher);
    setSteps(stepList);
    setShowOutput(true);
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
      <div className="cipher-overlay"></div>

      <div className={`cipher-content-wrapper ${showOutput ? "show-output" : ""}`}>
        {/* Left: Input Form */}
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔐 Rail Fence Cipher Encryption</h1>
            <p>Arrange the letters in a zig-zag pattern to hide the original message.</p>

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

            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                We write your message in a zig-zag across the rails (rows). When we
                reach the bottom rail, we “bounce” and go back up. After writing the
                whole message in this pattern, we read each rail from top to bottom and
                join them to get the secret message.
              </p>
              <p>
                Example (2 rails):
                <br />
                <code>WE ARE DISCOVERED → WERDSOEAE DICVRD</code>
              </p>
            </section>

            <div className="next-technique">
              <p>➡️ Ready for the next cipher?</p>
              <Link to="/encrypt/monoalphabetic" className="next-link">
                Try Monoalphabetic Cipher →
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Output */}
        {showOutput && (
          <div className="right-section">
            <h2>🔏 Encrypted Output</h2>
            <div className="white-output-box">
              <p><strong>Original Message:</strong> {message}</p>
              <p><strong>Rails:</strong> {key}</p>

              <h3>🧠 Step-by-Step</h3>
              <ul className="step-list">
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              <h3>✅ Final Encrypted Message</h3>
              <div className="final-encryption-box">{encrypted}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RailFenceEncrypt;
