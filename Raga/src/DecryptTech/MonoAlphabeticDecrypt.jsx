import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DecryptTech.css";
import bgImg from "../assets/bg2.jpg";

const MonoalphabeticDecrypt = () => {
  const [ct, setCt] = useState("");
  const [key, setKey] = useState("");
  const [pt, setPt] = useState("");
  const [steps, setSteps] = useState([]);

  const handleDecrypt = (e) => {
    e.preventDefault();

    const text = ct.toUpperCase();
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, "");
    if (cleanKey.length !== 26) {
      alert("Key must be 26 letters (A-Z mapping).");
      return;
    }

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const map = {};
    alphabet.split("").forEach((c, i) => (map[cleanKey[i]] = c));

    let decrypted = "";
    let explanationSteps = [];

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (map[ch]) {
        const pChar = map[ch];
        decrypted += pChar;
        explanationSteps.push({
          id: i + 1,
          content: `Step ${i + 1}: Cipher letter '${ch}' → Plain letter '${pChar}'`
        });
      } else {
        decrypted += ch;
      }
    }

    setPt(decrypted);
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
            <h1>🔄 Monoalphabetic Cipher Decryption</h1>
            <form
              className="cipher-form"
              onSubmit={handleDecrypt}
            >
              <input
                type="text"
                placeholder="Ciphertext"
                value={ct}
                onChange={(e) => setCt(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="26‑letter Key (A→Z mapping)"
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
                Maps each letter using a fixed 1-to-1 substitution key. Reverse mapping recovers the original text.
              </p>
            </section>

            <div className="next-technique">
              <Link to="/decrypt/playfair" className="next-link">
                Next: Playfair Decryption →
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - step-by-step explanation */}
        {steps.length > 0 && (
          <div className="right-panel">
            <h2 className="output-title">🧠 Step-by-Step Decryption</h2>
            <ul className="step-list">
              {steps.map((s) => (
                <li key={s.id}>{s.content}</li>
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

export default MonoalphabeticDecrypt;
