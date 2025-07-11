import React, { useState } from "react";
import "../DecryptTech/DecryptTech.css";
import bgImg from "../assets/bg2.jpg";

const mod = (n, m) => ((n % m) + m) % m;

// Helper to compute inverse modulo 26 for 2x2 matrix
function modInverse(a, m) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
}

function inverseMatrix(matrix, size) {
  if (size === 2) {
    const [a, b, c, d] = matrix;
    const det = mod(a * d - b * c, 26);
    const invDet = modInverse(det, 26);
    if (invDet === null) return null;

    return [
      mod(d * invDet, 26),
      mod(-b * invDet, 26),
      mod(-c * invDet, 26),
      mod(a * invDet, 26),
    ];
  }

  if (size === 3) {
    const m = matrix;
    const det =
      m[0] * (m[4] * m[8] - m[5] * m[7]) -
      m[1] * (m[3] * m[8] - m[5] * m[6]) +
      m[2] * (m[3] * m[7] - m[4] * m[6]);
    const invDet = modInverse(det, 26);
    if (invDet === null) return null;

    const adj = [
      mod(m[4] * m[8] - m[5] * m[7], 26),
      mod(-(m[1] * m[8] - m[2] * m[7]), 26),
      mod(m[1] * m[5] - m[2] * m[4], 26),

      mod(-(m[3] * m[8] - m[5] * m[6]), 26),
      mod(m[0] * m[8] - m[2] * m[6], 26),
      mod(-(m[0] * m[5] - m[2] * m[3]), 26),

      mod(m[3] * m[7] - m[4] * m[6], 26),
      mod(-(m[0] * m[7] - m[1] * m[6]), 26),
      mod(m[0] * m[4] - m[1] * m[3], 26),
    ];

    return adj.map((val) => mod(val * invDet, 26));
  }

  return null;
}

const HillDecrypt = () => {
  const [cipher, setCipher] = useState("");
  const [matrixSize, setMatrixSize] = useState(2);
  const [keyMatrix, setKeyMatrix] = useState(Array(4).fill(""));
  const [output, setOutput] = useState("");

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setMatrixSize(size);
    setKeyMatrix(Array(size * size).fill(""));
  };

  const handleDecrypt = (e) => {
    e.preventDefault();
    const clean = cipher.toUpperCase().replace(/[^A-Z]/g, "");
    const matrix = keyMatrix.map(Number);

    if (matrix.some(isNaN)) {
      setOutput("⚠️ Invalid key matrix. Please use numbers only.");
      return;
    }

    const inverse = inverseMatrix(matrix, matrixSize);
    if (!inverse) {
      setOutput("⚠️ Matrix is not invertible mod 26. Choose another key.");
      return;
    }

    const mat = [];
    for (let i = 0; i < matrixSize; i++) {
      mat.push(inverse.slice(i * matrixSize, (i + 1) * matrixSize));
    }

    const chunks = [];
    for (let i = 0; i < clean.length; i += matrixSize) {
      let chunk = clean.slice(i, i + matrixSize);
      while (chunk.length < matrixSize) chunk += "X";
      chunks.push(chunk);
    }

    const decrypted = chunks
      .map((group) => {
        const vector = group.split("").map((c) => c.charCodeAt(0) - 65);
        const result = mat.map((row) =>
          row.reduce((sum, num, i) => sum + num * vector[i], 0)
        );
        return result.map((val) => String.fromCharCode(mod(val, 26) + 65)).join("");
      })
      .join("");

    setOutput(decrypted);
  };

  return (
    <div className="cipher-page">
     <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
     <div className="cipher-overlay"></div>
      <div className="cipher-overlay"></div>

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
          <p>
            Example: If ciphertext is <code>POH</code> and key is a valid 3×3 matrix, we reverse the encryption to get back the original <code>ACT</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HillDecrypt;
