import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DecryptTech.css";
import bgImg from "../assets/bg2.jpg";

const PlayfairDecrypt = () => {
  const [ct, setCt] = useState("");
  const [key, setKey] = useState("");
  const [pt, setPt] = useState("");
  const [steps, setSteps] = useState([]);
  const [kmatrix, setKmatrix] = useState([]);

  const format = (s) => s.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");

  const matrix = (k) => {
    const seq = Array.from(new Set(format(k) + "ABCDEFGHIKLMNOPQRSTUVWXYZ"));
    const mat = Array.from({ length: 5 }, (_, i) => seq.slice(i * 5, i * 5 + 5));
    setKmatrix(mat);
    return mat;
  };

  const handleDecrypt = (e) => {
    e.preventDefault();
    const fmct = format(ct);
    const km = matrix(key);
    const pos = {};
    km.flat().forEach((c, i) => { pos[c] = [Math.floor(i / 5), i % 5]; });

    const digraphs = fmct.match(/.{1,2}/g) || [];
    let result = "";
    const explanationSteps = [];

    digraphs.forEach(([a, b], index) => {
      const [r1, c1] = pos[a], [r2, c2] = pos[b];
      let p1, p2;

      if (r1 === r2) {
        p1 = km[r1][(c1 + 4) % 5];
        p2 = km[r2][(c2 + 4) % 5];
        explanationSteps.push(`Step ${index + 1}: Digraph '${a}${b}' in same row → shift left → '${p1}${p2}'`);
      } else if (c1 === c2) {
        p1 = km[(r1 + 4) % 5][c1];
        p2 = km[(r2 + 4) % 5][c2];
        explanationSteps.push(`Step ${index + 1}: Digraph '${a}${b}' in same column → shift up → '${p1}${p2}'`);
      } else {
        p1 = km[r1][c2];
        p2 = km[r2][c1];
        explanationSteps.push(`Step ${index + 1}: Digraph '${a}${b}' rectangle rule → '${p1}${p2}'`);
      }

      result += p1 + p2;
    });

    setPt(result);
    setSteps(explanationSteps);
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
      <div className="cipher-overlay"></div>

      <div className="flex-layout">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="cipher-content">
            <h1>🔐 Playfair Cipher Decryption</h1>
            <form className="cipher-form" onSubmit={handleDecrypt}>
              <input
                type="text"
                placeholder="Ciphertext"
                value={ct}
                onChange={(e) => setCt(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Keyword"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
              <button type="submit">Decrypt</button>
            </form>

            <div className="output-section">
              <h3>🔓 Plaintext</h3>
              <div className="output-box">{pt}</div>
            </div>

            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                Uses a 5×5 keyword matrix to reverse digraph substitution:
                same row → shift left; same column → shift up; rectangle rule otherwise.
              </p>
            </section>

            <div className="next-technique">
              <Link to="/decrypt/hill" className="next-link">
                Next: Hill Decryption →
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        {steps.length > 0 && (
          <div className="right-panel">
            <h2 className="output-title">🧠 Step-by-Step Decryption</h2>

            {/* Display the Playfair matrix */}
            <div className="matrix-display">
              <h3>🔹 Playfair Matrix</h3>
              <div className="matrix-grid">
                {kmatrix.map((row, i) => (
                  <div key={i} className="matrix-row">
                    {row.map((cell, j) => (
                      <div key={j} className="matrix-cell">{cell}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <ul className="step-list">
              {steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h3>✅ Final Plaintext:</h3>
            <div className="final-pt">{pt}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayfairDecrypt;
