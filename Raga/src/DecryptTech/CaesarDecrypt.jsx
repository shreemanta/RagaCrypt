import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DecryptTech.css";
import bgImg from "../assets/bg2.jpg";

const CaesarDecrypt = () => {
  const [ct, setCt] = useState("");
  const [shift, setShift] = useState("");
  const [pt, setPt] = useState("");

  const handleDecrypt = (e) => {
    e.preventDefault();
    const s = parseInt(shift);
    if (isNaN(s)) return setPt("⚠️ Invalid shift.");
    const result = ct
      .toUpperCase()
      .split("")
      .map((c) =>
        c >= "A" && c <= "Z"
          ? String.fromCharCode(((c.charCodeAt(0) - 65 - s + 26) % 26) + 65)
          : c
      )
      .join("");
    setPt(result);
  };

  return (
    <div className="cipher-page">
         <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
         <div className="cipher-overlay"></div>
      <div className="cipher-content">
        <h1>🧮 Caesar Cipher Decryption</h1>
        <form onSubmit={handleDecrypt} className="cipher-form">
          <input
            type="text"
            placeholder="Ciphertext"
            value={ct}
            onChange={(e) => setCt(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Shift (e.g. 3)"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
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
            Decryption reverses the Caesar shift by moving each letter backward in the alphabet.
          </p>
          <p>
            Example: <code>KHOOR → HELLO</code> with shift = 3.
          </p>
        </section>
        <div className="next-technique">
          <Link to="/decrypt/vigenere" className="next-link">
            Next: Vigenère Decryption →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaesarDecrypt;
