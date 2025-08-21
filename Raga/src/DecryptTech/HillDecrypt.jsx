import React, { useState } from "react";
import "../DecryptTech/DecryptTech.css";
import bgImg from "../assets/bg2.jpg";

const mod = (n, m) => ((n % m) + m) % m;

function modInverse(a, m) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  return null;
}

// NOTE: these helper functions mirror the math used previously but also
// return intermediate values (det, adjugate) for explanation.
function computeDeterminant(matrix, size) {
  if (size === 2) {
    const [a, b, c, d] = matrix;
    return a * d - b * c;
  } else if (size === 3) {
    const m = matrix;
    return (
      m[0] * (m[4] * m[8] - m[5] * m[7]) -
      m[1] * (m[3] * m[8] - m[5] * m[6]) +
      m[2] * (m[3] * m[7] - m[4] * m[6])
    );
  }
  return 0;
}

function computeAdjugate(matrix, size) {
  if (size === 2) {
    const [a, b, c, d] = matrix;
    // adjugate (cofactor transpose) raw values
    return [d, -b, -c, a];
  } else if (size === 3) {
    const m = matrix;
    // using the same formula as in your inverseMatrix helper:
    return [
      m[4] * m[8] - m[5] * m[7],
      -(m[1] * m[8] - m[2] * m[7]),
      m[1] * m[5] - m[2] * m[4],

      -(m[3] * m[8] - m[5] * m[6]),
      m[0] * m[8] - m[2] * m[6],
      -(m[0] * m[5] - m[2] * m[3]),

      m[3] * m[7] - m[4] * m[6],
      -(m[0] * m[7] - m[1] * m[6]),
      m[0] * m[4] - m[1] * m[3],
    ];
  }
  return [];
}

function inverseMatrixFlatFromAdj(adjRaw, invDet) {
  // multiply adjugate by invDet and reduce mod 26
  return adjRaw.map((v) => mod(v * invDet, 26));
}

