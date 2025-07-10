import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DecryptTech.css";
import bgImg from "../assets/bg2.jpg";

const MonoalphabeticDecrypt = () => {
  const [ct, setCt] = useState("");
  const [key, setKey] = useState("");
  const [pt, setPt] = useState("");

  const decrypt = (text, k) => {
    if (k.length !== 26) return "Key must be 26 letters.";
    const map = {};
    k = k.toUpperCase();
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((c, i) => (map[k[i]] = c));
    return text
      .toUpperCase()
      .split("")
      .map(c => map[c] || c)
      .join("");
  };

  return (
    <div className="cipher-page">
         <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
         <div className="cipher-overlay"></div>
      <div className="cipher-content">
        <h1>🔄 Monoalphabetic Cipher Decryption</h1>
        <form className="cipher-form" onSubmit={e => { e.preventDefault(); setPt(decrypt(ct, key)); }}>
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
  );
};

export default MonoalphabeticDecrypt;
