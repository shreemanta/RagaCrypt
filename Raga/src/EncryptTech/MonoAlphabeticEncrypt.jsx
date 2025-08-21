import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../EncryptTech/EncryptTech.css";
import bgImg from "../assets/bg2.jpg";

const MonoalphabeticEncrypt = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");

  // NEW: state for step-by-step and UI
  const [steps, setSteps] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  const handleEncrypt = (e) => {
    e.preventDefault();

    const normalAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const mappingKey = key.toUpperCase();

    // validate key (26 unique letters A–Z)
    if (
      mappingKey.length !== 26 ||
      new Set(mappingKey).size !== 26 ||
      /[^A-Z]/.test(mappingKey)
    ) {
      setOutput("❌ Invalid key. Please enter a 26-letter unique alphabet (A–Z only).");
      setSteps([]);
      setShowOutput(true);
      setCurrentSlide(0);
      return;
    }

    const upperMessage = message.toUpperCase();
    let encrypted = "";
    const newSteps = [];

    for (let i = 0; i < upperMessage.length; i++) {
      const ch = upperMessage[i];
      const idx = normalAlphabet.indexOf(ch);

      if (idx !== -1) {
        const mapped = mappingKey[idx];
        encrypted += mapped;

        newSteps.push({
          title: `Step ${i + 1}: '${ch}' → '${mapped}'`,
          detail: (
            `We look at the letter "${ch}". In the normal A to Z alphabet, `
            + `"${ch}" is at position ${idx} (A=0, B=1, ... Z=25). `
            + `Your secret key says that position ${idx} becomes "${mapped}". `
            + `So we swap "${ch}" with "${mapped}".`
          ),
          before: ch,
          after: mapped,
          reason: `Substitution using your 26-letter key at index ${idx}.`
        });
      } else {
        // keep spaces, punctuation, numbers as-is
        encrypted += ch;
        newSteps.push({
          title: `Step ${i + 1}: '${ch}' stays '${ch}'`,
          detail: (
            `This character "${ch}" is not a letter (it might be a space or symbol), `
            + `so we leave it exactly the same.`
          ),
          before: ch,
          after: ch,
          reason: "Non-letter characters are not changed."
        });
      }
    }

    setOutput(encrypted);
    setSteps(newSteps);
    setShowOutput(true);
    setCurrentSlide(0);
  };

  const normalAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const mappingKey = key.toUpperCase();

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
      <div className="cipher-overlay"></div>

      {/* WRAPPER to enable left(form) + right(output) layout */}
      <div className={`cipher-content-wrapper ${showOutput ? "show-output" : ""}`}>
        {/* LEFT: original content (unchanged inputs) */}
        <div className="left-section">
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

            {/* Keep your original "How it works" section */}
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

        {/* RIGHT: output panel with mapping table + step slider */}
        {showOutput && (
          <div className="right-section">
            <h2>🔏 Encrypted Output</h2>

            <div className="white-output-box">
              <p><strong>Original Message:</strong> {message.toUpperCase()}</p>
              <p><strong>Mapping Key (26 letters):</strong> {mappingKey}</p>
              <p><strong>Encrypted Message:</strong></p>
              <div className="final-encryption-box">{output}</div>

              {/* Mapping table (normal alphabet vs key) */}
              <div className="matrix-display">
                <h4>🔎 Mapping Table</h4>
                <div className="matrix-grid">
                  {/* Row 1: A-Z */}
                  <div className="matrix-row">
                    {normalAlphabet.split("").map((c, i) => (
                      <div key={`n-${i}`} className="matrix-cell">{c}</div>
                    ))}
                  </div>
                  {/* Row 2: key letters */}
                  <div className="matrix-row">
                    {mappingKey.length === 26
                      ? mappingKey.split("").map((c, i) => (
                          <div key={`k-${i}`} className="matrix-cell">{c}</div>
                        ))
                      : normalAlphabet.split("").map((_, i) => (
                          <div key={`k-empty-${i}`} className="matrix-cell">•</div>
                        ))
                    }
                  </div>
                </div>
              </div>

              {/* Step-by-step slider */}
              {steps.length > 0 && (
                <div className="step-slider">
                  <div className="slide-card">
                    <h3>
                      {steps[currentSlide].title}{" "}
                      <span style={{ fontWeight: "normal" }}>
                        ({currentSlide + 1}/{steps.length})
                      </span>
                    </h3>
                    <p style={{ margin: "0.5rem 0" }}>
                      <strong>Before:</strong> {steps[currentSlide].before} &nbsp;→&nbsp;
                      <strong>After:</strong> {steps[currentSlide].after}
                    </p>
                    <p style={{ margin: "0.5rem 0" }}>
                      <strong>Why:</strong> {steps[currentSlide].reason}
                    </p>
                    <p style={{ marginTop: "0.5rem" }}>{steps[currentSlide].detail}</p>
                  </div>

                  <div className="slider-controls">
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
                      disabled={currentSlide === 0}
                    >
                      ◀ Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((s) => Math.min(steps.length - 1, s + 1))}
                      disabled={currentSlide === steps.length - 1}
                    >
                      Next ▶
                    </button>
                  </div>

                  <div className="slider-dots">
                    {steps.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`dot ${idx === currentSlide ? "active" : ""}`}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to step ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonoalphabeticEncrypt;