const HillDecrypt = () => {
  const [cipher, setCipher] = useState("");
  const [matrixSize, setMatrixSize] = useState(2);
  const [keyMatrix, setKeyMatrix] = useState(Array(4).fill(""));
  const [output, setOutput] = useState("");

  // slides + navigation
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setMatrixSize(size);
    setKeyMatrix(Array(size * size).fill(""));
    setSlides([]);
    setCurrentSlide(0);
    setOutput("");
  };

  const handleDecrypt = (e) => {
    e.preventDefault();

    const clean = cipher.toUpperCase().replace(/[^A-Z]/g, "");
    const matrixNums = keyMatrix.map(Number);

    // basic validation
    if (matrixNums.some(isNaN)) {
      setOutput("⚠️ Invalid key matrix. Please use numbers only.");
      setSlides([{ type: "error", message: "Invalid key matrix. Use numbers only." }]);
      setCurrentSlide(0);
      return;
    }

    // Compute determinant (raw) and invDet (mod 26)
    const detRaw = computeDeterminant(matrixNums, matrixSize);
    const detMod = mod(detRaw, 26);
    const invDet = modInverse(detRaw, 26);

    if (invDet === null) {
      setOutput("⚠️ Matrix is not invertible mod 26. Choose another key.");
      setSlides([{ type: "error", message: "Matrix not invertible mod 26. Choose another key." }]);
      setCurrentSlide(0);
      return;
    }

    // compute adjugate (raw), adjugate mod 26, inverse flat (mod 26)
    const adjRaw = computeAdjugate(matrixNums, matrixSize);
    const adjMod = adjRaw.map((v) => mod(v, 26));
    const inverseFlat = inverseMatrixFlatFromAdj(adjRaw, invDet);

    // reshape original key matrix (as numbers) and inverse matrix (rows)
    const origMat = Array.from({ length: matrixSize }, (_, i) =>
      matrixNums.slice(i * matrixSize, (i + 1) * matrixSize)
    );
    const inverseMat = Array.from({ length: matrixSize }, (_, i) =>
      inverseFlat.slice(i * matrixSize, (i + 1) * matrixSize)
    );

    // chunk ciphertext (pad with X)
    const chunks = [];
    for (let i = 0; i < clean.length; i += matrixSize) {
      let chunk = clean.slice(i, i + matrixSize);
      while (chunk.length < matrixSize) chunk += "X";
      chunks.push(chunk);
    }

    // decrypt chunks and build detailed step info
    const slideData = [];

    // Slide 0: Show key, determinant, adjugate, inverse matrix
    slideData.push({
      type: "matrix",
      title: "Key & Inverse Matrix Details",
      origMat,
      detRaw,
      detMod,
      invDet,
      adjRaw,
      adjMod,
      inverseMat,
    });

    // For each chunk, compute detailed row multiplications
    let finalPlain = "";
    chunks.forEach((group, idx) => {
      const vector = group.split("").map((c) => c.charCodeAt(0) - 65);

      // compute per-row breakdown
      const rows = inverseMat.map((row, rIdx) => {
        const products = row.map((num, colIdx) => {
          const prod = num * vector[colIdx];
          return {
            num,
            vectorVal: vector[colIdx],
            prod,
          };
        });
        const sum = products.reduce((s, p) => s + p.prod, 0);
        const reduced = mod(sum, 26);
        const letter = String.fromCharCode(reduced + 65);
        return { rowIndex: rIdx, row, products, sum, reduced, letter };
      });

      const resultStr = rows.map((r) => r.letter).join("");
      finalPlain += resultStr;

      slideData.push({
        type: "chunk",
        title: `Step ${idx + 1}: Decrypt chunk '${group}' → '${resultStr}'`,
        chunk: group,
        vector,
        rows,
        resultStr,
      });
    });

    // final output slide (optional summary)
    slideData.push({
      type: "final",
      title: "Final Decrypted Text",
      fullPlain: finalPlain,
    });

    setOutput(finalPlain);
    setSlides(slideData);
    setCurrentSlide(0);
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
      <div className="cipher-overlay"></div>

      <div className="flex-layout">
        {/* LEFT PANEL (unchanged) */}
        <div className="left-panel">
          <div className="cipher-content">
            <h1>🔓 Hill Cipher Decryption (2×2 or 3×3)</h1>
            <p>Enter your ciphertext and key matrix to decrypt the original message.</p>

            <form onSubmit={handleDecrypt} className="cipher-form">
              <label>
                Matrix Size:
                <select value={matrixSize} onChange={handleSizeChange}>
                  <option value={2}>2 × 2</option>
                  <option value={3}>3 × 3</option>
                </select>
              </label>

              <input
                type="text"
                placeholder="Enter Ciphertext"
                value={cipher}
                onChange={(e) => setCipher(e.target.value)}
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

              <button type="submit">Decrypt</button>
            </form>

            <div className="output-section">
              <h3>📝 Decrypted Output</h3>
              <div className="output-box">{output}</div>
            </div>

            <div className="explanation">
              <h3>📘 How It Works</h3>
              <p>
                Hill cipher decryption involves finding the modular inverse of the key matrix, then using matrix multiplication on blocks of ciphertext. The numerical results are mapped back to letters.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: slides */}
        {slides.length > 0 && (
          <div className="right-panel">
            <div className="step-slider">
              <div className="slide-card">
                {/* render slide depending on type */}
                {slides[currentSlide].type === "matrix" && (
                  <>
                    <h3>🔎 {slides[currentSlide].title}</h3>

                    <h4>Original Key Matrix</h4>
                    <div className="matrix-display">
                      <div className="matrix-grid">
                        {slides[currentSlide].origMat.map((row, i) => (
                          <div key={i} className="matrix-row">
                            {row.map((cell, j) => (
                              <div key={j} className="matrix-cell">{cell}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <p><strong>Determinant (raw):</strong> {slides[currentSlide].detRaw}</p>
                    <p><strong>Determinant mod 26:</strong> {slides[currentSlide].detMod}</p>
                    <p><strong>Inverse of determinant mod 26 (invDet):</strong> {slides[currentSlide].invDet}</p>

                    <h4>Adjugate (raw)</h4>
                    <div className="matrix-display">
                      <div className="matrix-grid">
                        {(() => {
                          const arr = slides[currentSlide].adjRaw;
                          const size = Math.sqrt(arr.length);
                          return Array.from({ length: size }, (_, i) =>
                            <div key={i} className="matrix-row">
                              {arr.slice(i*size, i*size + size).map((v, j) =>
                                <div key={j} className="matrix-cell">{v}</div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <h4>Adjugate mod 26</h4>
                    <div className="matrix-display">
                      <div className="matrix-grid">
                        {(() => {
                          const arr = slides[currentSlide].adjMod;
                          const size = Math.sqrt(arr.length);
                          return Array.from({ length: size }, (_, i) =>
                            <div key={i} className="matrix-row">
                              {arr.slice(i*size, i*size + size).map((v, j) =>
                                <div key={j} className="matrix-cell">{v}</div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <h4>Inverse Key Matrix (mod 26)</h4>
                    <div className="matrix-display">
                      <div className="matrix-grid">
                        {slides[currentSlide].inverseMat.map((row, i) => (
                          <div key={i} className="matrix-row">
                            {row.map((cell, j) => (
                              <div key={j} className="matrix-cell">{cell}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {slides[currentSlide].type === "chunk" && (
                  <>
                    <h3>🧠 {slides[currentSlide].title}</h3>

                    <p><strong>Text:</strong> {slides[currentSlide].chunk}</p>
                    <p>
                      <strong>Vector:</strong>{" "}
                      [{slides[currentSlide].vector.join(", ")}]
                    </p>

                    <h4>Row-wise calculations</h4>
                    {slides[currentSlide].rows.map((r) => (
                      <div key={r.rowIndex} style={{ marginBottom: 8 }}>
                        <div style={{ fontWeight: "600" }}>Row {r.rowIndex + 1}:</div>
                        <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                          {/* build expression like: 15*P(15) + 17*O(14) = 225 + 238 = 463 -> 463 mod 26 = 21 -> V */}
                          {r.products.map((p, i) => (
                            <span key={i}>
                              {p.num}×{r.vectorValName ? r.vectorValName : ""}{/* placeholder */}{/* we'll render inline below */}
                            </span>
                          ))}
                        </div>

                        {/* More readable breakdown */}
                        <div style={{ marginTop: 6 }}>
                          <div>
                            <strong>Multiplications:</strong>{" "}
                            {r.products.map((p, i) => `${p.num}×${p.vectorVal} = ${p.prod}`).join("  +  ")}
                          </div>
                          <div>
                            <strong>Sum:</strong> {r.sum}
                          </div>
                          <div>
                            <strong>Sum mod 26:</strong> {r.reduced}
                          </div>
                          <div>
                            <strong>Letter:</strong> {r.letter}
                          </div>
                        </div>
                      </div>
                    ))}

                    <p style={{ marginTop: 8 }}><strong>Decrypted Text:</strong> {slides[currentSlide].resultStr}</p>
                  </>
                )}

                {slides[currentSlide].type === "final" && (
                  <>
                    <h3>✅ {slides[currentSlide].title}</h3>
                    <div className="slide-card">
                      <p><strong>Decrypted text:</strong> {slides[currentSlide].fullPlain}</p>
                    </div>
                  </>
                )}

                {slides[currentSlide].type === "error" && (
                  <div>
                    <h3>⚠️ Error</h3>
                    <p>{slides[currentSlide].message}</p>
                  </div>
                )}
              </div>

              {/* controls */}
              <div className="slider-controls">
                <button
                  onClick={() => setCurrentSlide((s) => s - 1)}
                  disabled={currentSlide === 0}
                >
                  Previous
                </button>

                <span>{currentSlide + 1} / {slides.length}</span>

                <button
                  onClick={() => setCurrentSlide((s) => s + 1)}
                  disabled={currentSlide === slides.length - 1}
                >
                  Next
                </button>
              </div>

              <div className="slider-dots">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`dot ${idx === currentSlide ? "active" : ""}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HillDecrypt;
