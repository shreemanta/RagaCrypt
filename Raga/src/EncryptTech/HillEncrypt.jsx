import React, { useState } from "react";
import "../EncryptTech/EncryptTech.css";
import hillBg from "../assets/bg2.jpg";

const mod = (n, m) => ((n % m) + m) % m;

const HillEncrypt = () => {
  const [message, setMessage] = useState("");
  const [matrixSize, setMatrixSize] = useState(2); // default to 2x2
  const [keyMatrix, setKeyMatrix] = useState(Array(4).fill(""));
  const [output, setOutput] = useState("");

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
      return;
    }

    const mat = [];
    for (let i = 0; i < matrixSize; i++) {
      mat.push(matrix.slice(i * matrixSize, (i + 1) * matrixSize));
    }

    const chunks = [];
    for (let i = 0; i < cleanMsg.length; i += matrixSize) {
      let chunk = cleanMsg.slice(i, i + matrixSize);
      while (chunk.length < matrixSize) chunk += "X"; // padding
      chunks.push(chunk);
    }

    const encrypted = chunks
      .map((group) => {
        const vector = group.split("").map((c) => c.charCodeAt(0) - 65);
        const result = mat.map((row) =>
          row.reduce((sum, num, i) => sum + num * vector[i], 0)
        );
        return result.map((val) => String.fromCharCode(mod(val, 26) + 65)).join("");
      })
      .join("");

    setOutput(encrypted);
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${hillBg})` }} />
      <div className="cipher-overlay"></div>

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
  );
};

export default HillEncrypt;
