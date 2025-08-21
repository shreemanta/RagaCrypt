import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DecryptTech.css";
import bgImg from "../assets/bg2.jpg";

const RailFenceDecrypt = () => {
  const [ct, setCt] = useState("");
  const [rails, setRails] = useState(2);
  const [pt, setPt] = useState("");
  const [steps, setSteps] = useState([]);

  const decrypt = (text, key) => {
    if (key < 2) return text;

    let explanation = [];
    explanation.push(`Step 1: Ciphertext = "${text}"`);
    explanation.push(`Step 2: Number of rails = ${key}`);

    const arr = Array.from({ length: key }, () => []);
    let dir = false, r = 0;

    // Step 3: Mark zigzag positions
    for (let i = 0; i < text.length; i++) {
      arr[r].push(null);
      explanation.push(`Placing placeholder at rail ${r}, column ${i}`);
      dir = r === 0 || r === key - 1 ? !dir : dir;
      r += dir ? 1 : -1;
    }

    // Step 4: Fill ciphertext row by row
    let idx = 0;
    arr.forEach((row, ri) =>
      row.forEach((_, i, a) => {
        a[i] = text[idx++];
        explanation.push(`Filling rail ${ri}, position ${i} with "${a[i]}"`);
      })
    );

    // Step 5: Read zigzag to reconstruct plaintext
    dir = false;
    r = 0;
    const result = Array.from({ length: text.length }, (_, i) => {
      const ch = arr[r].shift();
      explanation.push(`Reading "${ch}" from rail ${r}, column ${i}`);
      dir = r === 0 || r === key - 1 ? !dir : dir;
      r += dir ? 1 : -1;
      return ch;
    }).join("");

    explanation.push(`✅ Final Plaintext = "${result}"`);
    setSteps(explanation);

    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPt(decrypt(ct, parseInt(rails)));
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
      <div className="cipher-overlay"></div>

      {/* Two-column layout */}
      <div className="two-column">
        {/* LEFT SIDE */}
        <div className="cipher-content left-panel">
          <h1>🚂 Rail Fence Cipher Decryption</h1>
          <form className="cipher-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ciphertext"
              value={ct}
              onChange={(e) => setCt(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Number of Rails"
              value={rails}
              onChange={(e) => setRails(e.target.value)}
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
              Rail Fence decryption reconstructs the zigzag pattern and reads it
              row-by-row to recover the message.
            </p>
          </section>

          <div className="next-technique">
            <Link to="/decrypt/monoalphabetic" className="next-link">
              Next: Monoalphabetic Decryption →
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        {steps.length > 0 && (
          <div className="right-panel white-output-box">
            <h2 className="output-title">🧠 Step-by-Step Explanation</h2>
            <div className="output-white">
              <div className="final-pt">Final Plaintext: {pt}</div>
              <ul className="step-list">
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RailFenceDecrypt;
