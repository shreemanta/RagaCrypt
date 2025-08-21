import React, { useState } from "react";
import "../EncryptTech/EncryptTech.css";
import hillBg from "../assets/bg2.jpg";

const mod = (n, m) => ((n % m) + m) % m;

const HillEncrypt = () => {
  const [message, setMessage] = useState("");
  const [matrixSize, setMatrixSize] = useState(2); // default 2x2
  const [keyMatrix, setKeyMatrix] = useState(Array(4).fill(""));
  const [output, setOutput] = useState("");
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  // --- Helpers ---
  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setMatrixSize(size);
    setKeyMatrix(Array(size * size).fill(""));
  };

  const handleEncrypt = (e) => {
    e.preventDefault();
    const cleanMsg = message.toUpperCase().replace(/[^A-Z]/g, "");
    const matrix = keyMatrix.map(Number);

    if (matrix.some(isNaN)) {
      setOutput("⚠️ Please enter only numbers in the matrix.");
      setSlides([
        <div className="slide-card" key="err">
          <h3>⚠️ Invalid Matrix</h3>
          <p>Please provide only numbers for the key matrix.</p>
        </div>,
      ]);
      setShowOutput(true);
      return;
    }

    // reshape matrix
    const mat = [];
    for (let i = 0; i < matrixSize; i++) {
      mat.push(matrix.slice(i * matrixSize, (i + 1) * matrixSize));
    }

    // make chunks
    const chunks = [];
    for (let i = 0; i < cleanMsg.length; i += matrixSize) {
      let chunk = cleanMsg.slice(i, i + matrixSize);
      while (chunk.length < matrixSize) chunk += "X"; // padding
      chunks.push(chunk);
    }

    // encrypt with details
    const encryptedChunks = [];
    const slidesArr = [];

    slidesArr.push(
      <div className="slide-card" key="intro">
        <h3>Step 1 — Prepare Message</h3>
        <p>Convert to uppercase, remove spaces/punctuation, and pad with X to fit {matrixSize}-letter blocks.</p>
        <p><strong>Cleaned:</strong> {cleanMsg}</p>
        <p><strong>Blocks:</strong> {chunks.join(" | ")}</p>
      </div>
    );

    slidesArr.push(
      <div className="slide-card" key="matrix">
        <h3>Step 2 — Key Matrix</h3>
        <p>The key matrix you entered is used for multiplication.</p>
        <div className="matrix-grid">
          {mat.map((row, r) => (
            <div className="matrix-row" key={r}>
              {row.map((val, c) => (
                <span className="matrix-cell" key={c}>{val}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );

    chunks.forEach((group, idx) => {
      const vector = group.split("").map((c) => c.charCodeAt(0) - 65);
      const result = mat.map((row) =>
        row.reduce((sum, num, i) => sum + num * vector[i], 0)
      );
      const enc = result.map((val) => String.fromCharCode(mod(val, 26) + 65)).join("");
      encryptedChunks.push(enc);

      slidesArr.push(
        <div className="slide-card" key={`block-${idx}`}>
          <h3>Step {idx + 3} — Encrypt Block {idx + 1}</h3>
          <p><strong>Block:</strong> {group}</p>
          <p><strong>Vector:</strong> [{vector.join(", ")}]</p>
          <p><strong>Multiply:</strong> Key × Vector = [{result.join(", ")}]</p>
          <p><strong>Modulo 26:</strong> [{result.map((v) => mod(v, 26)).join(", ")}]</p>
          <p><strong>Encrypted:</strong> {enc}</p>
        </div>
      );
    });

    slidesArr.push(
      <div className="slide-card" key="final">
        <h3>✅ Final Encrypted Message</h3>
        <div className="final-encryption-box">{encryptedChunks.join("")}</div>
      </div>
    );

    setOutput(encryptedChunks.join(""));
    setSlides(slidesArr);
    setCurrentSlide(0);
    setShowOutput(true);
  };

  // slider controls
  const prev = () => setCurrentSlide((s) => Math.max(0, s - 1));
  const next = () => setCurrentSlide((s) => Math.min(slides.length - 1, s + 1));
  const goto = (i) => setCurrentSlide(i);

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${hillBg})` }} />
      <div className="cipher-overlay"></div>

      <div className={`cipher-content-wrapper ${showOutput ? "show-output" : ""}`}>
        {/* Left Section — original content */}
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔐 Hill Cipher Encryption (2×2 or 3×3)</h1>
            <p>Choose a matrix size, enter your key matrix, and encrypt your message.</p>

            <form onSubmit={handleEncrypt} className="cipher-form">
              <label>
                Matrix Size:
                <select value={matrixSize} onChange={handleSizeChange}>
                  <option value={2}>2 × 2</option>
                  <option value={3}>3 × 3</option>
                </select>
              </label>

              <input
                type="text"
                placeholder="Enter Plaintext"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />

              <div
                className="matrix-inputs"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${matrixSize}, 1fr)`,
                  gap: "0.5rem",
                }}
              >
                {keyMatrix.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`K${idx + 1}`}
                    value={val}
                    onChange={(e) => {
                      const updated = [...keyMatrix];
                      updated[idx] = e.target.value;
                      setKeyMatrix(updated);
                    }}
                  />
                ))}
              </div>

              <button type="submit">Encrypt</button>
            </form>

            <div className="output-section">
              <h3>🔏 Encrypted Output</h3>
              <div className="output-box">{output}</div>
            </div>

            <div className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                Hill cipher encrypts blocks of letters using matrix multiplication and modular arithmetic.
                Each letter is converted to a number (A=0 to Z=25). The message is processed in blocks
                matching your matrix size and multiplied by your key matrix. The resulting numbers are
                converted back to letters using mod 26.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section — Slides */}
        {showOutput && (
          <div className="right-section">
            <h2>🔏 Step-by-Step (every block)</h2>

            <div className="white-output-box">
              {slides.length > 0 && (
                <>
                  <div className="step-slider" style={{ marginTop: 12 }}>
                    <div className="slide-card">{slides[currentSlide]}</div>

                    <div className="slider-controls" style={{ marginTop: 10 }}>
                      <button onClick={prev} disabled={currentSlide === 0}>◀ Prev</button>
                      <span> Slide {currentSlide + 1} / {slides.length} </span>
                      <button onClick={next} disabled={currentSlide === slides.length - 1}>Next ▶</button>
                    </div>

                    <div className="slider-dots" style={{ marginTop: 8 }}>
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          className={`dot ${i === currentSlide ? "active" : ""}`}
                          onClick={() => goto(i)}
                          aria-label={`Go to slide ${i + 1}`}
                          style={{
                            width: 8, height: 8, borderRadius: 999, margin: 4,
                            border: "none", background: i === currentSlide ? "#00b894" : "#bbb"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HillEncrypt;
